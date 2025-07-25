// backend/src/controllers/organization/departmentContoller.controller.js

import { Department } from '../../models/organization/department.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllDepartments = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  if (!companyId) {
    throw new ApiError(400, "Company ID missing from token");
  }

  const departments = await Department.find({ companyRef: companyId })
    .sort({ departmentLevel: 1, departmentName: 1 });

  return res.status(200).json(
    new ApiResponse(200, departments, "Departments retrieved successfully")
  );
});

export const createDepartment = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  const departmentData = {
    ...req.body,
    companyRef: companyId,
    createdBy: req.userId,
  };

  const department = new Department(departmentData);
  await department.save();

  return res.status(201).json(
    new ApiResponse(201, department, "Department created successfully")
  );
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { deptId } = req.params;
  const updates = {
    ...req.body,
    lastModifiedBy: req.userId,
  };

  const updated = await Department.findOneAndUpdate(
    { departmentId: deptId },
    updates,
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, "Department not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updated, "Department updated successfully")
  );
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { deptId } = req.params;

  const department = await Department.findOne({ departmentId: deptId });
  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  // Check if department can be deleted (implement this method in your model)
  const canDelete = department.canBeDeleted ? await department.canBeDeleted() : true;
  if (!canDelete) {
    throw new ApiError(400, "Cannot delete department with active employees or subdepartments");
  }

  await department.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Department deleted successfully")
  );
});