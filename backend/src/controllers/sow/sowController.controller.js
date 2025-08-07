// backend/src/controllers/sow/sowController.controller.js

import { asyncHandler } from '../../utils/asyncHandler.js';
import { SOW } from '../../models/core/sow.model.js';
import { Client } from '../../models/core/client.model.js';
import { Employee } from '../../models/core/employee.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import mongoose from 'mongoose';

// 1. Create SOW
export const createSOW = asyncHandler(async (req, res) => {
  const data = req.body;
  console.log("Creating SOW with data:", data);
  const { clientRef, sowName, status, ...rest } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;

  if (!clientRef || !sowName) {
    throw new ApiError(400, "Client reference and SOW Name are required.");
  }

  // --- Transaction Recommended ---
  // For creating/updating multiple models, a transaction is best practice.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate client ownership
    const client = await Client.findOne({ companyRef: companyId, _id: clientRef }).session(session);
    if (!client) throw new ApiError(404, 'Client not found or Unauthorized');

    // 2. Create SOW
    const sowData = {
      ...req.body,
      companyRef: companyId,
      auditInfo: {
        createdBy: employeeId,
        lastModifiedBy: employeeId,
      }
    }

    const sow = await SOW.create(sowData, { session });

    // 3. Optionally push into client's activeSOWs[]
    client.serviceAgreements.activeSOWs.push(sow._id);
    await client.save({ session });

    await session.commitTransaction();

    session.endSession();

    res.status(201).json(new ApiResponse(201, sow, 'SOW created successfully'));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }

  // Validate client ownership
  const client = await Client.findOne({ companyRef: companyId, _id: data.clientRef });
  if (!client) throw new ApiError(404, 'Client not found or unauthorized');

  const sow = await SOW.create(sowData);

  // Optionally push into client's activeSOWs[]
  client.serviceAgreements.activeSOWs.push(sow._id);
  await client.save();

  res.status(201).json({ success: true, data: sow });
});

// 2. Get All SOWs
export const getAllSOWs = asyncHandler(async (req, res) => {
  const filter = { companyRef: req.company._id };

  if (req.query.sowStatus) filter['status.sowStatus'] = req.query.sowStatus; // Corrected field
  if (req.query.clientRef) filter.clientRef = req.query.clientRef;

  const sows = await SOW.find(filter)
    .populate('clientRef', 'clientInfo.clientName')
    .populate('assignedEmployees', 'personalInfo.firstName personalInfo.lastName')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, sows, 'SOWs fetched successfully'));
});

// 3. Get SOW by ID
export const getSOWById = asyncHandler(async (req, res) => {
  const sow = await SOW.findOne({
    _id: req.params.id,
    companyRef: req.company._id
  }).populate([
    { path: 'clientRef', select: 'clientInfo.clientName' },
    { path: 'assignedEmployees', select: 'personalInfo.firstName personalInfo.lastName' },
    { path: 'auditInfo.createdBy', select: 'personalInfo.firstName' },
    { path: 'auditInfo.lastModifiedBy', select: 'personalInfo.firstName' }
  ]);

  if (!sow) throw new ApiError(404, 'SOW not found');
  res.status(200).json(new ApiResponse(200, sow, 'SOW fetched successfully'));
});

// 4. Update SOW
export const updateSOW = asyncHandler(async (req, res) => {
  const { companyRef, clientRef, auditInfo, ...updateData } = req.body;
  const sow = await SOW.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!sow) throw new ApiError(404, 'SOW not found');

  Object.assign(sow, updateData);
  sow.auditInfo.lastModifiedBy = req.employee._id;

  const updatedSow = await sow.save();
  res.status(200).json(new ApiResponse(200, updatedSow, "SOW updated successfully."));
});

// 5. Delete SOW
export const deleteSOW = asyncHandler(async (req, res) => {
  const { sowId } = req.params;
  const companyId = req.company?._id;

  if (!companyId) {
    throw new ApiError(400, 'Company Authentication is required');
  }
  const sow = await SOW.findOneAndDelete({ sowId, companyRef: companyId });
  if (!sow) throw new ApiError(404, 'SOW not found');

  // Remove from client's activeSOWs if applicable
  const client = await Client.findOne({ _id: sow.clientRef, companyRef: companyId });
  if (client) {
    client.serviceAgreements.activeSOWs = client.serviceAgreements.activeSOWs.filter(sowId => sowId.toString() !== sow._id.toString());
    await client.save();
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { sowId: sow.sowId },
      'SOW deleted successfully'
    )
  );
});

// 5. Assign Employees to SOW
export const assignEmployeesToSOW = asyncHandler(async (req, res) => {
  const { employeeIds } = req.body;
  const { id: sowId } = req.params;
  const companyId = req.company._id;

  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    throw new ApiError(400, "employeeIds must be a non-empty array.");
  }

  const sow = await SOW.findOne({ _id: sowId, companyRef: companyId }).select('_id');
  if (!sow) throw new ApiError(404, 'SOW not found');

  // --- This operation should also be transactional ---
  // Update many employees at once for efficiency.
  // Add the SOW to the sowAssignments array if it doesn't already exist.
  const result = await Employee.updateMany(
    {
      _id: { $in: employeeIds },
      companyRef: companyId,
      'sowAssignments.sowRef': { $ne: sow._id } // Only update if not already assigned
    },
    {
      $push: {
        sowAssignments: {
          sowRef: sow._id,
          assignedDate: new Date(),
          isActive: true
        }
      }
    }
  );

  res.status(200).json(new ApiResponse(200, { matched: result.matchedCount, modified: result.modifiedCount }, `${result.modifiedCount} employees assigned successfully.`));
});

// 6. Change SOW Status (Lifecycle)
export const changeSOWStatus = asyncHandler(async (req, res) => {
  const { newStatus } = req.body;
  const sow = await SOW.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!sow) throw new ApiError(404, 'SOW not found');

  // The enum in the model already provides validation, but this is an extra layer.
  const allowed = ['Draft', 'Active', 'Paused', 'Completed', 'Terminated'];
  if (!allowed.includes(newStatus)) throw new ApiError(400, 'Invalid SOW status');

  sow.status.sowStatus = newStatus; // Correctly target the nested field
  sow.auditInfo.lastModifiedBy = req.employee._id;
  await sow.save();

  res.status(200).json(new ApiResponse(200, { newStatus }, `SOW status changed to ${newStatus}`));
});

// 7. Get SOWs for a specific client
export const getClientSOWs = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;

  const sows = await SOW.find({
    clientRef: clientId,
    companyRef: req.company._id
  }).select('sowName status contractPeriod assignedEmployees specialties');

  res.status(200).json({ success: true, data: sows });
});