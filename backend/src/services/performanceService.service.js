// backend/src/services/performanceService.service.js

import { ApiError } from "../utils/ApiError.js";
import { Performance } from "../models/performance/performance.model.js";
import { Employee } from "../models/core/employee.model.js";
import { ClaimTask } from '../models/workflow/claimtasks.model.js';
import { SLATracking } from '../models/performance/sla-tracking.model.js';
import {
    PERFORMANCE_RATINGS,
    PERFORMANCE_WEIGHTS,
    ROLE_BASED_WEIGHTS,
    PERFORMANCE_TARGETS,
    METRIC_SCORING_WEIGHTS,
    SLA_SCORE_BRACKETS,
    TIME_PERIODS,
    TASK_STATUS,
    METRIC_TYPES,
    DEFAULT_CONFIG
} from '../constants/performanceConstants.js';
import { getDateRange } from "../utils/dateUtils.js";
import {
    calculateProductivityMetrics,
    calculateQualityMetrics,
    calculateEfficiencyMetrics,
    calculateSLAMetrics,
    calculateVolumeMetrics,
    calculateAccuracyMetrics,
    calculateTimelinessMetrics,
    calculateOverallPerformanceScore
} from "./helpers/performanceCalculator.js";


// Calculates and PERSISTS the effective performance targets for an employee based on the SOW > SubDepartment > Employee hierarchy.
// This is the single source of truth for setting an employee's targets.
export const updateEffectiveTargetsForEmployee = async (employeeId) => {
    // 1. Fetch the employee and populate all necessary references
    const employee = await Employee.findById(employeeId)
        .populate({
            path: 'sowAssignments',
            populate: {
                path: 'sowRef',
                model: 'SOW'
            }
        })
        .populate('subdepartmentRef');

    if (!employee) {
        // Don't throw an error, just log it. A missing employee shouldn't crash an assignment.
        console.error(`Could not update targets: Employee not found with ID: ${employeeId}`);
        return null;
    }

    const newEffectiveTargets = {
        dailyClaimTarget: {},
        qualityTarget: {},
        slaTarget: {},
    };

    // HIERARCHY RULE 1: SOW (Highest Priority)
    const activeSOWAssignment = employee.sowAssignments.find(a => a.isActive);
    const activeSOW = activeSOWAssignment?.sowRef;

    if (activeSOW?.performanceTargets) {
        newEffectiveTargets.dailyClaimTarget = {
            value: activeSOW.performanceTargets.dailyTargetPerEmp,
            source: 'SOW',
            sourceRef: activeSOW._id
        };
        newEffectiveTargets.qualityTarget = {
            value: activeSOW.performanceTargets.qualityBenchmark,
            source: 'SOW',
            sourceRef: activeSOW._id
        };
    }

    // HIERARCHY RULE 2: SubDepartment (Fallback)
    if (!newEffectiveTargets.dailyClaimTarget.value && employee.subdepartmentRef?.performanceTargets) {
        newEffectiveTargets.dailyClaimTarget = {
            value: employee.subdepartmentRef.performanceTargets.dailyClaimTarget,
            source: 'SubDepartment',
            sourceRef: employee.subdepartmentRef._id
        };
        newEffectiveTargets.qualityTarget = {
            value: employee.subdepartmentRef.performanceTargets.qualityTarget,
            source: 'SubDepartment',
            sourceRef: employee.subdepartmentRef._id
        };
    }

    // HIERARCHY RULE 3: System Default (Lowest Priority / Final Fallback)
    if (!newEffectiveTargets.dailyClaimTarget.value) {
        newEffectiveTargets.dailyClaimTarget = {
            value: SYSTEM_DEFAULT_TARGETS.dailyClaimTarget,
            source: 'Employee',
            sourceRef: employee._id // No specific document reference for a system default
        };
    }
    if (!newEffectiveTargets.qualityTarget.value) {
        newEffectiveTargets.qualityTarget = {
            value: SYSTEM_DEFAULT_TARGETS.qualityTarget,
            source: 'Employee',
            sourceRef: employee._id
        };
    }

    // Persist the calculated targets to the employee document
    employee.effectiveTargets = {
        ...employee.effectiveTargets,
        ...newEffectiveTargets,
        lastUpdatedAt: new Date()
    };

    return await employee.save();
};

// Performance Metrics Calculation
export const calculatePerformanceMetrics = async (employeeId, period = TIME_PERIODS.CURRENT_MONTH, customTargets = null) => {
    try {
        // Find the employee and validate
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        // Get performance targets (employee-specific, role-based, or default)
        const targets = getPerformanceTargets(employee, customTargets);
        const weights = getPerformanceWeights(employee);

        const dateRange = getDateRange(period);

        // Get all claim tasks for the employee within the specified period
        const claimTasks = await ClaimTask.find({
            assignedEmployeeRef: employeeId,
            createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        });

        // Calculate all performance metrics
        const metrics = {
            [METRIC_TYPES.PRODUCTIVITY]: await calculateProductivityMetrics(claimTasks, dateRange, targets),
            [METRIC_TYPES.QUALITY]: await calculateQualityMetrics(claimTasks, targets),
            [METRIC_TYPES.EFFICIENCY]: await calculateEfficiencyMetrics(claimTasks, targets),
            [METRIC_TYPES.SLA]: await calculateSLAMetrics(employeeId, dateRange, targets),
            [METRIC_TYPES.VOLUME]: await calculateVolumeMetrics(claimTasks, targets),
            [METRIC_TYPES.ACCURACY]: await calculateAccuracyMetrics(claimTasks, targets),
            [METRIC_TYPES.TIMELINESS]: await calculateTimelinessMetrics(claimTasks, targets)
        };

        // Calculate overall performance score using weights
        const overallScore = calculateOverallPerformanceScore(metrics, weights);
        const overallRating = getPerformanceRating(overallScore);

        // Prepare performance data for storage
        const performanceData = {
            employeeRef: employeeId,
            companyRef: employee.companyRef,
            period: {
                periodType: period,
                from: dateRange.start,
                to: dateRange.end
            },
            metrics,
            scores: {
                overallScore,
                productivityScore: metrics.productivity.score,
                qualityScore: metrics.quality.score,
                efficiencyScore: metrics.efficiency.score,
                slaScore: metrics.sla.score,
                volumeScore: metrics.volume?.score || 0,
                // CORRECTED: Assign the actual calculated rate, not a non-existent score.
                accuracyScore: metrics.accuracy?.accuracyRate || 0,
                timelinessScore: metrics.timeliness?.timelinessRate || 0
            },
            ratings: {
                overallRating,
                productivityRating: metrics.productivity.rating,
                qualityRating: metrics.quality.rating,
                efficiencyRating: metrics.efficiency.rating,
                slaRating: metrics.sla.rating
            },
            targets,
            weights,
            calculatedAt: new Date()
        };

        // Update or create the performance record
        const performance = await Performance.findOneAndUpdate(
            {
                employeeRef: employeeId,
                'period.periodType': period,
                'period.from': dateRange.start,
                'period.to': dateRange.end
            },
            performanceData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return {
            performance,
            metrics,
            scores: performanceData.scores,
            ratings: performanceData.ratings,
            overallScore,
            overallRating,
            period: dateRange,
            targets,
            weights
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(500, "Failed to calculate performance metrics");
        }
    }
};

// Get Performance Rating
const getPerformanceRating = (score) => {
    for (const [key, rating] of Object.entries(PERFORMANCE_RATINGS)) {
        if (key === 'NOT_RATED') continue;
        if (score >= rating.minScore && score <= rating.maxScore) {
            return rating.label;
        }
    }
    return PERFORMANCE_RATINGS.NOT_RATED.label;
};

// Get Performance Targets for an Employee
const getPerformanceTargets = (employee, customTargets = null) => {
    if (customTargets) {
        return { ...PERFORMANCE_TARGETS, ...customTargets };
    }

    if (employee.performanceTargets) {
        return { ...PERFORMANCE_TARGETS, ...employee.performanceTargets };
    }

    return PERFORMANCE_TARGETS;
};

// Get Performance Weights based on Role
const getPerformanceWeights = (employee) => {
    const role = employee.employmentInfo?.jobTitle || employee.role;

    // Check if there's a role-specific weight configuration
    const roleKey = Object.keys(ROLE_BASED_WEIGHTS).find(key =>
        role && role.toUpperCase().includes(key.split('_')[0])
    );

    return roleKey ? ROLE_BASED_WEIGHTS[roleKey] : PERFORMANCE_WEIGHTS;
};

// Get Team Performance Comparison
export const getTeamPerformanceComparison = async (companyId, departmentId = null, period = TIME_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        // Build query
        const query = {
            companyRef: companyId,
            'period.periodType': period,
            'period.from': dateRange.start,
            'period.to': dateRange.end
        };

        if (departmentId) {
            // Get employees in department
            const employees = await Employee.find({
                companyRef: companyId,
                departmentRef: departmentId
            }).select('_id');

            query.employeeRef = { $in: employees.map(emp => emp._id) };
        }

        const performances = await Performance.find(query)
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName employmentInfo.employeeCode employmentInfo.jobTitle')
            .sort({ 'scores.overallScore': -1 });

        // Calculate team statistics
        const teamStats = calculateTeamStatistics(performances);

        return {
            teamStats,
            performances,
            period: dateRange,
            query: { companyId, departmentId, period }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get team performance comparison: ${error.message}`);
    }
};

// Calculate Team Statistics
const calculateTeamStatistics = (performances) => {
    const teamStats = {
        totalEmployees: performances.length,
        averageScore: 0,
        topPerformer: null,
        bottomPerformer: null,
        scoreDistribution: {
            excellent: 0,
            good: 0,
            satisfactory: 0,
            needsImprovement: 0,
            poor: 0
        },
        metricAverages: {
            productivity: 0,
            quality: 0,
            efficiency: 0,
            sla: 0
        }
    };

    if (performances.length === 0) {
        return teamStats;
    }

    // Calculate averages
    const totalScore = performances.reduce((sum, perf) => sum + perf.scores.overallScore, 0);
    teamStats.averageScore = Math.round(totalScore / performances.length);

    // Set top and bottom performers
    teamStats.topPerformer = performances[0];
    teamStats.bottomPerformer = performances[performances.length - 1];

    // Calculate metric averages
    const metricTotals = performances.reduce((totals, perf) => {
        totals.productivity += perf.scores.productivityScore || 0;
        totals.quality += perf.scores.qualityScore || 0;
        totals.efficiency += perf.scores.efficiencyScore || 0;
        totals.sla += perf.scores.slaScore || 0;
        return totals;
    }, { productivity: 0, quality: 0, efficiency: 0, sla: 0 });

    Object.keys(metricTotals).forEach(metric => {
        teamStats.metricAverages[metric] = Math.round(metricTotals[metric] / performances.length);
    });

    // Calculate score distribution
    performances.forEach(perf => {
        const rating = getPerformanceRating(perf.scores.overallScore);
        switch (rating) {
            case PERFORMANCE_RATINGS.EXCELLENT.label:
                teamStats.scoreDistribution.excellent++;
                break;
            case PERFORMANCE_RATINGS.GOOD.label:
                teamStats.scoreDistribution.good++;
                break;
            case PERFORMANCE_RATINGS.SATISFACTORY.label:
                teamStats.scoreDistribution.satisfactory++;
                break;
            case PERFORMANCE_RATINGS.NEEDS_IMPROVEMENT.label:
                teamStats.scoreDistribution.needsImprovement++;
                break;
            case PERFORMANCE_RATINGS.POOR.label:
                teamStats.scoreDistribution.poor++;
                break;
        }
    });

    return teamStats;
};

// Get Performance Trends for Employee
export const getPerformanceTrends = async (employeeId, months = DEFAULT_CONFIG.trendsMonths) => {
    try {
        const trends = [];
        const currentDate = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const performance = await Performance.findOne({
                employeeRef: employeeId,
                'period.from': startDate,
                'period.to': endDate
            });

            const monthData = {
                month: date.toISOString().substring(0, 7), // YYYY-MM format
                monthLabel: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                performance: performance || null,
                overallScore: performance?.scores?.overallScore || 0,
                overallRating: performance?.ratings?.overallRating || PERFORMANCE_RATINGS.NOT_RATED.label,
                scores: {
                    productivity: performance?.scores?.productivityScore || 0,
                    quality: performance?.scores?.qualityScore || 0,
                    efficiency: performance?.scores?.efficiencyScore || 0,
                    sla: performance?.scores?.slaScore || 0
                }
            };

            trends.push(monthData);
        }

        // Calculate trend analysis
        const trendAnalysis = calculateTrendAnalysis(trends);

        return {
            trends,
            months,
            analysis: trendAnalysis
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get performance trends: ${error.message}`);
    }
};

// Calculate Trend Analysis
const calculateTrendAnalysis = (trends) => {
    const validTrends = trends.filter(trend => trend.overallScore > 0);

    if (validTrends.length < 2) {
        return {
            direction: 'insufficient_data',
            change: 0,
            consistency: 'unknown'
        };
    }

    const scores = validTrends.map(trend => trend.overallScore);
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    const change = lastScore - firstScore;

    // Calculate trend direction
    let direction = 'stable';
    direction = change > 5 ? 'improving' : 'declining';

    // Calculate consistency (standard deviation)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    let consistency = 'consistent';
    if (standardDeviation > 15) {
        consistency = 'highly_inconsistent';
    } else if (standardDeviation > 10) {
        consistency = 'inconsistent';
    }

    return {
        direction,
        change: Math.round(change),
        consistency,
        averageScore: Math.round(mean),
        standardDeviation: Math.round(standardDeviation)
    };
}

// Get Performance Summary For Dashboard
export const getPerformanceSummary = async (employeeId, period = TIME_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        const performance = await Performance.findOne({
            employeeRef: employeeId,
            'period.periodType': period,
            'period.from': dateRange.start,
            'period.to': dateRange.end
        }).populate('employeeRef', 'personalInfo.firstName personalInfo.lastName employmentInfo.employeeCode');

        if (!performance) {
            // If no performance data exists, calculate it
            const calculatedPerformance = await calculatePerformanceMetrics(employeeId, period);
            return {
                ...calculatedPerformance,
                isNewlyCalculated: true
            };
        }

        return {
            performance,
            metrics: performance.metrics,
            scores: performance.scores,
            ratings: performance.ratings,
            overallScore: performance.scores.overallScore,
            overallRating: performance.ratings.overallRating,
            period: dateRange,
            isNewlyCalculated: false
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get performance summary: ${error.message}`);
    }
};

// Get Performance Insights and Recommendations
export const getPerformanceInsights = async (employeeId, period = TIME_PERIODS.CURRENT_MONTH) => {
    try {
        const performanceData = await getPerformanceSummary(employeeId, period);
        const trends = await getPerformanceTrends(employeeId, 3); // Last 3 months

        const insights = generatePerformanceInsights(performanceData, trends);
        const recommendations = generateRecommendations(performanceData.metrics);

        return {
            insights,
            recommendations,
            performanceData,
            trends: trends.trends
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get performance insights: ${error.message}`);
    }
};

// Generate Performance Insights
const generatePerformanceInsights = (performanceData, trends) => {
    const { scores, metrics } = performanceData;
    const insights = [];

    // Overall performance insight
    if (scores.overallScore >= 90) {
        insights.push({
            type: 'positive',
            category: 'overall',
            message: 'Exceptional overall performance! You\'re in the top tier.',
            score: scores.overallScore
        });
    } else if (scores.overallScore < 60) {
        insights.push({
            type: 'warning',
            category: 'overall',
            message: 'Overall performance needs significant improvement.',
            score: scores.overallScore
        });
    }

    // Trend insights
    if (trends.analysis.direction === 'improving') {
        insights.push({
            type: 'positive',
            category: 'trend',
            message: `Performance is trending upward with a ${trends.analysis.change} point improvement.`,
            change: trends.analysis.change
        });
    } else if (trends.analysis.direction === 'declining') {
        insights.push({
            type: 'warning',
            category: 'trend',
            message: `Performance is declining with a ${Math.abs(trends.analysis.change)} point decrease.`,
            change: trends.analysis.change
        });
    }

    // Metric-specific insights
    const metricInsights = generateMetricInsights(metrics, scores);
    insights.push(...metricInsights);

    return insights;
};

// Generate Metric-Specific Insights
const generateMetricInsights = (metrics, scores) => {
    const insights = [];

    // Productivity insights
    if (scores.productivityScore >= 90) {
        insights.push({
            type: 'positive',
            category: 'productivity',
            message: `Excellent productivity with ${metrics.productivity.tasksPerDay} tasks per day.`,
            value: metrics.productivity.tasksPerDay
        });
    } else if (metrics.productivity.completionRate < 80) {
        insights.push({
            type: 'warning',
            category: 'productivity',
            message: `Task completion rate is below target at ${metrics.productivity.completionRate}%.`,
            value: metrics.productivity.completionRate
        });
    }

    // Quality insights
    if (metrics.quality.accuracyRate >= 98) {
        insights.push({
            type: 'positive',
            category: 'quality',
            message: `Outstanding quality with ${metrics.quality.accuracyRate}% accuracy rate.`,
            value: metrics.quality.accuracyRate
        });
    } else if (metrics.quality.errorRate > 5) {
        insights.push({
            type: 'warning',
            category: 'quality',
            message: `Error rate is high at ${metrics.quality.errorRate}%. Focus on quality improvement.`,
            value: metrics.quality.errorRate
        });
    }

    // Efficiency insights
    if (metrics.efficiency.onTimeCompletionRate >= 95) {
        insights.push({
            type: 'positive',
            category: 'efficiency',
            message: `Excellent time management with ${metrics.efficiency.onTimeCompletionRate}% on-time completion.`,
            value: metrics.efficiency.onTimeCompletionRate
        });
    } else if (metrics.efficiency.averageCompletionTime > 4) {
        insights.push({
            type: 'warning',
            category: 'efficiency',
            message: `Average completion time is high at ${metrics.efficiency.averageCompletionTime} hours.`,
            value: metrics.efficiency.averageCompletionTime
        });
    }

    // SLA insights
    if (metrics.sla.slaComplianceRate >= 98) {
        insights.push({
            type: 'positive',
            category: 'sla',
            message: `Excellent SLA compliance at ${metrics.sla.slaComplianceRate}%.`,
            value: metrics.sla.slaComplianceRate
        });
    } else if (metrics.sla.breachedSLAs > 0) {
        insights.push({
            type: 'warning',
            category: 'sla',
            message: `${metrics.sla.breachedSLAs} SLA breaches detected. Review time management.`,
            value: metrics.sla.breachedSLAs
        });
    }

    return insights;
};

// Generate Performance Recommendations
const generateRecommendations = (metrics) => {
    const recommendations = [];

    // Productivity recommendations
    if (metrics.productivity.score < 70) {
        recommendations.push({
            category: 'productivity',
            priority: 'high',
            title: 'Improve Task Productivity',
            description: 'Focus on completing more tasks efficiently within the given timeframe.',
            actions: [
                'Set daily task targets and track progress',
                'Use time-blocking techniques for better focus',
                'Eliminate distractions during work hours',
                'Break down complex tasks into smaller chunks'
            ]
        });
    }

    // Quality recommendations
    if (metrics.quality.score < 70) {
        recommendations.push({
            category: 'quality',
            priority: 'high',
            title: 'Enhance Work Quality',
            description: 'Reduce errors and improve accuracy in task completion.',
            actions: [
                'Implement double-checking procedures',
                'Use quality checklists before submission',
                'Seek feedback from supervisors regularly',
                'Attend quality training sessions'
            ]
        });
    }

    // Efficiency recommendations
    if (metrics.efficiency.score < 70) {
        recommendations.push({
            category: 'efficiency',
            priority: 'medium',
            title: 'Boost Work Efficiency',
            description: 'Optimize workflow and reduce completion times.',
            actions: [
                'Streamline repetitive processes',
                'Learn keyboard shortcuts and tools',
                'Organize workspace for better productivity',
                'Plan work schedule more effectively'
            ]
        });
    }

    // SLA recommendations
    if (metrics.sla.score < 70) {
        recommendations.push({
            category: 'sla',
            priority: 'high',
            title: 'Improve SLA Compliance',
            description: 'Meet service level agreements consistently.',
            actions: [
                'Monitor deadlines more closely',
                'Prioritize high-priority tasks',
                'Communicate early about potential delays',
                'Create buffer time for unexpected issues'
            ]
        });
    }

    return recommendations;
};

// Compare Employee Performance Againt Team/Department Average
export const getPerformanceComparison = async (employeeId, companyId, departmentId = null, period = TIME_PERIODS.CURRENT_MONTH) => {
    try {
        // Get employee performance
        const employeePerformance = await getPerformanceSummary(employeeId, period);

        // Get team performance comparison
        const teamComparison = await getTeamPerformanceComparison(companyId, departmentId, period);

        // Calculate comparison metrics
        const comparison = calculatePerformanceComparison(employeePerformance, teamComparison.teamStats);

        return {
            employee: employeePerformance,
            team: teamComparison,
            comparison,
            period
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get performance comparison: ${error.message}`);
    }
};

// Calculate Performance Comparison Metrics
const calculatePerformanceComparison = (employeePerformance, teamStats) => {
    const empScore = employeePerformance.overallScore;
    const teamAverage = teamStats.averageScore;

    const difference = empScore - teamAverage;
    const percentageDiff = teamAverage > 0 ? ((difference / teamAverage) * 100) : 0;

    let comparison = 'average';
    let message = '';

    if (difference > 10) {
        comparison = 'above_average';
        message = `Performing ${Math.abs(Math.round(percentageDiff))}% above team average`;
    } else if (difference < -10) {
        comparison = 'below_average';
        message = `Performing ${Math.abs(Math.round(percentageDiff))}% below team average`;
    } else {
        message = 'Performing at team average level';
    }

    return {
        status: comparison,
        difference: Math.round(difference),
        percentageDifference: Math.round(percentageDiff),
        message,
        employeeScore: empScore,
        teamAverage: Math.round(teamAverage)
    };
};

// Bulk Calculate Performance For Multiple Employees
export const bulkCalculatePerformance = async (employeeIds, period = TIME_PERIODS.CURRENT_MONTH, customTargets = null) => {
    try {
        const results = [];
        const errors = [];

        for (const employeeId of employeeIds) {
            try {
                const performance = await calculatePerformanceMetrics(employeeId, period, customTargets);
                results.push({
                    employeeId,
                    success: true,
                    performance
                });
            } catch (error) {
                errors.push({
                    employeeId,
                    success: false,
                    error: error.message
                });
            }
        }

        return {
            success: results,
            errors,
            totalProcessed: employeeIds.length,
            successCount: results.length,
            errorCount: errors.length
        };

    } catch (error) {
        throw new ApiError(500, `Failed to bulk calculate performance: ${error.message}`);
    }
};

// Get Performance Leaderboard
export const getPerformanceLeaderboard = async (companyId, period = TIME_PERIODS.CURRENT_MONTH, limit = 10) => {
    try {
        const dateRange = getDateRange(period);

        const leaderboard = await Performance.find({
            companyRef: companyId,
            'period.periodType': period,
            'period.from': dateRange.start,
            'period.to': dateRange.end
        })
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName employmentInfo.employeeCode employmentInfo.jobTitle')
            .sort({ 'scores.overallScore': -1 })
            .limit(limit);

        const leaderboardWithRanks = leaderboard.map((performance, index) => ({
            rank: index + 1,
            employee: performance.employeeRef,
            overallScore: performance.scores.overallScore,
            overallRating: performance.ratings.overallRating,
            scores: performance.scores,
            performance
        }));

        return {
            leaderboard: leaderboardWithRanks,
            period: dateRange,
            totalEntries: leaderboard.length
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get performance leaderboard: ${error.message}`);
    }
};

// Get Performance Statistics for a Company
export const getCompanyPerformanceStats = async (companyId, period = TIME_PERIODS.CURRENT_MONTH) => {
    try {
        const dateRange = getDateRange(period);

        const performances = await Performance.find({
            companyRef: companyId,
            'period.periodType': period,
            'period.from': dateRange.start,
            'period.to': dateRange.end
        });

        if (performances.length === 0) {
            return {
                totalEmployees: 0,
                averageScore: 0,
                distribution: {},
                metricAverages: {},
                period: dateRange
            };
        }

        // Calculate statistics
        const stats = {
            totalEmployees: performances.length,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 100,
            distribution: {
                excellent: 0,
                good: 0,
                satisfactory: 0,
                needsImprovement: 0,
                poor: 0
            },
            metricAverages: {
                productivity: 0,
                quality: 0,
                efficiency: 0,
                sla: 0
            },
            period: dateRange
        };

        // Calculate totals
        const totals = performances.reduce((acc, perf) => {
            const score = perf.scores.overallScore;
            acc.totalScore += score;
            acc.productivity += perf.scores.productivityScore || 0;
            acc.quality += perf.scores.qualityScore || 0;
            acc.efficiency += perf.scores.efficiencyScore || 0;
            acc.sla += perf.scores.slaScore || 0;

            // Track highest and lowest scores
            if (score > stats.highestScore) stats.highestScore = score;
            if (score < stats.lowestScore) stats.lowestScore = score;

            // Count distribution
            const rating = getPerformanceRating(score);
            switch (rating) {
                case PERFORMANCE_RATINGS.EXCELLENT.label:
                    stats.distribution.excellent++;
                    break;
                case PERFORMANCE_RATINGS.GOOD.label:
                    stats.distribution.good++;
                    break;
                case PERFORMANCE_RATINGS.SATISFACTORY.label:
                    stats.distribution.satisfactory++;
                    break;
                case PERFORMANCE_RATINGS.NEEDS_IMPROVEMENT.label:
                    stats.distribution.needsImprovement++;
                    break;
                case PERFORMANCE_RATINGS.POOR.label:
                    stats.distribution.poor++;
                    break;
            }

            return acc;
        }, {
            totalScore: 0,
            productivity: 0,
            quality: 0,
            efficiency: 0,
            sla: 0
        });

        // Calculate averages
        stats.averageScore = Math.round(totals.totalScore / performances.length);
        stats.metricAverages.productivity = Math.round(totals.productivity / performances.length);
        stats.metricAverages.quality = Math.round(totals.quality / performances.length);
        stats.metricAverages.efficiency = Math.round(totals.efficiency / performances.length);
        stats.metricAverages.sla = Math.round(totals.sla / performances.length);

        return stats;

    } catch (error) {
        throw new ApiError(500, `Failed to get company performance stats: ${error.message}`);
    }
};