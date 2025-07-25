// backend/src/controllers/admin/adminController.controller.js

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Company } from "../../models/core/company.model.js";
import { Employee } from "../../models/core/employee.model.js";

const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({}).select('-companyPassword');
    return res.status(200).json(new ApiResponse(200, companies, "All companies retrieved"));
});

const suspendCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const company = await Company.findOne({ companyId });
    if (!company) throw new ApiError(404, "Company not found");

    company.isActive = false;
    company.subscriptionStatus = "Suspended";
    await company.save();

    return res.status(200).json(new ApiResponse(200, { companyId }, "Company suspended"));
});

const changeSubscriptionPlan = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { newPlan } = req.body;

    const company = await Company.findOne({ companyId });
    if (!company) throw new ApiError(404, "Company not found");

    company.subscriptionPlan = newPlan;
    await company.save();

    return res.status(200).json(new ApiResponse(200, { companyId, newPlan }, "Subscription plan updated"));
});

const getPlatformStats = asyncHandler(async (req, res) => {
    const totalCompanies = await Company.countDocuments();
    const activeCompanies = await Company.countDocuments({ isActive: true });
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ "systemInfo.isActive": true });

    return res.status(200).json(new ApiResponse(200, {
        totalCompanies,
        activeCompanies,
        totalEmployees,
        activeEmployees
    }, "Platform stats fetched"));
});

export {
    getAllCompanies,
    suspendCompany,
    changeSubscriptionPlan,
    getPlatformStats
};
