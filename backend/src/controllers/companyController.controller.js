import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Company from "../models/company.model.js";

const registerCompany = asyncHandler(async (req, res) => {
    const {companyName, contactEmail, billingEmail, billingContactName, contactPhone, contractSettings} = req.body;
    if(!companyName || !contactEmail) {
        throw new ApiError(400, "Company name and contact email are required.");
    }
    
    const existingCompany = await Company.findOne({contactEmail, isActive: true});
    
    if (existingCompany) {
        throw new ApiError(400, "A company with this contact email already exists.");
    }

    const newCompany = new Company({
        companyName,
        contactEmail,
        billingEmail: billingEmail || contactEmail,
        billingContactName,
        contactPhone,
        contractSettings : contractSettings || {},
        apiEnabled: true
    });

    await newCompany.save();

    res.status(201).json(new ApiResponse({ companyId: newCompany.companyId },"Company registered successfully"));

});

const loginCompany = asyncHandler(async (req, res) => {
    const {Email, billingEmail} = req.body;
    if(!companyName || !contactEmail) {
        throw new ApiError(400, "Company name and contact email are required.");
    }
    const existingCompany = await Company.findOne({contactEmail, isActive: true});
    if (existingCompany) {
        throw new ApiError(400, "A company with this contact email already exists.");
    }

    const newCompany = new Company({
        companyName,
        contactEmail,
        billingEmail: billingEmail || contactEmail,
        apiEnabled: true
    });

    await newCompany.save();

    res.status(201).json(new ApiResponse({ companyId: newCompany.companyId },"Company registered successfully"));

});

export {registerCompany, loginCompany};
