// backend/src/controllers/admin/masterAdminController.controller.js

// backend/src/controllers/admin/masterAdminController.controller.js

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { getMasterAdminInfo, generateMasterAdminToken } from "../../utils/jwtHelper.js";
import { Company } from "../../models/core/company.model.js";
import { Employee } from "../../models/core/employee.model.js";

// ============= AUTHENTICATION =============

// Master Admin Login (uses hardcoded credentials)
const loginMasterAdmin = asyncHandler(async (req, res) => {
    // The verifyMasterAdminLogin middleware already handles credential verification
    // If we reach here, credentials are valid and req.masterAdmin is set

    const masterAdminToken = generateMasterAdminToken();
    res.cookie("masterAdminToken", masterAdminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const adminInfo = getMasterAdminInfo();
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                master: adminInfo,
                token1: masterAdminToken,
                token2: masterAdminToken
            },
            "Login successful"
        )
    );
});

// Master Admin Logout
const logoutMasterAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("masterAdminToken");

    return res.status(200).json(
        new ApiResponse(200, {}, "Master admin logged out successfully")
    );
});

// Get Master Admin Profile
const getMasterAdminProfile = asyncHandler(async (req, res) => {
    const adminInfo = getMasterAdminInfo();

    return res.status(200).json(
        new ApiResponse(200, adminInfo, "Master admin profile retrieved successfully")
    );
});

// ============= COMPANY MANAGEMENT =============

// Get All Companies with Advanced Filtering
const getAllCompanies = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        search,
        subscriptionPlan,
        subscriptionStatus,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
        filter.$or = [
            { companyName: { $regex: search, $options: 'i' } },
            { companyEmail: { $regex: search, $options: 'i' } },
            { companyId: { $regex: search, $options: 'i' } }
        ];
    }

    if (subscriptionPlan) filter.subscriptionPlan = subscriptionPlan;
    if (subscriptionStatus) filter.subscriptionStatus = subscriptionStatus;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const companies = await Company.find(filter)
            .select('-companyPassword')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Enhance companies with employee statistics
        const companiesWithStats = await Promise.all(
            companies.map(async (company) => {
                const [employeeCount, activeEmployees] = await Promise.all([
                    Employee.countDocuments({ companyRef: company._id }),
                    Employee.countDocuments({
                        companyRef: company._id,
                        'status.employeeStatus': 'Active'
                    })
                ]);

                return {
                    ...company,
                    stats: {
                        totalEmployees: employeeCount,
                        activeEmployees,
                        employeeUtilization: employeeCount > 0 ?
                            ((activeEmployees / employeeCount) * 100).toFixed(1) : 0
                    }
                };
            })
        );

        const totalCompanies = await Company.countDocuments(filter);
        const totalPages = Math.ceil(totalCompanies / parseInt(limit));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    companies: companiesWithStats,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalCompanies,
                        limit: parseInt(limit),
                        hasNext: parseInt(page) < totalPages,
                        hasPrev: parseInt(page) > 1
                    },
                    filters: {
                        search,
                        subscriptionPlan,
                        subscriptionStatus,
                        isActive,
                        sortBy,
                        sortOrder
                    }
                },
                "Companies retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching companies: ${error.message}`);
    }
});

// Get Company Details with Complete Analytics
const getCompanyDetails = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    const company = await Company.findOne({ companyId })
        .select('-companyPassword')
        .lean();

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    try {
        // Get comprehensive company analytics
        const [
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            recentEmployees,
            departmentBreakdown,
            roleBreakdown
        ] = await Promise.all([
            Employee.countDocuments({ companyRef: company._id }),
            Employee.countDocuments({
                companyRef: company._id,
                'status.employeeStatus': 'Active'
            }),
            Employee.countDocuments({
                companyRef: company._id,
                'status.employeeStatus': { $ne: 'Active' }
            }),
            Employee.find({ companyRef: company._id })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('personalInfo.firstName personalInfo.lastName employeeId status.employeeStatus createdAt')
                .populate('roleRef', 'roleName')
                .lean(),
            Employee.aggregate([
                { $match: { companyRef: company._id } },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'departmentRef',
                        foreignField: '_id',
                        as: 'department'
                    }
                },
                { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$department.departmentName',
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: { $cond: [{ $eq: ['$status.employeeStatus', 'Active'] }, 1, 0] }
                        }
                    }
                }
            ]),
            Employee.aggregate([
                { $match: { companyRef: company._id } },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'roleRef',
                        foreignField: '_id',
                        as: 'role'
                    }
                },
                { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$role.roleName',
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: { $cond: [{ $eq: ['$status.employeeStatus', 'Active'] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);

        const companyWithFullAnalytics = {
            ...company,
            analytics: {
                employees: {
                    total: totalEmployees,
                    active: activeEmployees,
                    inactive: inactiveEmployees,
                    utilizationRate: totalEmployees > 0 ?
                        ((activeEmployees / totalEmployees) * 100).toFixed(1) : 0
                },
                recent: recentEmployees,
                breakdown: {
                    departments: departmentBreakdown,
                    roles: roleBreakdown
                }
            }
        };

        return res.status(200).json(
            new ApiResponse(200, companyWithFullAnalytics, "Company details retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching company details: ${error.message}`);
    }
});

// Suspend or Activate Company
const toggleCompanyStatus = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { action, reason } = req.body; // action: 'suspend' | 'activate'

    const company = await Company.findOne({ companyId });
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const oldStatus = {
        isActive: company.isActive,
        subscriptionStatus: company.subscriptionStatus
    };

    if (action === 'suspend') {
        company.isActive = false;
        company.subscriptionStatus = "Suspended";
        company.suspensionReason = reason || "Suspended by master admin";
        company.suspendedAt = new Date();
    } else if (action === 'activate') {
        company.isActive = true;
        company.subscriptionStatus = "Active";
        company.suspensionReason = null;
        company.suspendedAt = null;
    } else {
        throw new ApiError(400, "Invalid action. Use 'suspend' or 'activate'");
    }

    await company.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                companyId,
                oldStatus,
                newStatus: {
                    isActive: company.isActive,
                    subscriptionStatus: company.subscriptionStatus
                },
                reason: reason || null,
                actionPerformedBy: "Master Admin"
            },
            `Company ${action}d successfully`
        )
    );
});

// Change Subscription Plan
const changeSubscriptionPlan = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { newPlan, effectiveDate, reason } = req.body;

    const validPlans = ["Basic", "Professional", "Enterprise", "Custom"];
    if (!validPlans.includes(newPlan)) {
        throw new ApiError(400, `Invalid subscription plan. Valid plans: ${validPlans.join(', ')}`);
    }

    const company = await Company.findOne({ companyId });
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const oldPlan = company.subscriptionPlan;
    company.subscriptionPlan = newPlan;

    await company.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                companyId,
                oldPlan,
                newPlan,
                effectiveDate: effectiveDate || new Date(),
                reason: reason || "Changed by master admin",
                changedBy: "Master Admin"
            },
            "Subscription plan updated successfully"
        )
    );
});

// ============= PLATFORM ANALYTICS =============

// Get Comprehensive Platform Statistics
const getPlatformStats = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const periodDays = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
    };

    const days = periodDays[period] || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    try {
        const [
            totalCompanies,
            activeCompanies,
            suspendedCompanies,
            totalEmployees,
            activeEmployees,
            newCompaniesThisPeriod,
            newEmployeesThisPeriod,
            subscriptionBreakdown,
            companyGrowth,
            topCompanies
        ] = await Promise.all([
            Company.countDocuments(),
            Company.countDocuments({ isActive: true }),
            Company.countDocuments({ isActive: false }),
            Employee.countDocuments(),
            Employee.countDocuments({ "status.employeeStatus": "Active" }),
            Company.countDocuments({ createdAt: { $gte: fromDate } }),
            Employee.countDocuments({ createdAt: { $gte: fromDate } }),

            // Subscription plan breakdown
            Company.aggregate([
                {
                    $group: {
                        _id: "$subscriptionPlan",
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                        }
                    }
                }
            ]),

            // Company growth over time
            Company.aggregate([
                {
                    $match: { createdAt: { $gte: fromDate } }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ]),

            // Top companies by employee count
            Company.aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: '_id',
                        foreignField: 'companyRef',
                        as: 'employees'
                    }
                },
                {
                    $project: {
                        companyName: 1,
                        companyId: 1,
                        subscriptionPlan: 1,
                        isActive: 1,
                        employeeCount: { $size: '$employees' },
                        activeEmployeeCount: {
                            $size: {
                                $filter: {
                                    input: '$employees',
                                    cond: { $eq: ['$$this.status.employeeStatus', 'Active'] }
                                }
                            }
                        }
                    }
                },
                { $sort: { employeeCount: -1 } },
                { $limit: 10 }
            ])
        ]);

        const growthRate = totalCompanies > 0 ?
            ((newCompaniesThisPeriod / totalCompanies) * 100).toFixed(2) : 0;

        const employeeGrowthRate = totalEmployees > 0 ?
            ((newEmployeesThisPeriod / totalEmployees) * 100).toFixed(2) : 0;

        const platformStats = {
            overview: {
                totalCompanies,
                activeCompanies,
                suspendedCompanies,
                totalEmployees,
                activeEmployees,
                companyGrowthRate: growthRate,
                employeeGrowthRate: employeeGrowthRate,
                averageEmployeesPerCompany: totalCompanies > 0 ?
                    (totalEmployees / totalCompanies).toFixed(1) : 0
            },
            growth: {
                newCompaniesThisPeriod,
                newEmployeesThisPeriod,
                dailyGrowth: companyGrowth
            },
            subscriptions: subscriptionBreakdown,
            topCompanies: topCompanies,
            period: period,
            generatedAt: new Date(),
            generatedBy: "Master Admin"
        };

        return res.status(200).json(
            new ApiResponse(200, platformStats, "Platform statistics retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching platform stats: ${error.message}`);
    }
});

// Get All Employees Across Platform
const getAllEmployeesAcrossPlatform = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        search,
        companyId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (search) {
        filter.$or = [
            { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
            { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } }
        ];
    }

    if (companyId) {
        const company = await Company.findOne({ companyId });
        if (company) {
            filter.companyRef = company._id;
        }
    }

    if (status) filter['status.employeeStatus'] = status;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const employees = await Employee.find(filter)
            .populate('companyRef', 'companyName companyId subscriptionPlan')
            .populate('roleRef', 'roleName roleLevel')
            .populate('departmentRef', 'departmentName')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-authentication.passwordHash')
            .lean();

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
                "Platform employees retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching platform employees: ${error.message}`);
    }
});

export {
    // Authentication
    loginMasterAdmin,
    logoutMasterAdmin,
    getMasterAdminProfile,

    // Company Management
    getAllCompanies,
    getCompanyDetails,
    toggleCompanyStatus,
    changeSubscriptionPlan,

    // Platform Analytics
    getPlatformStats,
    getAllEmployeesAcrossPlatform
};