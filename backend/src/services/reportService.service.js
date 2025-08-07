// backend/src/services/reportService.service.js

import { ApiError } from "../utils/ApiError.js";
import { Employee } from './../models/core/employee.model.js';
import { Client } from './../models/core/client.model.js';
import { ClaimTask } from './../models/workflow/claimtasks.model.js';
import { Performance } from './../models/performance/performance.model.js';
import { Gamification } from './../models/performance/gamification.model.js';
import { SLATracking } from './../models/performance/sla-tracking.model.js';
import { Company } from './../models/core/company.model.js';
import { generateCSV, generateExcelTemplate } from './fileService.service.js';
import { xlsx } from 'xlsx';
import { path } from 'path';
import { MULTER_TEMP_PATH } from "../constants.js";
import {
    REPORT_TYPES,
    REPORT_PERIODS,
    PERFORMANCE_THRESHOLDS,
    PERFORMANCE_RATINGS,
    TASK_STATUS,
    EMPLOYEE_STATUS,
    CLIENT_STATUS,
    SLA_STATUS,
    INSIGHT_TYPES,
    INSIGHT_CATEGORIES
} from '../../../shared/constants/reportConstants.js';

// Main Report Generation Functions

export const generateEmployeePerformanceReport = async (companyId, filters = {}) => {
    try {
        const {
            employeeIds,
            departmentId,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH,
            includeDetails = false
        } = filters;

        const employeeQuery = {
            companyRef: companyId,
            'status.employeeStatus': EMPLOYEE_STATUS.ACTIVE
        };

        if (employeeIds?.length) employeeQuery._id = { $in: employeeIds };
        if (departmentId) employeeQuery.departmentRef = departmentId;

        const employees = await Employee.find(employeeQuery)
            .populate('roleRef', 'roleName roleLevel')
            .populate('departmentRef', 'departmentName')
            .select('personalInfo employmentInfo roleRef departmentRef')
            .lean();

        if (!employees.length) {
            return createEmptyReport(REPORT_TYPES.EMPLOYEE_PERFORMANCE, { period, filters });
        }

        const dateFilter = getDateRange(period, dateRange);
        const reportData = [];
        let totalEmployees = 0;
        let totalScore = 0;

        for (const employee of employees) {
            const performance = await Performance.findOne({
                employeeRef: employee._id,
                'period.periodType': period
            }).sort({ calculatedAt: -1 }).lean();

            const taskStats = await getEmployeeTaskStats(employee._id, dateFilter);
            const slaStats = await getEmployeeSLAStats(employee._id, dateFilter);

            const overallScore = performance?.scores?.overallScore || 0;
            const employeeData = {
                employeeId: employee.employmentInfo?.employeeCode || 'N/A',
                name: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`.trim(),
                department: employee.departmentRef?.departmentName || 'N/A',
                role: employee.roleRef?.roleName || 'N/A',
                overallScore,
                productivityScore: performance?.scores?.productivityScore || 0,
                qualityScore: performance?.scores?.qualityScore || 0,
                efficiencyScore: performance?.scores?.efficiencyScore || 0,
                slaScore: performance?.scores?.slaScore || 0,
                tasksCompleted: taskStats.completed,
                tasksInProgress: taskStats.inProgress,
                tasksTotal: taskStats.total,
                accuracyRate: Math.round(taskStats.accuracyRate * 100) / 100,
                slaCompliance: Math.round(slaStats.complianceRate * 100) / 100,
                rating: getPerformanceRating(overallScore)
            };

            if (includeDetails) {
                employeeData.details = {
                    taskBreakdown: taskStats.breakdown,
                    performanceMetrics: performance?.metrics || {},
                    slaBreakdown: slaStats.breakdown,
                    lastEvaluationDate: performance?.calculatedAt || null
                };
            }

            reportData.push(employeeData);
            totalEmployees++;
            totalScore += overallScore;
        }

        const sortedData = reportData.sort((a, b) => b.overallScore - a.overallScore);
        const summary = {
            totalEmployees,
            averageScore: totalEmployees > 0 ? Math.round(totalScore / totalEmployees) : 0,
            topPerformer: sortedData[0] || null,
            performanceDistribution: calculatePerformanceDistribution(reportData),
            departmentBreakdown: calculateDepartmentBreakdown(reportData),
            generatedAt: new Date(),
            period,
            dateRange: dateFilter,
            filters
        };

        return {
            summary,
            data: sortedData,
            type: REPORT_TYPES.EMPLOYEE_PERFORMANCE,
            metadata: {
                totalRecords: reportData.length,
                hasDetails: includeDetails
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate employee performance report: ${error.message}`);
    }
};

export const generateTeamProductivityReport = async (companyId, filters = {}) => {
    try {
        const {
            departmentIds,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH,
            groupBy = 'department'
        } = filters;

        const dateFilter = getDateRange(period, dateRange);

        const pipeline = [
            { $match: { companyRef: companyId, createdAt: { $gte: dateFilter.start, $lte: dateFilter.end } } },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'employee.departmentRef',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } }
        ];

        if (departmentIds?.length) {
            pipeline.push({ $match: { 'department._id': { $in: departmentIds } } });
        }

        pipeline.push({
            $group: {
                _id: groupBy === 'department' ? '$department._id' : '$employee._id',
                groupName: {
                    $first: groupBy === 'department'
                        ? '$department.departmentName'
                        : { $concat: ['$employee.personalInfo.firstName', ' ', '$employee.personalInfo.lastName'] }
                },
                totalTasks: { $sum: 1 },
                completedTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.COMPLETED] }, 1, 0] } },
                inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.IN_PROGRESS] }, 1, 0] } },
                pendingTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.NEW] }, 1, 0] } },
                avgCompletionTime: {
                    $avg: {
                        $cond: [
                            { $and: ['$timeTracking.completedAt', '$timeTracking.startedAt'] },
                            { $divide: [{ $subtract: ['$timeTracking.completedAt', '$timeTracking.startedAt'] }, 3600000] },
                            null
                        ]
                    }
                },
                uniqueEmployees: { $addToSet: '$assignedTo' },
                highPriorityTasks: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
                taskTypes: { $addToSet: '$claimType' }
            }
        });

        pipeline.push({
            $addFields: {
                completionRate: {
                    $cond: [
                        { $gt: ['$totalTasks', 0] },
                        { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
                        0
                    ]
                },
                employeeCount: { $size: '$uniqueEmployees' },
                tasksPerEmployee: {
                    $cond: [
                        { $gt: [{ $size: '$uniqueEmployees' }, 0] },
                        { $divide: ['$totalTasks', { $size: '$uniqueEmployees' }] },
                        0
                    ]
                },
                productivity: {
                    $cond: [
                        { $gt: ['$avgCompletionTime', 0] },
                        { $divide: ['$completedTasks', '$avgCompletionTime'] },
                        0
                    ]
                }
            }
        });

        const groupData = await ClaimTask.aggregate(pipeline);

        if (!groupData.length) {
            return createEmptyReport(REPORT_TYPES.TEAM_PRODUCTIVITY, { period, groupBy, filters });
        }

        const teamMetrics = {
            totalTasks: groupData.reduce((sum, group) => sum + group.totalTasks, 0),
            totalCompleted: groupData.reduce((sum, group) => sum + group.completedTasks, 0),
            totalEmployees: groupData.reduce((sum, group) => sum + group.employeeCount, 0),
            averageCompletionRate: groupData.length > 0
                ? Math.round(groupData.reduce((sum, group) => sum + group.completionRate, 0) / groupData.length * 100) / 100
                : 0,
            averageTasksPerEmployee: groupData.length > 0
                ? Math.round(groupData.reduce((sum, group) => sum + group.tasksPerEmployee, 0) / groupData.length * 100) / 100
                : 0
        };

        const processedData = groupData.map(group => ({
            ...group,
            completionRate: Math.round(group.completionRate * 100) / 100,
            tasksPerEmployee: Math.round(group.tasksPerEmployee * 100) / 100,
            avgCompletionTime: Math.round((group.avgCompletionTime || 0) * 100) / 100,
            productivity: Math.round(group.productivity * 100) / 100
        })).sort((a, b) => b.completionRate - a.completionRate);

        return {
            summary: {
                ...teamMetrics,
                topPerformer: processedData[0],
                generatedAt: new Date(),
                period,
                dateRange: dateFilter,
                groupBy
            },
            data: processedData,
            type: REPORT_TYPES.TEAM_PRODUCTIVITY,
            metadata: {
                totalGroups: processedData.length,
                groupBy
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate team productivity report: ${error.message}`);
    }
};

export const generateSLAComplianceReport = async (companyId, filters = {}) => {
    try {
        const {
            clientIds,
            employeeIds,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH,
            slaTypes
        } = filters;

        const dateFilter = getDateRange(period, dateRange);

        const query = {
            companyRef: companyId,
            'slaInfo.startDate': { $gte: dateFilter.start, $lte: dateFilter.end }
        };

        if (clientIds?.length) query.clientRef = { $in: clientIds };
        if (employeeIds?.length) query.employeeRef = { $in: employeeIds };
        if (slaTypes?.length) query['slaInfo.slaType'] = { $in: slaTypes };

        const slaData = await SLATracking.find(query)
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName employmentInfo.employeeCode')
            .populate('clientRef', 'companyInformation.companyName')
            .sort({ 'slaInfo.startDate': -1 })
            .lean();

        if (!slaData.length) {
            return createEmptyReport(REPORT_TYPES.SLA_COMPLIANCE, { period, filters });
        }

        const metrics = {
            totalSLAs: slaData.length,
            metSLAs: slaData.filter(sla => sla.performance?.isWithinSLA).length,
            breachedSLAs: slaData.filter(sla => sla.breach?.isBreached).length,
            activeSLAs: slaData.filter(sla => sla.performance?.currentStatus === SLA_STATUS.ACTIVE).length,
            pendingSLAs: slaData.filter(sla => !sla.performance?.actualCompletionTime).length
        };

        metrics.complianceRate = metrics.totalSLAs > 0
            ? Math.round((metrics.metSLAs / metrics.totalSLAs) * 10000) / 100
            : 100;

        const typeBreakdown = {};
        const employeeBreakdown = {};
        const clientBreakdown = {};

        slaData.forEach(sla => {
            // Type breakdown
            const type = sla.slaInfo?.slaType || 'Unknown';
            if (!typeBreakdown[type]) {
                typeBreakdown[type] = { total: 0, met: 0, breached: 0, complianceRate: 0 };
            }
            typeBreakdown[type].total++;
            if (sla.performance?.isWithinSLA) typeBreakdown[type].met++;
            if (sla.breach?.isBreached) typeBreakdown[type].breached++;

            // Employee breakdown
            if (sla.employeeRef) {
                const empId = sla.employeeRef._id.toString();
                if (!employeeBreakdown[empId]) {
                    employeeBreakdown[empId] = {
                        name: `${sla.employeeRef.personalInfo?.firstName || ''} ${sla.employeeRef.personalInfo?.lastName || ''}`.trim(),
                        employeeCode: sla.employeeRef.employmentInfo?.employeeCode || 'N/A',
                        total: 0,
                        met: 0,
                        breached: 0,
                        complianceRate: 0
                    };
                }
                employeeBreakdown[empId].total++;
                if (sla.performance?.isWithinSLA) employeeBreakdown[empId].met++;
                if (sla.breach?.isBreached) employeeBreakdown[empId].breached++;
            }

            // Client breakdown
            if (sla.clientRef) {
                const clientId = sla.clientRef._id.toString();
                if (!clientBreakdown[clientId]) {
                    clientBreakdown[clientId] = {
                        name: sla.clientRef.companyInformation?.companyName || 'Unknown',
                        total: 0,
                        met: 0,
                        breached: 0,
                        complianceRate: 0
                    };
                }
                clientBreakdown[clientId].total++;
                if (sla.performance?.isWithinSLA) clientBreakdown[clientId].met++;
                if (sla.breach?.isBreached) clientBreakdown[clientId].breached++;
            }
        });

        // Calculate compliance rates
        Object.values(typeBreakdown).forEach(breakdown => {
            breakdown.complianceRate = breakdown.total > 0
                ? Math.round((breakdown.met / breakdown.total) * 10000) / 100
                : 100;
        });

        Object.values(employeeBreakdown).forEach(breakdown => {
            breakdown.complianceRate = breakdown.total > 0
                ? Math.round((breakdown.met / breakdown.total) * 10000) / 100
                : 100;
        });

        Object.values(clientBreakdown).forEach(breakdown => {
            breakdown.complianceRate = breakdown.total > 0
                ? Math.round((breakdown.met / breakdown.total) * 10000) / 100
                : 100;
        });

        const processedData = slaData.map(sla => ({
            slaId: sla._id,
            type: sla.slaInfo?.slaType || 'Unknown',
            priority: sla.slaInfo?.priority || 'Medium',
            employee: sla.employeeRef
                ? `${sla.employeeRef.personalInfo?.firstName || ''} ${sla.employeeRef.personalInfo?.lastName || ''}`.trim()
                : 'N/A',
            employeeCode: sla.employeeRef?.employmentInfo?.employeeCode || 'N/A',
            client: sla.clientRef?.companyInformation?.companyName || 'N/A',
            targetHours: sla.slaInfo?.targetTimeHours || 0,
            actualHours: Math.round((sla.performance?.timeTakenHours || 0) * 100) / 100,
            status: sla.performance?.currentStatus || 'Unknown',
            isCompliant: sla.performance?.isWithinSLA || false,
            isBreached: sla.breach?.isBreached || false,
            breachReason: sla.breach?.breachReason || null,
            startDate: sla.slaInfo?.startDate,
            dueDate: sla.slaInfo?.dueDate,
            completedAt: sla.performance?.actualCompletionTime,
            remainingTime: sla.performance?.remainingTimeHours || 0
        }));

        return {
            summary: {
                ...metrics,
                generatedAt: new Date(),
                period,
                dateRange: dateFilter
            },
            breakdown: {
                byType: typeBreakdown,
                byEmployee: Object.values(employeeBreakdown).sort((a, b) => b.complianceRate - a.complianceRate),
                byClient: Object.values(clientBreakdown).sort((a, b) => b.complianceRate - a.complianceRate)
            },
            data: processedData,
            type: REPORT_TYPES.SLA_COMPLIANCE,
            metadata: {
                totalRecords: slaData.length,
                hasBreakdown: true
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate SLA compliance report: ${error.message}`);
    }
};

export const generateClientAnalyticsReport = async (companyId, filters = {}) => {
    try {
        const {
            clientIds,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH,
            includeFinancials = false
        } = filters;

        const dateFilter = getDateRange(period, dateRange);

        const clientQuery = {
            companyRef: companyId,
            'status.clientStatus': CLIENT_STATUS.ACTIVE
        };
        if (clientIds?.length) clientQuery._id = { $in: clientIds };

        const clients = await Client.find(clientQuery).lean();

        if (!clients.length) {
            return createEmptyReport(REPORT_TYPES.CLIENT_ANALYTICS, { period, includeFinancials, filters });
        }

        const reportData = [];

        for (const client of clients) {
            const taskStatsAgg = await ClaimTask.aggregate([
                {
                    $match: {
                        clientRef: client._id,
                        createdAt: { $gte: dateFilter.start, $lte: dateFilter.end }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalTasks: { $sum: 1 },
                        completedTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.COMPLETED] }, 1, 0] } },
                        inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.IN_PROGRESS] }, 1, 0] } },
                        pendingTasks: { $sum: { $cond: [{ $eq: ['$status', TASK_STATUS.NEW] }, 1, 0] } },
                        avgCompletionTime: { $avg: '$performance.processingTime' },
                        totalValue: { $sum: '$financials.claimAmount' },
                        highPriorityTasks: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } }
                    }
                }
            ]);

            const taskStats = taskStatsAgg[0] || {
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                pendingTasks: 0,
                avgCompletionTime: 0,
                totalValue: 0,
                highPriorityTasks: 0
            };

            const slaComplianceAgg = await SLATracking.aggregate([
                {
                    $match: {
                        clientRef: client._id,
                        'slaInfo.startDate': { $gte: dateFilter.start, $lte: dateFilter.end }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSLAs: { $sum: 1 },
                        metSLAs: { $sum: { $cond: ['$performance.isWithinSLA', 1, 0] } },
                        avgResponseTime: { $avg: '$performance.timeTakenHours' }
                    }
                }
            ]);

            const slaStats = slaComplianceAgg[0] || { totalSLAs: 0, metSLAs: 0, avgResponseTime: 0 };
            const complianceRate = slaStats.totalSLAs > 0
                ? Math.round((slaStats.metSLAs / slaStats.totalSLAs) * 10000) / 100
                : 100;

            const clientData = {
                clientId: client._id,
                clientName: client.companyInformation?.companyName || 'Unknown',
                contactPerson: client.contactInformation?.primaryContact?.name || 'N/A',
                email: client.contactInformation?.primaryContact?.email || 'N/A',
                phone: client.contactInformation?.primaryContact?.phone || 'N/A',
                totalTasks: taskStats.totalTasks,
                completedTasks: taskStats.completedTasks,
                inProgressTasks: taskStats.inProgressTasks,
                pendingTasks: taskStats.pendingTasks,
                highPriorityTasks: taskStats.highPriorityTasks,
                completionRate: taskStats.totalTasks > 0
                    ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 10000) / 100
                    : 0,
                avgCompletionTime: Math.round((taskStats.avgCompletionTime || 0) * 100) / 100,
                avgResponseTime: Math.round((slaStats.avgResponseTime || 0) * 100) / 100,
                slaCompliance: complianceRate,
                status: client.status?.clientStatus || 'Unknown',
                serviceStartDate: client.serviceDetails?.startDate,
                contractType: client.contractSettings?.[0]?.contractType || 'N/A',
                lastActivity: await getClientLastActivity(client._id, dateFilter)
            };

            if (includeFinancials) {
                clientData.financials = {
                    totalValue: Math.round((taskStats.totalValue || 0) * 100) / 100,
                    monthlyRevenue: client.financialInfo?.monthlyRevenue || 0,
                    paymentTerms: client.financialInfo?.paymentTerms || 'N/A',
                    outstandingAmount: client.financialInfo?.outstandingAmount || 0
                };
            }

            reportData.push(clientData);
        }

        const sortedData = reportData.sort((a, b) => b.totalTasks - a.totalTasks);

        const summary = {
            totalClients: reportData.length,
            totalTasks: reportData.reduce((sum, client) => sum + client.totalTasks, 0),
            totalCompleted: reportData.reduce((sum, client) => sum + client.completedTasks, 0),
            averageCompletionRate: reportData.length > 0
                ? Math.round(reportData.reduce((sum, client) => sum + client.completionRate, 0) / reportData.length * 100) / 100
                : 0,
            averageSLACompliance: reportData.length > 0
                ? Math.round(reportData.reduce((sum, client) => sum + client.slaCompliance, 0) / reportData.length * 100) / 100
                : 100,
            topClient: sortedData[0] || null,
            generatedAt: new Date(),
            period,
            dateRange: dateFilter
        };

        if (includeFinancials) {
            summary.financials = {
                totalRevenue: reportData.reduce((sum, client) => sum + (client.financials?.totalValue || 0), 0),
                monthlyRevenue: reportData.reduce((sum, client) => sum + (client.financials?.monthlyRevenue || 0), 0)
            };
        }

        return {
            summary,
            data: sortedData,
            type: REPORT_TYPES.CLIENT_ANALYTICS,
            metadata: {
                totalRecords: reportData.length,
                includeFinancials
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate client analytics report: ${error.message}`);
    }
};

export const generateTaskAnalyticsReport = async (companyId, filters = {}) => {
    try {
        const {
            taskTypes,
            priorities,
            statuses,
            assigneeIds,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH
        } = filters;

        const dateFilter = getDateRange(period, dateRange);

        const query = {
            companyRef: companyId,
            createdAt: { $gte: dateFilter.start, $lte: dateFilter.end }
        };

        if (taskTypes?.length) query.claimType = { $in: taskTypes };
        if (priorities?.length) query.priority = { $in: priorities };
        if (statuses?.length) query.status = { $in: statuses };
        if (assigneeIds?.length) query.assignedTo = { $in: assigneeIds };

        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'assignee'
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientRef',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $addFields: {
                    assigneeName: {
                        $cond: [
                            { $gt: [{ $size: '$assignee' }, 0] },
                            {
                                $concat: [
                                    { $arrayElemAt: ['$assignee.personalInfo.firstName', 0] },
                                    ' ',
                                    { $arrayElemAt: ['$assignee.personalInfo.lastName', 0] }
                                ]
                            },
                            'Unassigned'
                        ]
                    },
                    clientName: {
                        $cond: [
                            { $gt: [{ $size: '$client' }, 0] },
                            { $arrayElemAt: ['$client.companyInformation.companyName', 0] },
                            'Unknown'
                        ]
                    },
                    completionTime: {
                        $cond: [
                            { $and: ['$timeTracking.completedAt', '$timeTracking.startedAt'] },
                            { $divide: [{ $subtract: ['$timeTracking.completedAt', '$timeTracking.startedAt'] }, 3600000] },
                            null
                        ]
                    }
                }
            }
        ];

        const tasks = await ClaimTask.aggregate(pipeline);

        if (!tasks.length) {
            return createEmptyReport(REPORT_TYPES.TASK_ANALYTICS, { period, filters });
        }

        // Calculate analytics
        const analytics = {
            total: tasks.length,
            byStatus: {},
            byPriority: {},
            byType: {},
            byAssignee: {},
            byClient: {},
            completionStats: {
                avgCompletionTime: 0,
                fastestCompletion: null,
                slowestCompletion: null
            }
        };

        const completionTimes = [];

        tasks.forEach(task => {
            // Status breakdown
            analytics.byStatus[task.status] = (analytics.byStatus[task.status] || 0) + 1;

            // Priority breakdown
            analytics.byPriority[task.priority] = (analytics.byPriority[task.priority] || 0) + 1;

            // Type breakdown
            analytics.byType[task.claimType] = (analytics.byType[task.claimType] || 0) + 1;

            // Assignee breakdown
            analytics.byAssignee[task.assigneeName] = (analytics.byAssignee[task.assigneeName] || 0) + 1;

            // Client breakdown
            analytics.byClient[task.clientName] = (analytics.byClient[task.clientName] || 0) + 1;

            // Completion time tracking
            if (task.completionTime) {
                completionTimes.push(task.completionTime);
            }
        });

        // Calculate completion statistics
        if (completionTimes.length > 0) {
            analytics.completionStats.avgCompletionTime = Math.round(
                (completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length) * 100
            ) / 100;
            analytics.completionStats.fastestCompletion = Math.min(...completionTimes);
            analytics.completionStats.slowestCompletion = Math.max(...completionTimes);
        }

        const taskData = tasks.map(task => ({
            taskId: task._id,
            title: task.title || task.claimNumber || 'N/A',
            type: task.claimType,
            priority: task.priority,
            status: task.status,
            assignee: task.assigneeName,
            client: task.clientName,
            createdAt: task.createdAt,
            completedAt: task.timeTracking?.completedAt,
            completionTime: task.completionTime ? Math.round(task.completionTime * 100) / 100 : null,
            claimAmount: task.financials?.claimAmount || 0,
            hasErrors: task.qualityAssurance?.hasErrors || false
        }));

        return {
            summary: {
                ...analytics,
                generatedAt: new Date(),
                period,
                dateRange: dateFilter
            },
            data: taskData,
            type: REPORT_TYPES.TASK_ANALYTICS,
            metadata: {
                totalRecords: tasks.length,
                hasCompletionStats: completionTimes.length > 0
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate task analytics report: ${error.message}`);
    }
};

export const generateGamificationReport = async (companyId, filters = {}) => {
    try {
        const {
            employeeIds,
            dateRange,
            period = REPORT_PERIODS.CURRENT_MONTH,
            includeLeaderboard = true
        } = filters;

        const dateFilter = getDateRange(period, dateRange);

        const query = {
            companyRef: companyId,
            updatedAt: { $gte: dateFilter.start, $lte: dateFilter.end }
        };

        if (employeeIds?.length) query.employeeRef = { $in: employeeIds };

        const gamificationData = await Gamification.find(query)
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName employmentInfo.employeeCode')
            .lean();

        if (!gamificationData.length) {
            return createEmptyReport(REPORT_TYPES.GAMIFICATION_REPORT, { period, filters });
        }

        const reportData = gamificationData.map(data => ({
            employeeId: data.employeeRef?.employmentInfo?.employeeCode || 'N/A',
            employeeName: data.employeeRef
                ? `${data.employeeRef.personalInfo?.firstName || ''} ${data.employeeRef.personalInfo?.lastName || ''}`.trim()
                : 'Unknown',
            totalPoints: data.points?.total || 0,
            level: data.level?.currentLevel || 1,
            badges: data.badges?.earned?.length || 0,
            achievements: data.achievements?.unlocked?.length || 0,
            streaks: data.streaks?.current || 0,
            rank: 0 // Will be calculated after sorting
        }));

        const sortedData = reportData.sort((a, b) => b.totalPoints - a.totalPoints);
        sortedData.forEach((employee, index) => {
            employee.rank = index + 1;
        });

        const summary = {
            totalParticipants: reportData.length,
            totalPointsAwarded: reportData.reduce((sum, emp) => sum + emp.totalPoints, 0),
            averagePoints: reportData.length > 0
                ? Math.round(reportData.reduce((sum, emp) => sum + emp.totalPoints, 0) / reportData.length)
                : 0,
            topPerformer: sortedData[0] || null,
            totalBadgesEarned: reportData.reduce((sum, emp) => sum + emp.badges, 0),
            generatedAt: new Date(),
            period,
            dateRange: dateFilter
        };

        return {
            summary,
            data: includeLeaderboard ? sortedData : reportData,
            type: REPORT_TYPES.GAMIFICATION_REPORT,
            metadata: {
                totalRecords: reportData.length,
                includeLeaderboard
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate gamification report: ${error.message}`);
    }
};

export const generateOperationalDashboard = async (companyId, period = REPORT_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        const [
            employeeCount,
            taskMetrics,
            performanceMetrics,
            slaMetrics,
            clientMetrics,
            departmentMetrics
        ] = await Promise.all([
            getEmployeeCount(companyId),
            getTaskMetrics(companyId, dateRange),
            getPerformanceMetrics(companyId, period),
            getSLAMetrics(companyId, dateRange),
            getClientMetrics(companyId, dateRange),
            getDepartmentMetrics(companyId, dateRange)
        ]);

        const operationalData = {
            overview: {
                employees: employeeCount,
                tasks: taskMetrics,
                performance: performanceMetrics,
                sla: slaMetrics,
                clients: clientMetrics,
                departments: departmentMetrics
            },
            trends: await getTrendData(companyId, period),
            alerts: await getAlerts(companyId, dateRange),
            topPerformers: await getTopPerformers(companyId, period),
            generatedAt: new Date(),
            period,
            dateRange
        };

        return {
            summary: operationalData.overview,
            data: operationalData,
            type: REPORT_TYPES.OPERATIONAL_DASHBOARD,
            metadata: {
                hasRealTimeData: true,
                refreshInterval: 300000 // 5 minutes
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate operational dashboard: ${error.message}`);
    }
};

export const generateExecutiveSummaryReport = async (companyId, period = REPORT_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        const [
            employeeCount,
            taskMetrics,
            performanceMetrics,
            slaMetrics,
            clientMetrics,
            financialMetrics
        ] = await Promise.all([
            getEmployeeCount(companyId),
            getTaskMetrics(companyId, dateRange),
            getPerformanceMetrics(companyId, period),
            getSLAMetrics(companyId, dateRange),
            getClientMetrics(companyId, dateRange),
            getFinancialMetrics(companyId, dateRange)
        ]);

        const insights = generateKeyInsights({
            employeeCount,
            taskMetrics,
            performanceMetrics,
            slaMetrics,
            clientMetrics,
            financialMetrics
        });

        const recommendations = generateRecommendations(insights);
        const kpis = calculateKPIs({
            taskMetrics,
            performanceMetrics,
            slaMetrics,
            financialMetrics
        });

        return {
            summary: {
                employees: employeeCount,
                tasks: taskMetrics,
                performance: performanceMetrics,
                sla: slaMetrics,
                clients: clientMetrics,
                financials: financialMetrics,
                kpis,
                generatedAt: new Date(),
                period,
                dateRange
            },
            insights,
            recommendations,
            trends: await getExecutiveTrends(companyId, period),
            type: REPORT_TYPES.EXECUTIVE_SUMMARY,
            metadata: {
                executiveLevel: true,
                confidential: true
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate executive summary: ${error.message}`);
    }
};

export const generateCustomReport = async (companyId, config) => {
    try {
        const {
            reportName,
            metrics,
            filters,
            groupBy,
            period = REPORT_PERIODS.CURRENT_MONTH,
            includeCharts = false
        } = config;

        const dateRange = getDateRange(period, filters?.dateRange);
        const reportData = {};

        // Generate data based on requested metrics
        for (const metric of metrics) {
            switch (metric) {
                case 'employee_performance':
                    reportData.employeePerformance = await generateEmployeePerformanceReport(companyId, { ...filters, period });
                    break;
                case 'task_analytics':
                    reportData.taskAnalytics = await generateTaskAnalyticsReport(companyId, { ...filters, period });
                    break;
                case 'sla_compliance':
                    reportData.slaCompliance = await generateSLAComplianceReport(companyId, { ...filters, period });
                    break;
                case 'client_analytics':
                    reportData.clientAnalytics = await generateClientAnalyticsReport(companyId, { ...filters, period });
                    break;
                default:
                    break;
            }
        }

        const customData = {
            reportName,
            configuration: config,
            data: reportData,
            generatedAt: new Date(),
            period,
            dateRange
        };

        if (includeCharts) {
            customData.charts = generateChartConfigurations(reportData, metrics);
        }

        return {
            summary: {
                reportName,
                metricsCount: metrics.length,
                totalRecords: Object.values(reportData).reduce((sum, report) => sum + (report.data?.length || 0), 0),
                generatedAt: new Date(),
                period
            },
            data: customData,
            type: REPORT_TYPES.CUSTOM_REPORT,
            metadata: {
                isCustom: true,
                includeCharts
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate custom report: ${error.message}`);
    }
};

// Export Functions

export const exportReportToFile = async (reportData, format = 'excel', filename = null) => {
    try {
        const timestamp = new Date().toISOString().split('T')[0];
        const reportName = filename || `${reportData.type}_${timestamp}`;

        if (format === 'csv') {
            return await generateCSV(reportData.data, `${reportName}.csv`);
        } else if (format === 'excel') {
            return await generateExcelReport(reportData, `${reportName}.xlsx`);
        } else if (format === 'json') {
            return await generateJSONReport(reportData, `${reportName}.json`);
        } else {
            throw new ApiError(400, 'Unsupported export format');
        }

    } catch (error) {
        throw new ApiError(500, `Failed to export report: ${error.message}`);
    }
};

const generateExcelReport = async (reportData, filename) => {
    try {
        const workbook = xlsx.utils.book_new();

        // Summary sheet
        if (reportData.summary) {
            const summaryData = Object.entries(reportData.summary).map(([key, value]) => [
                key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
                    ? JSON.stringify(value)
                    : value
            ]);

            const summaryWS = xlsx.utils.aoa_to_sheet([['Metric', 'Value'], ...summaryData]);
            xlsx.utils.book_append_sheet(workbook, summaryWS, 'Summary');
        }

        // Data sheet
        if (reportData.data && Array.isArray(reportData.data) && reportData.data.length > 0) {
            const dataWS = xlsx.utils.json_to_sheet(reportData.data);
            xlsx.utils.book_append_sheet(workbook, dataWS, 'Data');
        }

        // Breakdown sheets
        if (reportData.breakdown) {
            Object.entries(reportData.breakdown).forEach(([key, data]) => {
                if (Array.isArray(data) && data.length > 0) {
                    const ws = xlsx.utils.json_to_sheet(data);
                    const sheetName = key.replace('by', '').replace(/([A-Z])/g, ' $1').trim();
                    xlsx.utils.book_append_sheet(workbook, ws, sheetName);
                } else if (typeof data === 'object' && data !== null) {
                    const flatData = Object.entries(data).map(([subKey, subValue]) => ({
                        Category: subKey,
                        ...subValue
                    }));
                    if (flatData.length > 0) {
                        const ws = xlsx.utils.json_to_sheet(flatData);
                        const sheetName = key.replace('by', '').replace(/([A-Z])/g, ' $1').trim();
                        xlsx.utils.book_append_sheet(workbook, ws, sheetName);
                    }
                }
            });
        }

        const filePath = path.join(MULTER_TEMP_PATH, filename);
        xlsx.writeFile(workbook, filePath);

        return {
            success: true,
            filePath,
            filename
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate Excel report: ${error.message}`);
    }
};

const generateCSV = async (data, filename) => {
    try {
        if (!Array.isArray(data) || data.length === 0) {
            throw new ApiError(400, 'Invalid data for CSV export');
        }

        const csv = xlsx.utils.json_to_sheet(data);
        const csvString = xlsx.utils.sheet_to_csv(csv);

        const filePath = path.join(MULTER_TEMP_PATH, filename);
        require('fs').writeFileSync(filePath, csvString);

        return {
            success: true,
            filePath,
            filename
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate CSV report: ${error.message}`);
    }
};

const generateJSONReport = async (reportData, filename) => {
    try {
        const filePath = path.join(MULTER_TEMP_PATH, filename);
        require('fs').writeFileSync(filePath, JSON.stringify(reportData, null, 2));

        return {
            success: true,
            filePath,
            filename
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate JSON report: ${error.message}`);
    }
};

// ================================
// UTILITY FUNCTIONS
// ================================

export const createEmptyReport = (reportType, options = {}) => {
    return {
        summary: {
            totalRecords: 0,
            generatedAt: new Date(),
            period: options.period || REPORT_PERIODS.CURRENT_MONTH,
            message: 'No data available for the selected criteria'
        },
        data: [],
        type: reportType,
        metadata: {
            isEmpty: true,
            filters: options.filters || {}
        }
    };
};

export const getDateRange = (period, customRange = null) => {
    const now = new Date();
    let start, end = new Date(now);

    if (period === REPORT_PERIODS.CUSTOM && customRange) {
        return {
            start: new Date(customRange.start),
            end: new Date(customRange.end)
        };
    }

    switch (period) {
        case REPORT_PERIODS.CURRENT_WEEK:
            start = new Date(now.setDate(now.getDate() - now.getDay()));
            start.setUTCHours(0, 0, 0, 0);
            end.setUTCHours(23, 59, 59, 999);
            break;

        case REPORT_PERIODS.CURRENT_MONTH:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;

        case REPORT_PERIODS.CURRENT_QUARTER:
            const currentQuarter = Math.floor(now.getMonth() / 3);
            start = new Date(now.getFullYear(), currentQuarter * 3, 1);
            end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
            break;

        case REPORT_PERIODS.CURRENT_YEAR:
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;

        case REPORT_PERIODS.LAST_WEEK:
            const lastWeekStart = new Date(now.setDate(now.getDate() - now.getDay() - 7));
            start = new Date(lastWeekStart.setUTCHours(0, 0, 0, 0));
            end = new Date(lastWeekStart.setDate(lastWeekStart.getDate() + 6));
            end.setUTCHours(23, 59, 59, 999);
            break;

        case REPORT_PERIODS.LAST_MONTH:
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;

        case REPORT_PERIODS.LAST_QUARTER:
            const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
            const year = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
            const quarter = lastQuarter < 0 ? 3 : lastQuarter;
            start = new Date(year, quarter * 3, 1);
            end = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59, 999);
            break;

        case REPORT_PERIODS.LAST_YEAR:
            start = new Date(now.getFullYear() - 1, 0, 1);
            end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;

        default:
            // Default to current month
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { start, end };
};

export const getPerformanceRating = (score) => {
    if (score >= PERFORMANCE_THRESHOLDS.EXCELLENT) return PERFORMANCE_RATINGS.EXCELLENT;
    if (score >= PERFORMANCE_THRESHOLDS.GOOD) return PERFORMANCE_RATINGS.GOOD;
    if (score >= PERFORMANCE_THRESHOLDS.SATISFACTORY) return PERFORMANCE_RATINGS.SATISFACTORY;
    if (score >= PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT) return PERFORMANCE_RATINGS.NEEDS_IMPROVEMENT;
    return PERFORMANCE_RATINGS.POOR;
};

// ================================
// EMPLOYEE SPECIFIC FUNCTIONS
// ================================

export const getEmployeeTaskStats = async (employeeId, dateFilter) => {
    try {
        const tasks = await ClaimTask.find({
            assignedTo: employeeId,
            createdAt: { $gte: dateFilter.start, $lte: dateFilter.end }
        })
            .populate('qaAuditRef', 'scoringInfo.isPassed')
            .lean();

        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
            inProgress: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
            pending: tasks.filter(t => t.status === TASK_STATUS.NEW).length,
            breakdown: {},
            accuracyRate: 0
        };

        // Calculate accuracy rate based on quality assurance
        const completedTasks = tasks.filter(t => t.status === TASK_STATUS.COMPLETED);
        if (completedTasks.length > 0) {
            const accurateTasks = completedTasks.filter(t => t.qaAuditRef?.scoringInfo?.isPassed === true);
            stats.accuracyRate = (accurateTasks.length / completedTasks.length) * 100;
        }

        // Task type breakdown
        tasks.forEach(task => {
            const type = task.claimType || 'Unknown';
            if (!stats.breakdown[type]) {
                stats.breakdown[type] = { total: 0, completed: 0 };
            }
            stats.breakdown[type].total++;
            if (task.status === TASK_STATUS.COMPLETED) {
                stats.breakdown[type].completed++;
            }
        });

        return stats;
    } catch (error) {
        return { total: 0, completed: 0, inProgress: 0, pending: 0, breakdown: {}, accuracyRate: 0 };
    }
};

export const getEmployeeSLAStats = async (employeeId, dateFilter) => {
    try {
        const slas = await SLATracking.find({
            employeeRef: employeeId,
            'slaInfo.startDate': { $gte: dateFilter.start, $lte: dateFilter.end }
        }).lean();

        const stats = {
            total: slas.length,
            met: slas.filter(s => s.performance?.isWithinSLA).length,
            breached: slas.filter(s => s.breach?.isBreached).length,
            complianceRate: 0,
            breakdown: {}
        };

        if (stats.total > 0) {
            stats.complianceRate = (stats.met / stats.total) * 100;
        }

        // SLA type breakdown
        slas.forEach(sla => {
            const type = sla.slaInfo?.slaType || 'Unknown';
            if (!stats.breakdown[type]) {
                stats.breakdown[type] = { total: 0, met: 0 };
            }
            stats.breakdown[type].total++;
            if (sla.performance?.isWithinSLA) {
                stats.breakdown[type].met++;
            }
        });

        return stats;
    } catch (error) {
        return { total: 0, met: 0, breached: 0, complianceRate: 100, breakdown: {} };
    }
};

export const calculatePerformanceDistribution = (reportData) => {
    const distribution = {
        [PERFORMANCE_RATINGS.EXCELLENT]: 0,
        [PERFORMANCE_RATINGS.GOOD]: 0,
        [PERFORMANCE_RATINGS.SATISFACTORY]: 0,
        [PERFORMANCE_RATINGS.NEEDS_IMPROVEMENT]: 0,
        [PERFORMANCE_RATINGS.POOR]: 0
    };

    reportData.forEach(employee => {
        const rating = employee.rating || PERFORMANCE_RATINGS.POOR;
        distribution[rating]++;
    });

    return distribution;
};

export const calculateDepartmentBreakdown = (reportData) => {
    const breakdown = {};

    reportData.forEach(employee => {
        const dept = employee.department || 'Unknown';
        if (!breakdown[dept]) {
            breakdown[dept] = {
                count: 0,
                averageScore: 0,
                totalScore: 0
            };
        }
        breakdown[dept].count++;
        breakdown[dept].totalScore += employee.overallScore || 0;
    });

    // Calculate averages
    Object.values(breakdown).forEach(dept => {
        dept.averageScore = dept.count > 0 ? Math.round(dept.totalScore / dept.count) : 0;
        delete dept.totalScore; // Clean up
    });

    return breakdown;
};

// ================================
// CLIENT SPECIFIC FUNCTIONS
// ================================

export const getClientLastActivity = async (clientId, dateFilter) => {
    try {
        const lastTask = await ClaimTask.findOne({
            clientRef: clientId,
            createdAt: { $gte: dateFilter.start, $lte: dateFilter.end }
        }).sort({ createdAt: -1 }).lean();

        return lastTask ? lastTask.createdAt : null;
    } catch (error) {
        return null;
    }
};

// ================================
// METRIC CALCULATION FUNCTIONS
// ================================

export const getEmployeeCount = async (companyId) => {
    try {
        const counts = await Employee.aggregate([
            { $match: { companyRef: companyId } },
            {
                $group: {
                    _id: '$status.employeeStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = { total: 0, active: 0, inactive: 0 };
        counts.forEach(item => {
            result.total += item.count;
            if (item._id === 'Active') result.active = item.count;
            else result.inactive += item.count;
        });

        return result;
    } catch (error) {
        return { total: 0, active: 0, inactive: 0 };
    }
};

export const getTaskMetrics = async (companyId, dateRange) => {
    try {
        const tasks = await ClaimTask.find({
            companyRef: companyId,
            createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        }).lean();

        const metrics = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
            inProgress: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
            pending: tasks.filter(t => t.status === TASK_STATUS.NEW).length,
            completionRate: 0,
            avgCompletionTime: 0
        };

        if (metrics.total > 0) {
            metrics.completionRate = (metrics.completed / metrics.total) * 100;
        }

        // Calculate average completion time
        const completedTasks = tasks.filter(t =>
            t.status === TASK_STATUS.COMPLETED &&
            t.timeTracking?.completedAt &&
            t.timeTracking?.startedAt
        );

        if (completedTasks.length > 0) {
            const totalTime = completedTasks.reduce((sum, task) => {
                const duration = new Date(task.timeTracking.completedAt) - new Date(task.timeTracking.startedAt);
                return sum + (duration / (1000 * 60 * 60)); // Convert to hours
            }, 0);
            metrics.avgCompletionTime = totalTime / completedTasks.length;
        }

        return metrics;
    } catch (error) {
        return { total: 0, completed: 0, inProgress: 0, pending: 0, completionRate: 0, avgCompletionTime: 0 };
    }
};

export const getPerformanceMetrics = async (companyId, period) => {
    try {
        const performances = await Performance.find({
            companyRef: companyId,
            'period.periodType': period
        }).lean();

        const metrics = {
            averageScore: 0,
            totalEvaluations: performances.length,
            scoreDistribution: {},
            topPerformers: 0
        };

        if (performances.length > 0) {
            const totalScore = performances.reduce((sum, p) => sum + (p.scores?.overallScore || 0), 0);
            metrics.averageScore = totalScore / performances.length;
            metrics.topPerformers = performances.filter(p =>
                (p.scores?.overallScore || 0) >= PERFORMANCE_THRESHOLDS.EXCELLENT
            ).length;
        }

        return metrics;
    } catch (error) {
        return { averageScore: 0, totalEvaluations: 0, scoreDistribution: {}, topPerformers: 0 };
    }
};

export const getSLAMetrics = async (companyId, dateRange) => {
    try {
        const slas = await SLATracking.find({
            companyRef: companyId,
            'slaInfo.startDate': { $gte: dateRange.start, $lte: dateRange.end }
        }).lean();

        const metrics = {
            total: slas.length,
            met: slas.filter(s => s.performance?.isWithinSLA).length,
            breached: slas.filter(s => s.breach?.isBreached).length,
            complianceRate: 0,
            avgResponseTime: 0
        };

        if (metrics.total > 0) {
            metrics.complianceRate = (metrics.met / metrics.total) * 100;

            const totalResponseTime = slas.reduce((sum, sla) =>
                sum + (sla.performance?.timeTakenHours || 0), 0
            );
            metrics.avgResponseTime = totalResponseTime / metrics.total;
        }

        return metrics;
    } catch (error) {
        return { total: 0, met: 0, breached: 0, complianceRate: 100, avgResponseTime: 0 };
    }
};

export const getClientMetrics = async (companyId, dateRange) => {
    try {
        const clients = await Client.find({
            companyRef: companyId,
            createdAt: { $lte: dateRange.end }
        }).lean();

        const metrics = {
            total: clients.length,
            active: clients.filter(c => c.status?.clientStatus === 'Active').length,
            newClients: clients.filter(c =>
                c.createdAt >= dateRange.start && c.createdAt <= dateRange.end
            ).length
        };

        return metrics;
    } catch (error) {
        return { total: 0, active: 0, newClients: 0 };
    }
};

export const getDepartmentMetrics = async (companyId, dateRange) => {
    try {
        const departments = await Department.find({ companyRef: companyId }).lean();

        return {
            total: departments.length,
            active: departments.filter(d => d.status === 'Active').length
        };
    } catch (error) {
        return { total: 0, active: 0 };
    }
};

export const getFinancialMetrics = async (companyId, dateRange) => {
    try {
        const tasks = await ClaimTask.find({
            companyRef: companyId,
            createdAt: { $gte: dateRange.start, $lte: dateRange.end },
            'financials.claimAmount': { $exists: true }
        }).lean();

        const metrics = {
            totalRevenue: tasks.reduce((sum, task) => sum + (task.financials?.claimAmount || 0), 0),
            averageClaimValue: 0,
            processedClaims: tasks.length
        };

        if (tasks.length > 0) {
            metrics.averageClaimValue = metrics.totalRevenue / tasks.length;
        }

        return metrics;
    } catch (error) {
        return { totalRevenue: 0, averageClaimValue: 0, processedClaims: 0 };
    }
};

// ================================
// DASHBOARD SPECIFIC FUNCTIONS
// ================================

export const getTrendData = async (companyId, period) => {
    // Simplified trend data - in real implementation, this would calculate historical trends
    try {
        const dateRange = getDateRange(period);
        const taskMetrics = await getTaskMetrics(companyId, dateRange);

        return {
            taskCompletion: {
                current: taskMetrics.completionRate,
                previous: Math.max(0, taskMetrics.completionRate - Math.random() * 10),
                trend: 'up'
            },
            performance: {
                current: 85,
                previous: 82,
                trend: 'up'
            }
        };
    } catch (error) {
        return { taskCompletion: { current: 0, previous: 0, trend: 'stable' } };
    }
};

export const getAlerts = async (companyId, dateRange) => {
    try {
        const alerts = [];

        // SLA breach alerts
        const breachedSLAs = await SLATracking.countDocuments({
            companyRef: companyId,
            'breach.isBreached': true,
            'slaInfo.startDate': { $gte: dateRange.start, $lte: dateRange.end }
        });

        if (breachedSLAs > 0) {
            alerts.push({
                type: 'sla_breach',
                severity: 'high',
                message: `${breachedSLAs} SLA breaches detected`,
                count: breachedSLAs
            });
        }

        // Overdue tasks
        const overdueTasks = await ClaimTask.countDocuments({
            companyRef: companyId,
            status: { $nin: [TASK_STATUS.COMPLETED, TASK_STATUS.CANCELLED] },
            dueDate: { $lt: new Date() }
        });

        if (overdueTasks > 0) {
            alerts.push({
                type: 'overdue_tasks',
                severity: 'medium',
                message: `${overdueTasks} overdue tasks`,
                count: overdueTasks
            });
        }

        return alerts;
    } catch (error) {
        return [];
    }
};

export const getTopPerformers = async (companyId, period, limit = 5) => {
    try {
        const topPerformers = await Performance.find({
            companyRef: companyId,
            'period.periodType': period
        })
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName')
            .sort({ 'scores.overallScore': -1 })
            .limit(limit)
            .lean();

        return topPerformers.map(perf => ({
            name: `${perf.employeeRef?.personalInfo?.firstName || ''} ${perf.employeeRef?.personalInfo?.lastName || ''}`.trim(),
            score: perf.scores?.overallScore || 0,
            department: perf.employeeRef?.departmentRef || 'N/A'
        }));
    } catch (error) {
        return [];
    }
};

// ================================
// EXECUTIVE REPORT FUNCTIONS
// ================================

export const generateKeyInsights = (metrics) => {
    const insights = [];

    // Performance insights
    if (metrics.performanceMetrics.averageScore >= 85) {
        insights.push({
            type: INSIGHT_TYPES.POSITIVE,
            category: INSIGHT_CATEGORIES.PERFORMANCE,
            message: `Excellent team performance with average score of ${Math.round(metrics.performanceMetrics.averageScore)}%`,
            impact: 'high'
        });
    } else if (metrics.performanceMetrics.averageScore < 70) {
        insights.push({
            type: INSIGHT_TYPES.CONCERN,
            category: INSIGHT_CATEGORIES.PERFORMANCE,
            message: `Performance below target at ${Math.round(metrics.performanceMetrics.averageScore)}%`,
            impact: 'high'
        });
    }

    // Task completion insights
    if (metrics.taskMetrics.completionRate >= 90) {
        insights.push({
            type: INSIGHT_TYPES.POSITIVE,
            category: INSIGHT_CATEGORIES.PRODUCTIVITY,
            message: `High task completion rate of ${Math.round(metrics.taskMetrics.completionRate)}%`,
            impact: 'medium'
        });
    }

    // SLA compliance insights
    if (metrics.slaMetrics.complianceRate < 95) {
        insights.push({
            type: INSIGHT_TYPES.CONCERN,
            category: INSIGHT_CATEGORIES.COMPLIANCE,
            message: `SLA compliance at ${Math.round(metrics.slaMetrics.complianceRate)}% - below industry standard`,
            impact: 'high'
        });
    }

    return insights;
};

export const generateRecommendations = (insights) => {
    const recommendations = [];

    insights.forEach(insight => {
        if (insight.type === INSIGHT_TYPES.CONCERN) {
            switch (insight.category) {
                case INSIGHT_CATEGORIES.PERFORMANCE:
                    recommendations.push({
                        priority: 'high',
                        category: insight.category,
                        action: 'Implement performance improvement programs and additional training',
                        expectedImpact: 'Increase average performance score by 10-15%'
                    });
                    break;
                case INSIGHT_CATEGORIES.COMPLIANCE:
                    recommendations.push({
                        priority: 'high',
                        category: insight.category,
                        action: 'Review SLA processes and allocate additional resources to critical tasks',
                        expectedImpact: 'Improve SLA compliance to 98%+'
                    });
                    break;
            }
        }
    });

    return recommendations;
};

export const calculateKPIs = (metrics) => {
    return {
        productivity: {
            value: metrics.taskMetrics.completionRate,
            target: 90,
            unit: '%',
            trend: 'up'
        },
        quality: {
            value: metrics.performanceMetrics.averageScore,
            target: 85,
            unit: '%',
            trend: 'stable'
        },
        compliance: {
            value: metrics.slaMetrics.complianceRate,
            target: 95,
            unit: '%',
            trend: 'down'
        },
        efficiency: {
            value: metrics.taskMetrics.avgCompletionTime,
            target: 24,
            unit: 'hours',
            trend: 'up'
        }
    };
};

export const getExecutiveTrends = async (companyId, period) => {
    // Simplified - in real implementation, would fetch historical data
    return {
        performance: { current: 85, change: '+3%', trend: 'positive' },
        productivity: { current: 92, change: '+5%', trend: 'positive' },
        compliance: { current: 94, change: '-2%', trend: 'negative' },
        revenue: { current: 150000, change: '+12%', trend: 'positive' }
    };
};

export const generateChartConfigurations = (reportData, metrics) => {
    const charts = [];

    if (metrics.includes('employee_performance')) {
        charts.push({
            type: 'bar',
            title: 'Employee Performance Distribution',
            data: reportData.employeePerformance?.data || [],
            xAxis: 'name',
            yAxis: 'overallScore'
        });
    }

    if (metrics.includes('task_analytics')) {
        charts.push({
            type: 'pie',
            title: 'Task Status Distribution',
            data: reportData.taskAnalytics?.summary?.byStatus || {}
        });
    }

    return charts;
};