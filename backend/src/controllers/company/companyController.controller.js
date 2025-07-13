// backend/src/controllers/company/companyController.controller.js

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateCompanyToken, generateEmployeeToken } from "../../utils/jwtHelper.js";
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
    console.log("Registration request body:", JSON.stringify(req.body, null, 2));
    const {
        // Basic company info
        companyName,
        legalName,
        taxID,
        website,
        companyEmail,  // FIXED: Use companyEmail from frontend
        companyPassword,
        contactPhone,
        contactPerson,

        // Billing info
        billingContactName,
        billingEmail,

        // Address (flattened from frontend)
        street,
        city,
        state,
        zipCode,
        country,

        // Business info
        subscriptionPlan,
        companySize,
        timeZone,
        businessType,
        industry,
        businessDescription,

        // Contract settings
        contractSettings = [],

        // Admin user info
        adminFirstName,
        adminLastName,
        adminPhone
    } = req.body;

    // FIXED: Better validation with specific error messages
    const missingFields = [];
    if (!companyName?.trim()) missingFields.push('companyName');
    if (!companyEmail?.trim()) missingFields.push('companyEmail');
    if (!companyPassword?.trim()) missingFields.push('companyPassword');
    if (!contactPhone?.trim()) missingFields.push('contactPhone');

    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // FIXED: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
        throw new ApiError(400, "Invalid email format for company email");
    }

    // FIXED: Validate password strength
    if (companyPassword.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // FIXED: Check for existing company with better error message
    const existingCompany = await Company.findOne({
        contactEmail: companyEmail.toLowerCase().trim(),
        isActive: true
    });

    if (existingCompany) {
        throw new ApiError(409, "A company with this email already exists. Please use a different email or try logging in.");
    }

    // FIXED: Process contract settings with validation
    let processedContractSettings = [];
    if (contractSettings && contractSettings.length > 0) {
        const settings = contractSettings[0];
        processedContractSettings = [{
            clientType: Array.isArray(settings.clientType) ? settings.clientType : ['Provider'],
            contractType: Array.isArray(settings.contractType) ? settings.contractType : ['End to End'],
            specialtyType: Array.isArray(settings.specialtyType) ? settings.specialtyType : ['Primary Care'],
            scopeFormatID: Array.isArray(settings.scopeFormatID) ? settings.scopeFormatID : ['ClaimMD']
        }];
    } else {
        // Default values if not provided
        processedContractSettings = [{
            clientType: ['Provider'],
            contractType: ['End to End'],
            specialtyType: ['Primary Care'],
            scopeFormatID: ['ClaimMD']
        }];
    }

    console.log("Processed contract settings:", processedContractSettings);

    try {
        // FIXED: Create company with proper error handling
        const newCompany = new Company({
            companyName: companyName.trim(),
            legalName: legalName?.trim(),
            taxID: taxID?.trim(),
            website: website?.trim(),
            contactEmail: companyEmail.toLowerCase().trim(),
            companyPassword: companyPassword.trim(),
            contactPhone: contactPhone.trim(),
            contactPerson: contactPerson?.trim(),

            // Billing info
            billingContactName: billingContactName?.trim() || contactPerson?.trim(),
            billingEmail: billingEmail?.toLowerCase().trim() || companyEmail.toLowerCase().trim(),

            // Subscription details
            subscriptionPlan: subscriptionPlan || 'Trial',
            subscriptionStatus: 'Active',
            paymentStatus: 'Pending',

            // Business details
            timeZone: timeZone || 'IST',
            companySize: companySize || '1-10',

            // Address - FIXED: Create proper address object
            address: {
                street: street?.trim(),
                city: city?.trim(),
                state: state?.trim(),
                zipCode: zipCode?.trim(),
                country: country?.trim() || 'India'
            },

            // Contract settings - FIXED: Use processed settings
            contractSettings: processedContractSettings[0],

            // API settings
            apiEnabled: true,
            isActive: true
        });

        console.log("About to save company:", newCompany.toObject());

        // Save the company
        await newCompany.save();
        console.log("Company saved successfully");

        // Create default organizational structure
        const [role, department, designation] = await Promise.all([
            Role.create({
                companyRef: newCompany._id,
                roleName: 'Super Admin',
                roleLevel: 10,
                permissions: {
                    employeePermissions: "Full",
                    clientPermissions: "Full",
                    sowPermissions: "Full",
                    claimPermissions: "Full",
                    reportPermissions: "Full"
                },
                dataAccess: {
                    clientRestriction: "All",
                    sowRestriction: "All",
                    claimRestriction: "All",
                    reportScope: "Company",
                    financialDataAccess: true
                },
                isActive: true
            }),
            Department.create({
                companyRef: newCompany._id,
                departmentName: 'Administration',
                departmentCode: 'ADM',
                departmentLevel: 10,
                isActive: true
            }),
            Designation.create({
                companyRef: newCompany._id,
                designationName: 'Administrator',
                designationCode: 'ADMIN',
                level: 15,
                category: "C-Level",
                isActive: true
            })
        ]);

        console.log("Organizational structure created");

        // Create first employee (company admin user)
        const firstEmployeePassword = generateEmployeePassword(
            adminFirstName || contactPerson?.split(' ')[0] || 'Admin'
        );

        const firstEmployee = new Employee({
            companyRef: newCompany._id,
            roleRef: role._id,
            departmentRef: department._id,
            designationRef: designation._id,
            personalInfo: {
                firstName: adminFirstName || contactPerson?.split(' ')[0] || 'Admin',
                lastName: adminLastName || contactPerson?.split(' ').slice(1).join(' ') || 'User'
            },
            contactInfo: {
                primaryEmail: companyEmail.toLowerCase().trim(),
                primaryPhone: adminPhone || contactPhone
            },
            employmentInfo: {
                dateOfJoining: new Date(),
                employmentType: "Full Time",
                workLocation: "Office"
            },
            compensation: {
                baseSalary: 0
            },
            isActive: true
        });

        // Hash password and save employee
        await firstEmployee.hashPassword(firstEmployeePassword);
        await firstEmployee.save();

        console.log("First employee created");

        // Generate company token
        const token = generateCompanyToken(newCompany._id);

        // Set secure cookie
        res.cookie("companyToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        try {
            await sendEmail({
                to: companyEmail,
                currentTemplate: EMAIL_TEMPLATES.COMPANY_WELCOME,
                data: {
                    companyName: newCompany.companyName,
                    companyEmail: companyEmail,
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
    } catch (error) {
        console.error("Error during company registration:", error);
        if (error.code === 11000) {
            throw new ApiError(409, "A company with this email already exists. Please use a different email or try logging in.");
        }
        throw new ApiError(500, "Internal Server Error during company registration");
    }
});

const loginCompany = asyncHandler(async (req, res) => {
    const { companyEmail, companyPassword } = req.body;

    if (!companyEmail || !companyPassword) {
        throw new ApiError(400, "Email and password are required");
    }

    const normalizedEmail = companyEmail.toLowerCase().trim();

    const company = await Company.findOne({ contactEmail: normalizedEmail }).select('+companyPassword');
    if (!company || !(await company.comparePassword(companyPassword))) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const companyToken = generateCompanyToken(company._id);
    res.cookie("companyToken", companyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const employee = await Employee.findOne({
        companyRef: company._id,
        'contactInfo.primaryEmail': normalizedEmail
    });

    if (!employee) {
        employee = await Employee.findOne({
            companyRef: company._id,
        }).populate('roleRef').where('roleRef.roleLevel').equals(10);
    }

    if (!employee) {
        throw new ApiError(404, "No employee or super admin found for this company");
    }

    const employeeToken = generateEmployeeToken({
        employeeId: employee._id,
        companyId: company._id,
        role: employee.roleRef,
        email: employee.contactInfo.primaryEmail
    });

    res.cookie("employeeToken", employeeToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new ApiResponse(200, {
            company: {
                companyId: company.companyId,
                companyName: company.companyName,
                companyEmail: company.contactEmail,
                subscriptionStatus: company.subscriptionStatus,
                companyAdmin: company.billingContactName,
                subscriptionPlan: company.subscriptionPlan,
                apiKey: company.apiKey
            },
            employee: {
                id: employee.employeeId,
                name: employee.fullName,
                role: employee.roleRef.roleName
            },
            companyToken,
            employeeToken
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
