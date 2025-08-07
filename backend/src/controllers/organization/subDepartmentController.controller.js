// backend/src/controllers/organization/subDepartmentController.controller.js

import { SubDepartment } from "../../models/organization/subdepartment.model.js";
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllSubDepartments = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  if (!companyId) {
    throw new ApiError(400, "Company ID missing");
  }

  const subdepartments = await SubDepartment.find({ companyRef: companyId })
    .populate("departmentRef", "departmentName")
    .sort({ subdepartmentName: 1 });

  return res.status(200).json(
    new ApiResponse(200, subdepartments, "Sub-departments retrieved successfully")
  );
});

export const createSubDepartment = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  const userId = req.userId;

  const subdeptData = {
    ...req.body,
    companyRef: companyId,
    createdBy: userId,
  };

  const newSubDepartment = new SubDepartment(subdeptData);
  await newSubDepartment.save();

  // Populate the department reference before sending response
  await newSubDepartment.populate("departmentRef", "departmentName");

  return res.status(201).json(
    new ApiResponse(201, newSubDepartment, "Sub-department created successfully")
  );
});

export const updateSubDepartment = asyncHandler(async (req, res) => {
  const { subdeptId } = req.params;
  const userId = req.userId;

  const updates = {
    ...req.body,
    lastModifiedBy: userId,
  };

  const updated = await SubDepartment.findOneAndUpdate(
    { subdepartmentId: subdeptId },
    updates,
    { new: true, runValidators: true }
  ).populate("departmentRef", "departmentName");

  if (!updated) {
    throw new ApiError(404, "Sub-department not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updated, "Sub-department updated successfully")
  );
});

export const deleteSubDepartment = asyncHandler(async (req, res) => {
  const { subdeptId } = req.params;

  const subdept = await SubDepartment.findOne({ subdepartmentId: subdeptId });
  if (!subdept) {
    throw new ApiError(404, "Sub-department not found");
  }

  // Check if subdepartment can be deleted
  const canDelete = subdept.canBeDeleted ? await subdept.canBeDeleted() : true;
  if (!canDelete) {
    throw new ApiError(400, "Cannot delete subdepartment with active employees");
  }

  await subdept.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Sub-department deleted successfully")
  );
});