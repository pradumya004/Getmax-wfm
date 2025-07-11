// backend/src/controllers/organization/designationController.controller.js

import { Designation } from "../../models/designation.model.js";
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllDesignations = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  if (!companyId) {
    throw new ApiError(400, "Company ID missing from token");
  }

  const designations = await Designation.find({ companyRef: companyId })
    .sort({ level: 1, designationName: 1 });

  return res.status(200).json(
    new ApiResponse(200, designations, "Designations retrieved successfully")
  );
});

export const createDesignation = asyncHandler(async (req, res) => {
  const companyId = req.company._id;

  const data = {
    ...req.body,
    companyRef: companyId,
    createdBy: req.userId,
  };

  const newDesignation = new Designation(data);
  await newDesignation.save();

  return res.status(201).json(
    new ApiResponse(201, newDesignation, "Designation created successfully")
  );
});

export const updateDesignation = asyncHandler(async (req, res) => {
  const { designationId } = req.params;
  const userId = req.userId;

  const updates = {
    ...req.body,
    lastModifiedBy: userId,
  };

  const updated = await Designation.findOneAndUpdate(
    { designationId },
    updates,
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, "Designation not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updated, "Designation updated successfully")
  );
});

export const deleteDesignation = asyncHandler(async (req, res) => {
  const { designationId } = req.params;

  const designation = await Designation.findOne({ designationId });
  if (!designation) {
    throw new ApiError(404, "Designation not found");
  }

  // Check if designation has employees (implement this check based on your models)
  try {
    const hasEmployees = await designation.populate("employees");
    if (hasEmployees?.employees?.length > 0) {
      throw new ApiError(400, "Cannot delete designation with active employees");
    }
  } catch (populateError) {
    // If populate fails, continue with deletion
    console.warn("Could not check employees for designation:", populateError.message);
  }

  await designation.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Designation deleted successfully")
  );
});