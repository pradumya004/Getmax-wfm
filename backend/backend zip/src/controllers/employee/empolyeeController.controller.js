// backend/src/controllers/employee/empolyeeController.controller.js

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Employee } from "../../models/employee.model.js";
import { Company } from "../../models/company.model.js";
import { Role } from "../../models/role.model.js";
import { Department } from "../../models/department.model.js";
import { Designation } from "../../models/designation.model.js";
import { SubDepartment } from "../../models/subdepartment.model.js";
import { EMAIL_TEMPLATES } from "../../constants.js";
import { generateEmployeeToken, generateCompanyToken } from "../../utils/jwtHelper.js";
import { getClientIP } from "../../utils/helpers.js";
import crypto from 'crypto';
import xlsx from 'xlsx';
import { sendEmail } from './../../services/emailService.service.js';

const generateEmployeePassword = (firstName) => {
    const randomString = crypto.randomBytes(6).toString('hex');

    return `${firstName}@${randomString}`;
}

// Add employee by company - admin
const addEmployee = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        middleName,
        primaryEmail,
        primaryPhone,
        roleRef,
        departmentRef,
        subdepartmentRef,
        designationRef,
        dateOfJoining,
        workLocation,
        directManager,
        rampPercentage
    } = req.body;

    // Get company from authenticated token
    const companyId = req.company?._id;
    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Required field validation
    if (!(firstName && lastName && primaryEmail && roleRef && departmentRef && designationRef)) {
        throw new ApiError(400, "Missing required fields: firstName, lastName, primaryEmail, roleRef, departmentRef, designationRef");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Validate role, department, designation wrt company
    const [role, department, designation] = await Promise.all([
        Role.findOne({ _id: roleRef, companyRef: companyId }),
        Department.findOne({ _id: departmentRef, companyRef: companyId }),
        Designation.findOne({ _id: designationRef, companyRef: companyId }),
    ]);

    if (!role) {
        throw new ApiError(404, "Role not found in this company");
    }

    if (!department) {
        throw new ApiError(404, "Department not found in this company");
    }

    if (!designation) {
        throw new ApiError(404, "Designation not found in this company");
    }

    let subdepartment = null;
    if (subdepartmentRef) {
        subdepartment = await SubDepartment.findOne({
            _id: subdepartmentRef,
            companyRef: companyId,
            departmentRef: departmentRef
        });

        if (!subdepartment) {
            throw new ApiError(404, "Subdepartment not found in this department");
        }
    }

    // Check if employee already exists in this company
    const existingEmployee = await Employee.findOne({
        companyRef: companyId,
        "contactInfo.primaryEmail": primaryEmail.toLowerCase().trim()
    });

    if (existingEmployee) {
        throw new ApiError(409, "Employee with this email already exists in your company");
    }

    // Generate employee password (permanent)
    const permanentEmployeePassword = generateEmployeePassword(firstName);

    // Create new employee
    const newEmployee = new Employee({
        companyRef: companyId,
        roleRef,
        departmentRef,
        subdepartmentRef,
        designationRef,
        personalInfo: {
            firstName: firstName.trim(),
            middleName: middleName?.trim(),
            lastName: lastName.trim()
        },
        contactInfo: {
            primaryEmail: primaryEmail.toLowerCase().trim(),
            primaryPhone: primaryPhone?.trim(),
        },
        employmentInfo: {
            dateOfJoining: dateOfJoining || new Date(),
            workLocation: workLocation || "Office"
        },
        reportingStructure: {
            directManager
        },
        // rampPercentage: rampPercentage || 100,
        systemInfo: {
            isActive: true,
            emailVerified: false
        },
        auditInfo: {
            createdBy: req.company?._id || req.employee?._id,
        }
    });

    // Hash permanent password
    await newEmployee.hashPassword(permanentEmployeePassword);
    await newEmployee.save();

    // Send welcome email
    try {
        await sendEmail({
            to: primaryEmail,
            currentTemplate: EMAIL_TEMPLATES.EMPLOYEE_WELCOME,
            data: {
                name: `${firstName} ${lastName}`,
                employeeId: newEmployee.employeeId,
                email: primaryEmail,
                permanentPassword: permanentEmployeePassword,
                companyName: company.companyName,
                departmentName: department.departmentName,
                roleName: role.roleName,
                designationName: designation.designationName,
                portalUrl: `${process.env.FRONTEND_URL}/employee/login`
            }
        });
    } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
    }

    return res.status(201).json(
        new ApiResponse(
            {
                employeeId: newEmployee.employeeId,
                email: primaryEmail,
                name: `${firstName} ${lastName}`,
                status: "active",
                token
            },
            "Employee added successfully. Welcome email sent."
        )
    );
});

// Employee Login With IP-based security
const loginEmployee = asyncHandler(async (req, res) => {
    const { employeeId, password } = req.body;
    const clientIP = getClientIP(req);

    if (!(employeeId && password)) {
        throw new ApiError(400, 'Employee ID and Password are required!');
    }

    const employee = await Employee.findOne({ employeeId: employeeId.toUpperCase().trim() })
        .select('+authentication.passwordHash +authentication.failedLoginAttempts +authentication.accountLockedUntil')
        .populate('companyRef', 'companyName apiKey securitySettings')
        .populate('roleRef', 'roleName roleLevel permissions dataAccess')
        .populate('departmentRef', 'departmentName')
        .populate('designationRef', 'designationName');

    if (!employee) {
        throw new ApiError(401, "Employee not found!");
    }

    // Check if account is locked
    if (employee.authentication.accountLockedUntil &&
        employee.authentication.accountLockedUntil > new Date()) {
        throw new ApiError(423, "Account is temporarily locked. Contact your administrator.");
    }

    // Verify password
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
        // Increment failed login attempts
        employee.authentication.failedLoginAttempts += 1;

        // Lock account after 5 failed attempts for 30 minutes
        if (employee.authentication.failedLoginAttempts >= 5) {
            employee.authentication.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        }

        await employee.save();
        throw new ApiError(401, "Invalid credentials");
    }

    // IP-based security check
    const company = employee.companyRef;
    const securitySettings = company.securitySettings || {};
    const officeIPs = securitySettings.workingIPs || [];
    const isFromOffice = officeIPs.some(ipObj => clientIP.includes(ipObj.ip));

    // If not from office IP and remote work is not enabled
    if (!isFromOffice && !securitySettings.remoteWorkEnabled) {
        throw new ApiError(403, "Login allowed only from office network");
    }

    // Reset failed login attempts on successful login
    employee.authentication.failedLoginAttempts = 0;
    employee.authentication.accountLockedUntil = null;
    employee.authentication.lastLogin = new Date();
    employee.systemInfo.lastLogin = new Date();
    employee.systemInfo.lastLoginIP = clientIP;
    employee.systemInfo.loginCount += 1;

    await employee.save();


// Generate tokens
    const employeeToken = generateEmployeeToken({
    employeeId: employee._id,
    companyId: employee.companyRef._id,
    role: employee.roleRef,
    email: employee.contactInfo.primaryEmail,
    });

    const companyToken = generateCompanyToken(employee.companyRef._id);

    const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 12 * 60 * 60 * 1000, // 12 hours for employees
    };

    // Set both cookies
    res
    .cookie("employeeToken", employeeToken, cookieOptions)
    .cookie("companyToken", companyToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for companyToken
    });

    // Send response
    return res.status(200).json(
    new ApiResponse(200, {
        employee: {
        employeeId: employee.employeeId,
        name: employee.fullName,
        email: employee.contactInfo.primaryEmail,
        companyName: company.companyName,
        role: employee.roleRef.roleName,
        department: employee.departmentRef.departmentName,
        designation: employee.designationRef.designationName,
        isFromOffice,
        avatar: employee.avatarUrl,
        permissions: employee.roleRef.permissions,
        dataAccess: employee.roleRef.dataAccess,
        loginTime: new Date(),
        currentLevel: employee.gamification.experience.currentLevel,
        totalXP: employee.gamification.experience.totalXP,
        profileCompletion: employee.systemInfo.profileCompletionPercentage,
        },
        employeeToken, // Optional: for frontend debugging
        companyToken,
    },
        "Login successful"
    )
    );

});

// =================================================
// =================================================
// ============= EMPLOYEE SELF-SERVICE =============
// =================================================
// =================================================

// Update Employee Profile (Self-service - limited fields only)
const updateEmployeeProfile = asyncHandler(async (req, res) => {
    const employeeId = req.employee?.employeeId;
    if (!employeeId) {
        throw new ApiError(401, "Employee authentication required");
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    const { personalInfo, contactInfo, skillsAndQualifications } = req.body;

    // Fields that employee can update themselves (limited)
    const allowedUpdates = {};

    if (personalInfo) {
        if (personalInfo.dateOfBirth) allowedUpdates['personalInfo.dateOfBirth'] = personalInfo.dateOfBirth;
        if (personalInfo.gender) allowedUpdates['personalInfo.gender'] = personalInfo.gender;
        if (personalInfo.bloodGroup) allowedUpdates['personalInfo.bloodGroup'] = personalInfo.bloodGroup;
    }

    if (contactInfo) {
        if (contactInfo.primaryPhone) allowedUpdates['contactInfo.primaryPhone'] = contactInfo.primaryPhone;
        if (contactInfo.personalEmail) allowedUpdates['contactInfo.personalEmail'] = contactInfo.personalEmail;
        if (contactInfo.alternatePhone) allowedUpdates['contactInfo.alternatePhone'] = contactInfo.alternatePhone;
        if (contactInfo.emergencyContact) allowedUpdates['contactInfo.emergencyContact'] = contactInfo.emergencyContact;
    }

    if (skillsAndQualifications) {
        if (skillsAndQualifications.technicalSkills) allowedUpdates['skillsAndQualifications.technicalSkills'] = skillsAndQualifications.technicalSkills;
        if (skillsAndQualifications.softSkills) allowedUpdates['skillsAndQualifications.softSkills'] = skillsAndQualifications.softSkills;
        if (skillsAndQualifications.languages) allowedUpdates['skillsAndQualifications.languages'] = skillsAndQualifications.languages;
        if (skillsAndQualifications.certifications) allowedUpdates['skillsAndQualifications.certifications'] = skillsAndQualifications.certifications;
    }

    // Update audit info
    allowedUpdates['auditInfo.lastModifiedBy'] = employee._id;
    allowedUpdates['auditInfo.lastModifiedAt'] = new Date();

    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeId },
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        )
            .populate('roleRef', 'roleName')
            .populate('departmentRef', 'departmentName')
            .populate('designationRef', 'designationName')
            .select('-authentication.passwordHash');

        return res.status(200).json(
            new ApiResponse(updatedEmployee, "Profile updated successfully")
        );
    } catch (error) {
        throw new ApiError(400, `Error updating profile: ${error.message}`);
    }
});

// Upload Employee Avatar
const uploadEmployeeAvatar = asyncHandler(async (req, res) => {
    const employeeId = req.employee?.employeeId;
    if (!employeeId) {
        throw new ApiError(401, "Employee authentication required");
    }

    if (!req.uploadResult) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
        { employeeId },
        {
            'personalInfo.profilePicture': req.uploadResult.url,
            'auditInfo.lastModifiedBy': req.employee._id,
            'auditInfo.lastModifiedAt': new Date()
        },
        { new: true }
    ).select('employeeId personalInfo');

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                employeeId: updatedEmployee.employeeId,
                name: updatedEmployee.fullName,
                avatar: updatedEmployee.avatarUrl
            },
            "Avatar uploaded successfully"
        )
    );
});

// Get Employee Profile
const getEmployeeProfile = asyncHandler(async (req, res) => {
    const employeeId = req.employee?.employeeId;

    const employee = await Employee.findOne({ employeeId })
        .populate('companyRef', 'companyName')
        .populate('roleRef', 'roleName roleLevel permissions')
        .populate('departmentRef', 'departmentName')
        .populate('designationRef', 'designationName')
        .populate('subdepartmentRef', 'subdepartmentName')
        .populate('reportingStructure.directManager', 'personalInfo.firstName personalInfo.lastName employeeId')
        .select('-authentication.passwordHash');

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, employee, "Employee profile retrieved successfully")
    );
});

// Logout Employee
const logoutEmployee = asyncHandler(async (req, res) => {
    res.clearCookie("employeeToken");

    return res.status(200).json(
        new ApiResponse({}, "Logout successful")
    );
});

// ============= COMPANY ADMIN EMPLOYEE MANAGEMENT =============

// Get all employees for a company (with filters and pagination)
const getCompanyEmployees = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const {
        page = 1,
        limit = 10,
        search = "",
        status = "all",
        department = "all",
        role = "all",
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = { companyRef: companyId };

    // Add status filter
    if (status !== "all") {
        filter["status.employeeStatus"] = status;
    }

    // Add search filter
    if (search) {
        filter.$or = [
            { "personalInfo.firstName": { $regex: search, $options: "i" } },
            { "personalInfo.lastName": { $regex: search, $options: "i" } },
            { "contactInfo.primaryEmail": { $regex: search, $options: "i" } },
            { employeeId: { $regex: search, $options: "i" } }
        ];
    }

    // Add department filter
    if (department !== "all") {
        filter.departmentRef = department;
    }

    // Add role filter
    if (role !== "all") {
        filter.roleRef = role;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    try {
        const employees = await Employee.find(filter)
            .populate('roleRef', 'roleName roleLevel')
            .populate('departmentRef', 'departmentName')
            .populate('designationRef', 'designationName')
            .populate('subdepartmentRef', 'subdepartmentName')
            .populate('reportingStructure.directManager', 'personalInfo.firstName personalInfo.lastName employeeId')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-authentication.passwordHash');

        const totalEmployees = await Employee.countDocuments(filter);
        const totalPages = Math.ceil(totalEmployees / parseInt(limit));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    employees,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalEmployees,
                        limit: parseInt(limit),
                        hasNext: parseInt(page) < totalPages,
                        hasPrev: parseInt(page) > 1
                    }
                },
                "Employees retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching employees: ${error.message}`);
    }
});

// Get single employee details (Admin only)
const getEmployeeDetails = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId
    })
        .populate('roleRef', 'roleName roleLevel permissions')
        .populate('departmentRef', 'departmentName')
        .populate('designationRef', 'designationName')
        .populate('subdepartmentRef', 'subdepartmentName')
        .populate('reportingStructure.directManager', 'personalInfo.firstName personalInfo.lastName employeeId')
        .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName')
        .populate('auditInfo.lastModifiedBy', 'personalInfo.firstName personalInfo.lastName')
        .select('-authentication.passwordHash');

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, employee, "Employee details retrieved successfully")
    );
});

// Update employee details (Admin only)
const updateEmployee = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;
    const updateData = req.body;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId
    });

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    // Admin can update more fields than self-service
    const allowedUpdates = [
        'personalInfo',
        'contactInfo',
        'employmentInfo',
        'roleRef',
        'departmentRef',
        'subdepartmentRef',
        'designationRef',
        'reportingStructure',
        'status',
        'compensation',
        'skillsAndQualifications',
        'performanceTargets',
        'rampPercentage'
    ];

    const updates = {};
    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = updateData[key];
        }
    });

    // Update audit info
    updates['auditInfo.lastModifiedBy'] = companyId;
    updates['auditInfo.lastModifiedAt'] = new Date();

    // Handle email change validation
    if (updateData.contactInfo?.primaryEmail) {
        const emailExists = await Employee.findOne({
            companyRef: companyId,
            "contactInfo.primaryEmail": updateData.contactInfo.primaryEmail.toLowerCase(),
            employeeId: { $ne: employeeId.toUpperCase() },
            "systemInfo.isActive": true
        });

        if (emailExists) {
            throw new ApiError(409, "Employee with this email already exists");
        }

        updates['contactInfo.primaryEmail'] = updateData.contactInfo.primaryEmail.toLowerCase();
        updates['systemInfo.emailVerified'] = false;
    }

    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeId: employeeId.toUpperCase(), companyRef: companyId },
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate('roleRef', 'roleName roleLevel')
            .populate('departmentRef', 'departmentName')
            .populate('designationRef', 'designationName')
            .select('-authentication.passwordHash');

        return res.status(200).json(
            new ApiResponse(200, updatedEmployee, "Employee updated successfully")
        );
    } catch (error) {
        throw new ApiError(400, `Error updating employee: ${error.message}`);
    }
});

// Deactivate employee (soft delete)
const deactivateEmployee = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;
    const { reason = "Deactivated by administrator" } = req.body;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId
    });

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    // Update employee status
    employee.status.employeeStatus = "Inactive";
    employee.status.statusReason = reason;
    employee.status.statusEffectiveDate = new Date();
    employee.systemInfo.isActive = false;
    employee.auditInfo.lastModifiedBy = companyId;
    employee.auditInfo.lastModifiedAt = new Date();

    await employee.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { employeeId: employee.employeeId, status: "Inactive" },
            "Employee deactivated successfully"
        )
    );
});

// Reactivate employee
const reactivateEmployee = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId
    });

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    // Update employee status
    employee.status.employeeStatus = "Active";
    employee.status.statusReason = "Reactivated by administrator";
    employee.status.statusEffectiveDate = new Date();
    employee.systemInfo.isActive = true;
    employee.auditInfo.lastModifiedBy = companyId;
    employee.auditInfo.lastModifiedAt = new Date();

    await employee.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { employeeId: employee.employeeId, status: "Active" },
            "Employee reactivated successfully"
        )
    );
});

// Reset employee password (Admin only - generates new permanent password)
const resetEmployeePassword = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId,
        "systemInfo.isActive": true
    }).populate('companyRef', 'companyName');

    if (!employee) {
        throw new ApiError(404, "Active employee not found");
    }

    // Generate new permanent password
    const newPermanentPassword = generateEmployeePassword(employee.personalInfo.firstName);

    // Hash and save new password
    await employee.hashPassword(newPermanentPassword);
    employee.authentication.lastPasswordChange = new Date();
    employee.authentication.failedLoginAttempts = 0;
    employee.authentication.accountLockedUntil = null;
    await employee.save();

    // Send password reset email
    try {
        await sendEmail({
            to: employee.contactInfo.primaryEmail,
            currentTemplate: EMAIL_TEMPLATES.PASSWORD_RESET,
            data: {
                name: employee.fullName,
                employeeId: employee.employeeId,
                newPassword: newPermanentPassword,
                companyName: employee.companyRef.companyName,
                portalUrl: `${process.env.FRONTEND_URL}/employee/login`
            }
        });
    } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                employeeId: employee.employeeId,
                message: "Password reset email sent"
            },
            "Employee password reset successfully"
        )
    );
});

// Delete employee permanently (hard delete)
const deleteEmployee = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { employeeId } = req.params;
    const { confirmDelete } = req.body;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    if (!confirmDelete) {
        throw new ApiError(400, "Delete confirmation required");
    }

    const employee = await Employee.findOne({
        employeeId: employeeId.toUpperCase(),
        companyRef: companyId
    });

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    // Archive employee data before deletion
    employee.auditInfo.archivedAt = new Date();
    employee.auditInfo.archivedBy = companyId;
    await employee.save();

    // Permanently delete
    await Employee.findByIdAndDelete(employee._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            { employeeId: employeeId.toUpperCase() },
            "Employee deleted permanently"
        )
    );
});



// Bulk Upload Employees via Excel
const bulkUploadEmployees = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    if (!companyId) throw new ApiError(401, "Company authentication required");
    if (!req.tempFilePath) throw new ApiError(400, "Excel file is required");

    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, "Company not found");

    try {
        const workbook = xlsx.readFile(req.tempFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let mapping = req.body.mapping;
        if (typeof mapping === 'string') {
            try {
                mapping = JSON.parse(mapping);
            } catch (err) {
                throw new ApiError(400, "Invalid JSON in field mapping");
            }
        }
        if (!mapping || typeof mapping !== 'object') {
            throw new ApiError(400, "Field mapping object is missing or invalid");
        }

        const employees = xlsx.utils.sheet_to_json(worksheet);
        const mappedEmployees = employees.map((row) => {
            const mapped = {};
            for (const [key, excelHeader] of Object.entries(mapping)) {
                if (excelHeader && row[excelHeader] !== undefined) {
                    const keys = key.split('.');
                    let current = mapped;
                    for (let i = 0; i < keys.length - 1; i++) {
                        current[keys[i]] = current[keys[i]] || {};
                        current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = row[excelHeader];
                }
            }
            return mapped;
        });

        const results = { successful: [], failed: [], duplicates: [] };

        const [departments, roles, designations] = await Promise.all([
            Department.find({ companyRef: companyId }),
            Role.find({ companyRef: companyId, isActive: true }),
            Designation.find({ companyRef: companyId })
        ]);

        const departmentMap = departments.reduce((acc, dept) => {
            acc[dept.departmentName.toLowerCase()] = dept._id;
            return acc;
        }, {});

        const roleMap = roles.reduce((acc, role) => {
            acc[role.roleName.toLowerCase()] = role._id;
            return acc;
        }, {});

        const designationMap = designations.reduce((acc, desig) => {
            acc[desig.designationName.toLowerCase()] = desig._id;
            return acc;
        }, {});

        for (const empData of mappedEmployees) {
            try {
                const firstName = empData?.personalInfo?.firstName?.trim();
                const lastName = empData?.personalInfo?.lastName?.trim();
                const email = empData?.contactInfo?.primaryEmail?.toLowerCase().trim();
                const phone = empData?.contactInfo?.primaryPhone;
                const dateOfJoining = empData?.employmentInfo?.dateOfJoining;
                const workLocation = empData?.employmentInfo?.workLocation || "Office";

                if (!firstName || !lastName || !email) {
                    results.failed.push({ data: empData, error: "Missing required fields (first name, last name, email)" });
                    continue;
                }

                const existingEmployee = await Employee.findOne({
                    companyRef: companyId,
                    "contactInfo.primaryEmail": email,
                    "systemInfo.isActive": true
                });
                if (existingEmployee) {
                    results.duplicates.push({ email, existingEmployeeId: existingEmployee.employeeId });
                    continue;
                }

                const roleName = empData?.roleRef;
                const departmentName = empData?.departmentRef;
                const designationName = empData?.designationRef;

                let departmentRef = departmentMap[departmentName?.toLowerCase()];
                if (!departmentRef && departmentName) {
                    const newDept = await Department.create({
                        departmentName,
                        departmentCode: departmentName.toUpperCase().replace(/\s+/g, '_'),
                        companyRef: companyId
                    });
                    departmentRef = newDept._id;
                    departmentMap[departmentName.toLowerCase()] = newDept._id;
                }

                let roleRef = roleMap[roleName?.toLowerCase()];
                if (!roleRef && roleName) {
                    const newRole = await Role.create({
                        roleName,
                        companyRef: companyId,
                        roleLevel: 1,
                        isActive: true,
                        permissions: {
                            employeePermissions: "None",
                            clientPermissions: "None",
                            sowPermissions: "None",
                            claimPermissions: "ViewOwn",
                            reportPermissions: "None"
                        },
                        dataAccess: {
                            clientRestriction: "Assigned",
                            claimRestriction: "Assigned",
                            sowRestriction: "Assigned",
                            reportScope: "Self",
                            financialDataAccess: false
                        }
                    });
                    roleRef = newRole._id;
                    roleMap[roleName.toLowerCase()] = newRole._id;
                }

                let designationRef = designationMap[designationName?.toLowerCase()];
                if (!designationRef && designationName) {
                    const newDesig = await Designation.create({
                        designationName,
                        designationCode: designationName.toUpperCase().replace(/\s+/g, '_'),
                        companyRef: companyId,
                        level: 1,
                        category: "Entry Level"
                    });
                    designationRef = newDesig._id;
                    designationMap[designationName.toLowerCase()] = newDesig._id;
                }

                if (!departmentRef || !roleRef || !designationRef) {
                    results.failed.push({ data: empData, error: "Invalid department, role, or designation" });
                    continue;
                }

                const permanentPassword = generateEmployeePassword(firstName);

                const newEmployee = new Employee({
                    companyRef: companyId,
                    roleRef,
                    departmentRef,
                    designationRef,
                    personalInfo: {
                        firstName,
                        middleName: empData.personalInfo?.middleName?.trim(),
                        lastName
                    },
                    contactInfo: {
                        primaryEmail: email,
                        primaryPhone: phone
                    },
                    employmentInfo: {
                        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
                        workLocation
                    },
                    systemInfo: {
                        isActive: true,
                        emailVerified: false
                    },
                    auditInfo: {
                        createdBy: companyId
                    }
                });

                await newEmployee.hashPassword(permanentPassword);
                await newEmployee.save();

                await sendEmail({
                    to: email,
                    currentTemplate: EMAIL_TEMPLATES.EMPLOYEE_WELCOME,
                    data: {
                        name: `${firstName} ${lastName}`,
                        employeeId: newEmployee.employeeId,
                        email,
                        permanentPassword,
                        companyName: company.companyName,
                        portalUrl: `${process.env.FRONTEND_URL} / employee / login`
                    }
                });

                results.successful.push({
                    employeeId: newEmployee.employeeId,
                    email,
                    name: `${firstName} ${lastName}`
                });

            } catch (error) {
                results.failed.push({ data: empData, error: error.message });
            }
        }

        const adminEmail = req.company?.contactEmail;
        if (adminEmail) {
            await sendEmail({
                to: adminEmail,
                currentTemplate: EMAIL_TEMPLATES.BULK_UPLOAD_RESULTS,
                data: {
                    successful: results.successful.length,
                    failed: results.failed.length,
                    duplicates: results.duplicates.length
                }
            });
        }

        return res.status(200).json(
            new ApiResponse(200, {
                summary: {
                    total: employees.length,
                    successful: results.successful.length,
                    failed: results.failed.length,
                    duplicates: results.duplicates.length
                },
                successful: results.successful,
                failed: results.failed,
                duplicates: results.duplicates
            }, "Bulk upload completed")
        );

    } catch (error) {
        throw new ApiError(400, `Error processing bulk upload: ${error.message}`);
    }
});

// Get Performance Leaderboard
const getPerformanceLeaderboard = asyncHandler(async (req, res) => {
    const companyId = req.company?._id;
    const { period = 'weekly', limit = 10 } = req.query;

    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    try {
        const leaderboard = await Employee.getPerformanceLeaderboard(companyId, period);

        return res.status(200).json(
            new ApiResponse(200, leaderboard, `${period} performance leaderboard retrieved successfully`)
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching leaderboard: ${error.message}`);
    }
});

export {
    addEmployee,
    loginEmployee,
    logoutEmployee,
    getEmployeeProfile,
    updateEmployeeProfile,
    uploadEmployeeAvatar,
    bulkUploadEmployees,
    getCompanyEmployees,
    getEmployeeDetails,
    updateEmployee,
    deactivateEmployee,
    reactivateEmployee,
    resetEmployeePassword,
    deleteEmployee,
    getPerformanceLeaderboard
};