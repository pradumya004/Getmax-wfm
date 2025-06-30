// backend/src/controllers/companyController.controller.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCompanyToken } from "../utils/jwthelper.js";
import { Company } from "../models/company.model.js";

const registerCompany = asyncHandler(async (req, res) => {
    const {
        companyName,
        legalName,
        taxID,
        website,
        contactEmail,
        companyPassword,
        contactPhone,
        contactPerson,
        billingContactName,
        billingEmail,
        street,
        city,
        state,
        zipCode,
        country,
        subscriptionPlan,
        clientType,
        contractType,
        specialtyType,
        scopeFormatID,
        companySize,
        timeZone
    } = req.body;

    // Required validationsAdd commentMore actions
    if (!companyName || !contactEmail || !companyPassword || !contactPhone) {
        throw new ApiError(400, "Missing required fields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Duplicate check
    const existingCompany = await Company.findOne({ contactEmail: contactEmail.toLowercase().trim(), isActive: true });
    if (existingCompany) {
        return res.status(400).json({ message: "Company already exists" });
    }

    const newCompany = new Company({
        companyName,
        legalName,
        taxID,
        website,
        contactEmail,
        companyPassword,
        contactPhone,
        contactPerson,
        billingContactName,
        billingEmail: billingEmail || contactEmail,
        subscriptionPlan: subscriptionPlan || 'Trial',
        subscriptionStatus: 'Active',
        paymentStatus: 'Pending',
        timeZone: timeZone || 'IST',
        address: {
            street,
            city,
            state,
            zipCode,
            country: country || 'India'
        },
        contractSettings: {
            clientType: clientType || 'Provider',
            contractType: contractType || 'Select Contract Type',
            specialtyType: Array.isArray(specialtyType) ? specialtyType : [specialtyType],
            scopeFormatID: scopeFormatID || 'ClaimMD'
        },
        companySize: companySize || '1-10',
        apiEnabled: true,
        isActive: true
    });

    await newCompany.save();

    const token = generateCompanyToken(newCompany._id);

    // Cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
        sameSite: 'Lax', // or 'Strict'/'None' depending on your frontend-backend setup
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie("token", token, cookieOptions);

    return res.status(201).json(
        new ApiResponse(
            {
                companyId: newCompany.companyId,
            },
            "Company registered successfully"
        )
    );

});

const loginCompany = asyncHandler(async (req, res) => {
    try {
        const { companyEmail, companyPassword } = req.body;

        if (!companyEmail || !companyPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const company = await Company.findOne({ contactEmail: companyEmail }).select('+companyPassword');
        const validatePassword = await company.comparePassword(companyPassword);

        if (!validatePassword) {
            throw new ApiError(401, "Invalid User Credentials!");
        }

        // SuccessAdd commentMore actions
        res.status(200).json({
            message: "Login successful",
            companyEmail: companyEmail,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { registerCompany, loginCompany };
