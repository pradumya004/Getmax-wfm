// backend/src/controllers/payer.controller.js

import axios from 'axios';
import { Payer } from '../../models/data/payer.model.js';
import { transformClaimMDPayer } from '../../scripts/adapters/claimmdAdapter.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";


export const syncClaimMDPayers = async (req, res) => {
  const companyRef = req.company?._id;
  const employeeId = req.employee?._id;

  if (!companyRef || !employeeId) {
    throw new ApiError(401, "User or company context is missing.");
  }

  try {
    const { data } = await axios.get("https://www.claim.md/payer_list.json");

    if (!Array.isArray(data)) {
      throw new ApiError(500, "Failed to fetch a valid payer list from the source.");
    }

    const bulkOps = data.map(payer => {
      const mapped = transformClaimMDPayer(payer, companyRef, employeeId);
      return {
        updateOne: {
          filter: { 'identifiers.x12PayerId': mapped.identifiers.x12PayerId, companyRef },
          update: { $set: mapped },
          upsert: true
        }
      };
    });

    if (bulkOps.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No payers to sync.",
      });
    }

    const result = await Payer.bulkWrite(bulkOps);

    console.log(result);

    res.status(200).json(new ApiResponse(
      200,
      {
        details: {
          created: result.upsertedCount,
          updated: result.modifiedCount,
          total: result.upsertedCount + result.modifiedCount,
        }
      },
      `Sync complete. ${result.upsertedCount} payers created, ${result.modifiedCount} updated.`
    ));
  } catch (err) {
    console.error("❌ Payer Sync Failed:", err.message || err);
    res.status(500).json(new ApiResponse(500, {}, err.message || err));
  }
};


export const getAllPayers = asyncHandler(async (req, res) => {
  const companyRef = req.company?._id;
  const { page = 1, limit = 50, sortBy = 'payerInfo.payerName', sortOrder = 'asc', ...queryParams } = req.query;

  const filter = { companyRef };

  if (queryParams.payerType) filter['payerInfo.payerType'] = queryParams.payerType;
  if (queryParams.state) filter['coverageInfo.serviceAreas.state'] = queryParams.state;
  if (queryParams.isPreferred) filter['systemConfig.isPreferred'] = queryParams.isPreferred === 'true';

  // Search functionality
  if (queryParams.search) {
    filter['payerInfo.payerName'] = { $regex: queryParams.search, $options: 'i' };
  }

  const payers = await Payer.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('payerInfo.payerName payerInfo.payerType performanceMetrics.priorityScore systemConfig.isPreferred') // Select only needed fields
    .lean(); // Use .lean() for faster read-only queries

  const totalPayers = await Payer.countDocuments(filter);

  res.status(200).json(new ApiResponse(
    200,
    {
      data: payers,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total: totalPayers,
        totalPages: Math.ceil(totalPayers / limit)
      }
    },
    'Payers fetched successfully.'
  ));
});