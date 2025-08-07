// backend/src/controllers/organization/roleContoller.controller.js

// backend/src/controllers/organization/roleController.controller.js
import { Role } from '../../models/organization/role.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllRoles = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  if (!companyId) {
    throw new ApiError(400, "Company ID missing from token");
  }

  const roles = await Role.find({ companyRef: companyId }).sort({
    roleLevel: 1,
    roleName: 1
  });

  return res.status(200).json(
    new ApiResponse(200, roles, "Roles retrieved successfully")
  );
});

export const createRole = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  const roleData = {
    ...req.body,
    companyRef: companyId,
    createdBy: req.userId
  };

  const newRole = new Role(roleData);
  await newRole.save();

  return res.status(201).json(
    new ApiResponse(201, newRole, "Role created successfully")
  );
});

export const updateRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const updates = {
    ...req.body,
    lastModifiedBy: req.userId,
  };

  const updatedRole = await Role.findOneAndUpdate(
    { roleId },
    updates,
    { new: true, runValidators: true }
  );

  if (!updatedRole) {
    throw new ApiError(404, "Role not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedRole, "Role updated successfully")
  );
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;

  const deleted = await Role.findOneAndDelete({ roleId });
  if (!deleted) {
    throw new ApiError(404, "Role not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Role deleted successfully")
  );
});