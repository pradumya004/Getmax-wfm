// PATCHED companyController.controller.js

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateCompanyToken } from "../../utils/jwtHelper.js";
import { Company } from "../../models/company.model.js";
import { Employee } from "../../models/employee.model.js";
import { Role } from "../../models/role.model.js";
import { Department } from "../../models/department.model.js";
import { Designation } from "../../models/designation.model.js";
import { sendEmail } from "../../services/emailService.service.js";
import { EMAIL_TEMPLATES } from "../../constants.js";
import crypto from 'crypto';

const generateEmployeePassword = (firstName) => {
    const randomString = crypto.randomBytes(6).toString('hex');
    return `${firstName}@${randomString}`;
};

const registerCompany = asyncHandler(async (req, res) => {
    const {
        companyName, legalName, taxID, website,
        contactEmail, companyPassword, contactPhone,
        contactPerson, billingContactName, billingEmail,
        street, city, state, zipCode, country,
        subscriptionPlan, companySize, timeZone,
        contractSettings = [],
        adminFirstName, adminLastName, adminPhone
    } = req.body;

    const {
        clientType = ['Provider'],
        contractType = ['End to End'],
        specialtyType = ['Primary Care'],
        scopeFormatID = ['ClaimMD']
    } = contractSettings[0] || {};

    if (!companyName || !contactEmail || !companyPassword || !contactPhone) {
        throw new ApiError(400, "Missing required fields: companyName, contactEmail, companyPassword, contactPhone");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    const existingCompany = await Company.findOne({ contactEmail: contactEmail.toLowerCase().trim(), isActive: true });
    if (existingCompany) {
        throw new ApiError(400, "Company already exists");
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
        address: { street, city, state, zipCode, country: country || 'India' },
        contractSettings: [{ clientType, contractType, specialtyType, scopeFormatID }],
        companySize: companySize || '1-10',
        apiEnabled: true,
        isActive: true
    });

    await newCompany.save();

    // Create default Role, Department, Designation if needed
    const [role, department, designation] = await Promise.all([
        Role.create({
            companyRef: newCompany._id,
            roleName: 'Super Admin',
            roleLevel: 10,
            permissions: ['*']
        }),
        Department.create({
            companyRef: newCompany._id,
            departmentName: 'Admin Department',
            departmentCode: 'ADM'
        }),
        Designation.create({
            companyRef: newCompany._id,
            designationName: 'Administrator'
        })
    ]);

    const firstEmployeePassword = generateEmployeePassword(adminFirstName);

    const firstEmployee = new Employee({
        companyRef: newCompany._id,
        roleRef: role._id,
        departmentRef: department._id,
        designationRef: designation._id,
        personalInfo: {
            firstName: adminFirstName || contactPerson?.split(' ')[0] || 'Admin',
            lastName: adminLastName || contactPerson?.split(' ')[1] || 'User'
        },
        contactInfo: {
            primaryEmail: contactEmail.toLowerCase().trim(),
            personalPhone: adminPhone || contactPhone
        },
        employmentInfo: {
            dateOfJoining: new Date(),
            employmentType: "Full Time"
        },
        compensation: {
            baseSalary: 0
        }
    });

    await firstEmployee.hashPassword(firstEmployeePassword);
    await firstEmployee.save();

    const token = generateCompanyToken(newCompany._id);

    res.cookie("companyToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    try {
        await sendEmail({
            to: contactEmail,
            currentTemplate: EMAIL_TEMPLATES.COMPANY_WELCOME,
            data: {
                companyName: newCompany.companyName,
                companyEmail: contactEmail,
                firstEmployeeId: firstEmployee.employeeId,
                firstEmployeePassword,
                adminName: `${firstEmployee.personalInfo.firstName} ${firstEmployee.personalInfo.lastName}`,
                companyLoginUrl: `${process.env.FRONTEND_URL}/company/login`,
                employeeLoginUrl: `${process.env.FRONTEND_URL}/employee/login`
            }
        });
    } catch (e) {
        console.warn("Email send failed: ", e.message);
    }

    return res.status(201).json(
        new ApiResponse(201, {
            companyId: newCompany.companyId,
            companyName: newCompany.companyName,
            apiKey: newCompany.apiKey
        }, "Company registered successfully")
    );
});

const loginCompany = asyncHandler(async (req, res) => {
    const { companyEmail, companyPassword } = req.body;

    if (!companyEmail || !companyPassword) {
        throw new ApiError(400, "Email and password are required");
    }

    const company = await Company.findOne({ contactEmail: companyEmail.toLowerCase().trim() }).select('+companyPassword');
    if (!company || !(await company.comparePassword(companyPassword))) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const token = generateCompanyToken(company._id);
    res.cookie("companyToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new ApiResponse(200, {
            companyId: company.companyId,
            companyName: company.companyName,
            subscriptionPlan: company.subscriptionPlan,
            apiKey: company.apiKey
        }, "Company Login Successful")
    );
});

const logoutCompany = asyncHandler(async (req, res) => {
    res.clearCookie("companyToken");
    return res.status(200).json(new ApiResponse(200, {}, "Company Logout Successful!"));
});

const getCompanyProfile = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const company = await Company.findById(companyId).select('-companyPassword');
    if (!company) throw new ApiError(404, 'Company not found');
    return res.status(200).json(new ApiResponse(200, company, 'Company profile retrieved successfully'));
});

export {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile
};
