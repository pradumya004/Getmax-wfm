// backend/src/services/slaService.service.js

import { ApiError } from '../utils/ApiError.js';
import { SLATracking } from '../models/performance/sla-tracking.model.js';
import { ClaimTask } from '../models/claimtasks.model.js';
import { Employee } from '../models/employee.model.js';
import { Client } from '../models/client.model.js';
import { createNotification } from './notificationService.js';
import { sendEmail } from './emailService.js';
import { getDateRange } from '../utils/date.utils.js'
import {
    SLA_TYPES,
    SLA_STATUS,
    SLA_PRIORITIES,
    DEFAULT_SLA_TARGETS,
    PRIORITY_TARGET_MAP,
    SLA_ALERT_TYPES,
    SLA_ALERT_THRESHOLDS,
    SLA_ALERT_CONFIG,
    SLA_TIME_PERIODS,
    SLA_COMPLIANCE_TYPES,
    SLA_RESOLUTION_TYPES,
    SLA_ERROR_MESSAGES,
    SLA_DEFAULTS
} from '../constants/slaConstants.js';

// Create SLA Tracking
export const createSLATracking = async (slaData) => {
    try {
        const {
            companyRef,
            clientRef,
            sowRef,              // Added required field
            claimRef,            // Corrected reference name
            assignedEmployeeRef, // Corrected reference name
            slaType,
            priority = SLA_DEFAULTS.PRIORITY, // This will be used by calculateSLATarget
            targetTime,          // This is the target in hours
            description,
            startTime = new Date(),
            triggeredBy,         // For the audit trail
            triggerEvent = 'Manual Start'
        } = slaData;

        // Validate that all required references are present.
        if (!companyRef || !clientRef || !sowRef || !claimRef || !slaType) {
            throw new ApiError(400, "Company, Client, SOW, Claim, and SLA Type are required fields.");
        }

        const targetHours = targetTime || calculateSLATarget(slaType, priority);
        const dueDateTime = new Date(startTime.getTime() + (targetHours * 60 * 60 * 1000));

        const newSLA = {
            companyRef,
            clientRef,
            sowRef,
            claimRef,
            assignedEmployeeRef,

            // Correctly map to the 'slaConfig' object
            slaConfig: {
                slaType,
                slaDescription: description || `${slaType} SLA for claim`,
                targetHours,
            },

            // Correctly map to the 'triggerInfo' object
            triggerInfo: {
                triggerEvent,
                triggeredBy: triggeredBy || null,
            },

            // Correctly map to the 'timerInfo' object
            timerInfo: {
                startDateTime: startTime,
                dueDateTime,
                timeRemaining: targetHours,
            },

            // Correctly map to the 'statusInfo' object
            statusInfo: {
                currentStatus: 'Active', // SLAs should start as Active.
                statusHistory: [{
                    status: 'Active',
                    changedAt: new Date(),
                    changedBy: triggeredBy,
                    reason: 'SLA Created',
                    systemGenerated: true
                }]
            },

            // Populate audit info
            auditInfo: {
                createdBy: triggeredBy
            }
        };

        const slaTracking = await SLATracking.create(newSLA);
        return slaTracking;

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `${SLA_ERROR_MESSAGES.CREATE_FAILED}: ${error.message}`);
    }
};

// Calculate SLA Target
const calculateSLATarget = (slaType, priority, customTargets = {}) => {
    if (customTargets[slaType]) {
        return customTargets[slaType];
    }

    const priorityLevel = PRIORITY_TARGET_MAP[priority] || 'STANDARD_CLAIMS';
    const targets = DEFAULT_SLA_TARGETS[priorityLevel];

    switch (slaType) {
        case SLA_TYPES.TASK_COMPLETION:
            return targets.completion;
        case SLA_TYPES.RESPONSE_TIME:
            return targets.response;
        case SLA_TYPES.RESOLUTION_TIME:
            return targets.resolution;
        default:
            return targets.completion;
    }
};

// Update SLA Status
export const updateSLAStatus = async (slaId, updateData) => {
    try {
        const sla = await SLATracking.findById(slaId);
        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        const {
            status,
            changedBy, // The user performing the action
            reason,
            notes
        } = updateData;

        if (!status) {
            throw new ApiError(400, "A new status is required to update the SLA.");
        }
        if (!changedBy) {
            throw new ApiError(400, "User ID ('changedBy') is required to update SLA status.");
        }

        switch (status) {
            case SLA_STATUS.COMPLETED:
                sla.complete(changedBy, notes || 'SLA marked as complete.');
                break;

            case SLA_STATUS.PAUSED:
            case SLA_STATUS.ON_HOLD:
                if (!reason) {
                    throw new ApiError(400, `A reason is required to set status to ${status}.`);
                }
                // Both PAUSED and ON_HOLD will use the model's pause logic.
                sla.pause(changedBy, reason, notes);
                break;

            case SLA_STATUS.ACTIVE:
                // This case is now specifically for resuming a paused or on-hold SLA.
                if (sla.statusInfo.currentStatus === SLA_STATUS.PAUSED || sla.statusInfo.currentStatus === SLA_STATUS.ON_HOLD) {
                    sla.resume(changedBy, notes || 'SLA resumed.');
                }
                // If it's already active, no action is needed.
                break;

            case SLA_STATUS.CANCELLED:
                sla.updateStatus(SLA_STATUS.CANCELLED, changedBy, reason || 'SLA Cancelled', notes);
                break;

            case SLA_STATUS.EXPIRED:
                // Setting status to 'Breached' is the correct action for an expired SLA.
                // The model's pre-save hook will automatically handle the full breach logic.
                sla.updateStatus('Breached', changedBy, reason || 'SLA Expired', notes);
                break;

            default:
                // For other simple status changes that don't have special logic (e.g., 'At Risk').
                sla.updateStatus(status, changedBy, reason, notes);
                break;
        }

        // Save the updated document. The model's pre-save middleware will handle recalculations.
        await sla.save();
        return sla;

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `${SLA_ERROR_MESSAGES.UPDATE_FAILED}: ${error.message}`);
    }
};

// Monitors all active SLAs.
// This function finds all SLAs that are currently 'Active' or 'At Risk' and re-saves them. The magic happens in the model's pre-save hook, which automatically recalculates time remaining, checks if thresholds have been crossed (for 'At Risk' status or alerts), and handles any breaches. This keeps the service layer clean and ensures the model's logic is the single source of truth.
export const monitorSLAs = async (companyId = null) => {
    try {
        const query = {
            'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] },
            'systemInfo.isActive': true
        };

        if (companyId) {
            query.companyRef = companyId;
        }

        const activeSLAs = await SLATracking.find(query)
            .populate('assignedEmployeeRef', 'personalInfo.firstName contactInfo.primaryEmail')
            .populate('claimRef', 'claimId');

        let updated = 0;
        let warningsIssued = 0;
        let criticalAlertsIssued = 0;
        let breachesDetected = 0;

        for (const sla of activeSLAs) {
            // Store the state *before* saving to accurately track what changed.
            const wasAtRisk = sla.statusInfo.currentStatus === 'At Risk';
            const wasCriticalAlertSent = sla.notificationInfo.criticalAlertSent;
            const wasBreached = sla.breachInfo.isBreached;

            // By simply calling .save(), we trigger the powerful pre-save middleware
            // on the model, which handles all complex calculations and status updates.
            await sla.save();
            updated++;

            // Now, check the state *after* saving to see what actions were taken by the model.
            if (sla.statusInfo.currentStatus === 'At Risk' && !wasAtRisk) {
                warningsIssued++;
            }
            if (sla.notificationInfo.criticalAlertSent && !wasCriticalAlertSent) {
                criticalAlertsIssued++;
            }
            if (sla.breachInfo.isBreached && !wasBreached) {
                breachesDetected++;

                if (sla.assignedEmployeeRef) {
                    await createNotification({
                        companyRef: sla.companyRef,
                        recipients: [{ type: 'Employee', id: sla.assignedEmployeeRef._id }],
                        title: `🚨 SLA Breach: Claim ${sla.claimRef?.claimId || 'N/A'}`,
                        message: `The SLA for '${sla.slaConfig.slaType}' has been breached.`,
                        type: 'error',
                        category: 'SLA',
                        priority: 'High',
                        actionUrl: `/slas/${sla._id}` // Example URL
                    });
                }
            }
        }

        return {
            checked: activeSLAs.length,
            updated,
            warningsIssued,
            criticalAlertsIssued,
            breachesDetected
        };

    } catch (error) {
        throw new ApiError(500, `${SLA_ERROR_MESSAGES.MONITOR_FAILED}: ${error.message}`);
    }
};

// Get SLA Statistics
export const getSLAStatistics = async (companyId, period = SLA_TIME_PERIODS.CURRENT_MONTH, filters = {}) => {
    try {
        const dateRange = getDateRange(period);
        const matchQuery = buildStatisticsQuery(companyId, dateRange, filters);

        const stats = await SLATracking.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalSLAs: { $sum: 1 },
                    completedSLAs: {
                        $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.COMPLETED] }, 1, 0] }
                    },
                    breachedSLAs: {
                        $sum: { $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0] }
                    },
                    activeSLAs: {
                        $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.ACTIVE] }, 1, 0] }
                    },
                    cancelledSLAs: {
                        $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.CANCELLED] }, 1, 0] }
                    },
                    avgCompletionTime: {
                        $avg: '$timerInfo.totalElapsedHours'
                    },
                    avgTargetTime: { $avg: '$slaConfig.targetHours' },
                    totalBreachDuration: {
                        $sum: '$breachInfo.breachDurationHours'
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalSLAs: 0,
            completedSLAs: 0,
            breachedSLAs: 0,
            activeSLAs: 0,
            cancelledSLAs: 0,
            avgCompletionTime: 0,
            avgTargetTime: 0,
            totalBreachDuration: 0
        };

        const complianceRate = result.completedSLAs > 0
            ? ((result.completedSLAs - result.breachedSLAs) / result.completedSLAs) * 100
            : 100;

        const breachRate = result.totalSLAs > 0
            ? (result.breachedSLAs / result.totalSLAs) * 100
            : 0;

        const typeBreakdown = await getSLABreakdownByType(matchQuery);
        const statusBreakdown = await getSLABreakdownByStatus(matchQuery);
        const trendData = await getSLATrends(companyId, 7);

        return {
            summary: {
                ...result,
                complianceRate: Math.round(complianceRate * 100) / 100,
                breachRate: Math.round(breachRate * 100) / 100,
                avgBreachDuration: result.breachedSLAs > 0 ? result.totalBreachDuration / result.breachedSLAs : 0
            },
            breakdown: {
                byType: typeBreakdown,
                byStatus: statusBreakdown
            },
            trends: trendData,
            period: {
                ...dateRange,
                label: period
            }
        };
    } catch (error) {
        throw new ApiError(500, `${SLA_ERROR_MESSAGES.STATS_FAILED}: ${error.message}`);
    }
};

// Build Statistics Query
const buildStatisticsQuery = (companyId, dateRange, filters) => {
    const matchQuery = {
        companyRef: companyId,
        'timerInfo.startDateTime': { $gte: dateRange.start, $lte: dateRange.end }
    };

    if (filters.employeeId) matchQuery.assignedEmployeeRef = filters.employeeId;
    if (filters.clientId) matchQuery.clientRef = filters.clientId;
    if (filters.slaType) matchQuery['slaConfig.slaType'] = filters.slaType;
    if (filters.status) matchQuery['statusInfo.currentStatus'] = filters.status;

    // Note: Filtering by 'priority' has been removed as it is not a stored field in the sla-tracking model.
    // Priority is used to calculate the initial target time but is not saved directly.

    return matchQuery;
};

// Get SLA Breakdown by Type
const getSLABreakdownByType = async (matchQuery) => {
    return await SLATracking.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$slaConfig.slaType',
                count: { $sum: 1 },
                breached: { $sum: { $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0] } },
                completed: { $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.COMPLETED] }, 1, 0] } },
                avgCompletionTime: { $avg: '$timerInfo.totalElapsedHours' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// Get SLA Breakdown by Status
const getSLABreakdownByStatus = async (matchQuery) => {
    return await SLATracking.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$statusInfo.currentStatus',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// Get SLA Trends
const getSLATrends = async (companyId, days = 7) => {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const dayStats = await SLATracking.aggregate([
            {
                $match: {
                    companyRef: companyId,
                    'timerInfo.startDateTime': { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    breached: { $sum: { $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.COMPLETED] }, 1, 0] } },
                    active: { $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.ACTIVE] }, 1, 0] } }
                }
            }
        ]);

        const stats = dayStats[0] || { total: 0, breached: 0, completed: 0, active: 0 };
        const complianceRate = stats.completed > 0 ? ((stats.completed - stats.breached) / stats.completed) * 100 : 100;

        trends.push({
            date: startOfDay.toISOString().split('T')[0],
            total: stats.total,
            breached: stats.breached,
            completed: stats.completed,
            active: stats.active,
            complianceRate: Math.round(complianceRate * 100) / 100
        });
    }

    return trends;
};

// Auto-create SLA for Task
export const autoCreateSLAForTask = async (taskId) => {
    try {
        const task = await ClaimTask.findById(taskId);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const existingSLA = await SLATracking.findOne({ claimTaskRef: taskId });
        if (existingSLA) {
            return existingSLA;
        }

        const slaData = {
            companyRef: task.companyRef,
            clientRef: task.clientRef,
            employeeRef: task.assignedTo,
            claimTaskRef: taskId,
            slaType: SLA_TYPES.TASK_COMPLETION,
            priority: task.priority || SLA_DEFAULTS.PRIORITY,
            description: `Task completion SLA for ${task.claimType} claim`,
            startTime: task.timeTracking?.assignedAt || new Date()
        };

        return await createSLATracking(slaData);

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `${SLA_ERROR_MESSAGES.AUTO_CREATE_FAILED}: ${error.message}`);
    }
};

// Get SLA by ID
export const getSLAById = async (slaId) => {
    try {
        const sla = await SLATracking.findById(slaId)
            .populate('employeeRef', 'personalInfo contactInfo')
            .populate('clientRef', 'companyInformation')
            .populate('claimTaskRef', 'claimNumber claimType priority status');

        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        return sla;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to get SLA: ${error.message}`);
    }
};

// Get SLAs with pagination and filters
export const getSLAs = async (companyId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            filters = {},
            populate = true
        } = options;

        const query = { companyRef: companyId };

        // Filter Paths
        if (filters.status) query['statusInfo.currentStatus'] = filters.status;
        if (filters.slaType) query['slaConfig.slaType'] = filters.slaType;
        if (filters.employeeId) query.assignedEmployeeRef = filters.employeeId;
        if (filters.clientId) query.clientRef = filters.clientId;
        if (filters.isBreached !== undefined) query['breachInfo.isBreached'] = filters.isBreached;

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        let queryBuilder = SLATracking.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        if (populate) {
            queryBuilder = queryBuilder
                .populate('assignedEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
                .populate('clientRef', 'clientInfo.clientName')
                .populate('claimRef', 'claimId');
        }

        const slas = await queryBuilder;
        const total = await SLATracking.countDocuments(query);

        return {
            slas,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    } catch (error) {
        throw new ApiError(500, `Failed to get SLAs: ${error.message}`);
    }
};

// Delete SLA
export const deleteSLA = async (slaId) => {
    try {
        const sla = await SLATracking.findById(slaId);
        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        await SLATracking.findByIdAndDelete(slaId);
        return { message: 'SLA deleted successfully' };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to delete SLA: ${error.message}`);
    }
};

// Bulk update SLAs
export const bulkUpdateSLAs = async (companyId, updates) => {
    try {
        const { slaIds, updateData } = updates;

        const result = await SLATracking.updateMany(
            {
                _id: { $in: slaIds },
                companyRef: companyId
            },
            { $set: updateData }
        );

        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            message: `${result.modifiedCount} SLAs updated successfully`
        };
    } catch (error) {
        throw new ApiError(500, `Failed to bulk update SLAs: ${error.message}`);
    }
};

// Get upcoming SLA deadlines
export const getUpcomingSLADeadlines = async (companyId, hoursAhead = 24) => {
    try {
        const now = new Date();
        const futureTime = new Date(now.getTime() + (hoursAhead * 60 * 60 * 1000));

        const upcomingDeadlines = await SLATracking.find({
            companyRef: companyId,
            'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] },
            'timerInfo.dueDateTime': { $gte: now, $lte: futureTime },
            'breachInfo.isBreached': false
        })
            .populate('assignedEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
            .populate('clientRef', 'clientInfo.clientName')
            .populate('claimRef', 'claimId')
            .sort({ 'timerInfo.dueDateTime': 1 });

        return upcomingDeadlines.map(sla => {
            const hoursRemaining = (sla.timerInfo.dueDateTime - now) / (1000 * 60 * 60);
            return {
                ...sla.toObject(),
                hoursRemaining: Math.max(0, hoursRemaining)
            };
        });
    } catch (error) {
        throw new ApiError(500, `Failed to get upcoming deadlines: ${error.message}`);
    }
};

// Get SLA performance by employee
export const getSLAPerformanceByEmployee = async (companyId, period = SLA_TIME_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        const performance = await SLATracking.aggregate([
            {
                $match: {
                    companyRef: companyId,
                    'timerInfo.startDateTime': { $gte: dateRange.start, $lte: dateRange.end },
                    assignedEmployeeRef: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$assignedEmployeeRef',
                    totalSLAs: { $sum: 1 },
                    completedSLAs: {
                        $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', SLA_STATUS.COMPLETED] }, 1, 0] }
                    },
                    breachedSLAs: {
                        $sum: { $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0] }
                    },
                    avgCompletionTime: {
                        $avg: '$timerInfo.totalElapsedHours'
                    },
                    avgTargetTime: { $avg: '$slaConfig.targetHours' }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $addFields: {
                    complianceRate: {
                        $cond: [
                            { $gt: ['$completedSLAs', 0] },
                            { $multiply: [{ $divide: [{ $subtract: ['$completedSLAs', '$breachedSLAs'] }, '$completedSLAs'] }, 100] },
                            100
                        ]
                    },
                    employeeName: { $concat: ['$employee.personalInfo.firstName', ' ', '$employee.personalInfo.lastName'] }
                }
            },
            {
                $project: {
                    employee: 0 // Exclude the full employee object to keep the payload clean
                }
            },
            {
                $sort: { complianceRate: -1 }
            }
        ]);

        return performance;
    } catch (error) {
        throw new ApiError(500, `Failed to get employee performance: ${error.message}`);
    }
};

// Get SLA dashboard summary
export const getSLADashboardSummary = async (companyId) => {
    try {
        const now = new Date();
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const tomorrow = new Date(new Date(today).setDate(today.getDate() + 1));
        const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get active SLAs
        const activeSLAs = await SLATracking.countDocuments({
            companyRef: companyId,
            'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] }
        });

        // Get breached SLAs
        const breachedSLAs = await SLATracking.countDocuments({
            companyRef: companyId,
            'breachInfo.isBreached': true
        });

        // Get SLAs due today
        const dueTodaySLAs = await SLATracking.countDocuments({
            companyRef: companyId,
            'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] },
            'timerInfo.dueDateTime': { $gte: today, $lt: tomorrow }
        });

        // Get critical alerts (at risk)
        const criticalSLAs = await SLATracking.countDocuments({
            companyRef: companyId,
            'statusInfo.currentStatus': 'At Risk',
            'breachInfo.isBreached': false
        });

        // Get recent completions (last 24 hours)
        const recentCompletions = await SLATracking.countDocuments({
            companyRef: companyId,
            'statusInfo.currentStatus': SLA_STATUS.COMPLETED,
            'timerInfo.actualCompletionDateTime': { $gte: yesterday }
        });

        // Get this month's compliance rate
        const monthStats = await SLATracking.aggregate([
            {
                $match: {
                    companyRef: companyId,
                    'timerInfo.startDateTime': { $gte: monthStart },
                    'statusInfo.currentStatus': SLA_STATUS.COMPLETED
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    breached: { $sum: { $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0] } }
                }
            }
        ]);

        const monthlyComplianceRate = monthStats[0]
            ? ((monthStats[0].total - monthStats[0].breached) / monthStats[0].total) * 100
            : 100;

        return {
            activeSLAs,
            breachedSLAs,
            dueTodaySLAs,
            criticalSLAs,
            recentCompletions,
            monthlyComplianceRate: Math.round(monthlyComplianceRate * 100) / 100,
            lastUpdated: new Date()
        };
    } catch (error) {
        throw new ApiError(500, `Failed to get dashboard summary: ${error.message}`);
    }
};

// Escalate SLA
export const escalateSLA = async (slaId, escalationData) => {
    try {
        const { escalatedTo, escalationReason, escalatedBy } = escalationData;

        const sla = await SLATracking.findById(slaId);
        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        const updateFields = {
            'escalation.isEscalated': true,
            'escalation.escalatedAt': new Date(),
            'escalation.escalatedTo': escalatedTo,
            'escalation.escalatedBy': escalatedBy,
            'escalation.escalationReason': escalationReason,
            'resolution.resolutionType': SLA_RESOLUTION_TYPES.ESCALATED
        };

        const updatedSLA = await SLATracking.findByIdAndUpdate(
            slaId,
            { $set: updateFields },
            { new: true }
        );

        // Create escalation notification
        await createNotification({
            companyRef: sla.companyRef,
            recipients: [{ type: 'Employee', id: escalatedTo }],
            title: '⬆️ SLA Escalated to You',
            message: `SLA for ${sla.slaInfo.slaType} has been escalated to you. Reason: ${escalationReason}`,
            type: 'warning',
            category: 'SLA',
            priority: 'High',
            actionRequired: true,
            actionUrl: `/sla/${slaId}`,
            actionText: 'View SLA',
            sendEmail: true,
            createdBy: escalatedBy
        });

        return updatedSLA;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to escalate SLA: ${error.message}`);
    }
};

// Add SLA exception
export const addSLAException = async (slaId, exceptionData) => {
    try {
        const { reason, grantedBy, additionalTime, notes } = exceptionData;

        const sla = await SLATracking.findById(slaId);
        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        const newDueDate = new Date(sla.slaInfo.dueDate.getTime() + (additionalTime * 60 * 60 * 1000));
        const newTargetTime = sla.slaInfo.targetTimeHours + additionalTime;

        const updateFields = {
            'slaInfo.dueDate': newDueDate,
            'slaInfo.targetTimeHours': newTargetTime,
            'exception.hasException': true,
            'exception.grantedAt': new Date(),
            'exception.grantedBy': grantedBy,
            'exception.reason': reason,
            'exception.additionalTimeHours': additionalTime,
            'exception.notes': notes,
            'resolution.resolutionType': SLA_RESOLUTION_TYPES.EXCEPTION_GRANTED
        };

        const updatedSLA = await SLATracking.findByIdAndUpdate(
            slaId,
            { $set: updateFields },
            { new: true }
        );

        return updatedSLA;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to add SLA exception: ${error.message}`);
    }
};

// Get SLA audit trail
export const getSLAAuditTrail = async (slaId) => {
    try {
        const sla = await SLATracking.findById(slaId)
            .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName')
            .populate('statusHistory.changedBy', 'personalInfo.firstName personalInfo.lastName')
            .populate('pauseHistory.pausedBy', 'personalInfo.firstName personalInfo.lastName')
            .populate('pauseHistory.resumedBy', 'personalInfo.firstName personalInfo.lastName');

        if (!sla) {
            throw new ApiError(404, SLA_ERROR_MESSAGES.NOT_FOUND);
        }

        const auditTrail = [];

        // Use the rich statusHistory array as the primary source of truth for events.
        for (const event of sla.statusInfo.statusHistory) {
            auditTrail.push({
                timestamp: event.changedAt,
                action: `Status changed to ${event.status}`,
                details: event.reason || 'No reason provided.',
                notes: event.notes || '',
                actor: event.changedBy ? event.changedBy.fullName : (event.systemGenerated ? 'System' : 'Unknown')
            });
        }

        // Add detailed pause/resume events from the pauseHistory array.
        for (const event of sla.timerInfo.pauseHistory) {
            auditTrail.push({
                timestamp: event.pausedAt,
                action: 'SLA Paused',
                details: `Reason: ${event.pauseReason}`,
                notes: event.pauseNotes || '',
                actor: event.pausedBy ? event.pausedBy.fullName : 'Unknown'
            });
            if (event.resumedAt) {
                auditTrail.push({
                    timestamp: event.resumedAt,
                    action: 'SLA Resumed',
                    details: `Pause duration: ${event.pauseDurationHours.toFixed(2)} hours`,
                    notes: event.resumeNotes || '',
                    actor: event.resumedBy ? event.resumedBy.fullName : 'Unknown'
                });
            }
        }

        // Sort all events chronologically.
        auditTrail.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return auditTrail;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to get audit trail: ${error.message}`);
    }
};

// Validate SLA data
export const validateSLAData = (slaData) => {
    const errors = [];

    if (!slaData.companyRef) {
        errors.push('Company reference is required');
    }

    if (!slaData.slaType || !Object.values(SLA_TYPES).includes(slaData.slaType)) {
        errors.push('Valid SLA type is required');
    }

    if (slaData.priority && !Object.values(SLA_PRIORITIES).includes(slaData.priority)) {
        errors.push('Valid priority is required');
    }

    if (slaData.targetTime && (slaData.targetTime < 0.5 || slaData.targetTime > 720)) {
        errors.push('Target time must be between 0.5 and 720 hours');
    }

    if (slaData.startTime && new Date(slaData.startTime) > new Date()) {
        errors.push('Start time cannot be in the future');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};