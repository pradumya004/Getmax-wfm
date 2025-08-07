// backend/src/services/helpers/performanceCalculator.js

import {
    PERFORMANCE_RATINGS,
    METRIC_SCORING_WEIGHTS,
    SLA_SCORE_BRACKETS,
    TASK_STATUS
} from '../../constants/performanceConstants.js';
import { SLATracking } from '../../models/performance/sla-tracking.model.js';
import { ApiError } from '../../utils/ApiError.js';

// Calculate Productivity Metrics
export const calculateProductivityMetrics = async (claimTasks, dateRange, targets) => {
    const completedTasks = claimTasks.filter(task => task.status === TASK_STATUS.COMPLETED);
    const totalTasks = claimTasks.length;
    const workingDays = calculateWorkingDays(dateRange.start, dateRange.end);

    const tasksPerDay = workingDays > 0 ? totalTasks / workingDays : 0;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
    const avgTimePerTask = calculateAverageTaskTime(completedTasks);

    // Calculate productivity score using targets and weights
    let score = 0;
    const weights = METRIC_SCORING_WEIGHTS.PRODUCTIVITY;

    // Tasks per day score
    const tasksPerDayScore = Math.min(100, (tasksPerDay / targets.PRODUCTIVITY.TASKS_PER_DAY) * 100);
    score += (tasksPerDayScore / 100) * weights.tasksPerDay;

    // Completion rate score
    const completionRateScore = Math.min(100, (completionRate / targets.PRODUCTIVITY.COMPLETION_RATE) * 100);
    score += (completionRateScore / 100) * weights.completionRate;

    // Average time per task score (inverse relationship)
    const timeScore = avgTimePerTask <= targets.PRODUCTIVITY.AVG_TIME_PER_TASK
        ? 100
        : Math.max(0, 100 - ((avgTimePerTask - targets.PRODUCTIVITY.AVG_TIME_PER_TASK) / targets.PRODUCTIVITY.AVG_TIME_PER_TASK) * 50);
    score += (timeScore / 100) * weights.avgTimePerTask;

    const finalScore = Math.round(score);
    const rating = getPerformanceRating(finalScore);

    return {
        totalTasks,
        completedTasks: completedTasks.length,
        tasksPerDay: Math.round(tasksPerDay * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        avgTimePerTask: Math.round(avgTimePerTask),
        workingDays,
        score: finalScore,
        rating,
        targets: targets.PRODUCTIVITY,
        breakdown: {
            tasksPerDayScore: Math.round(tasksPerDayScore),
            completionRateScore: Math.round(completionRateScore),
            timeScore: Math.round(timeScore)
        }
    };
};

// Calculate Quality Metrics
export const calculateQualityMetrics = async (claimTasks, targets) => {
    const completedTasks = claimTasks.filter(task => task.status === TASK_STATUS.COMPLETED);

    if (completedTasks.length === 0) {
        return {
            accuracyRate: 0,
            errorRate: 0,
            reworkRate: 0,
            score: 0,
            rating: PERFORMANCE_RATINGS.NOT_RATED.label,
            targets: targets.QUALITY
        };
    }

    // Calculate quality metrics
    const tasksWithErrors = completedTasks.filter(task => task.qualityAssurance?.hasErrors).length;
    const tasksRequiringRework = completedTasks.filter(task => task.qualityAssurance?.requiresRework).length;

    const accuracyRate = ((completedTasks.length - tasksWithErrors) / completedTasks.length) * 100;
    const errorRate = (tasksWithErrors / completedTasks.length) * 100;
    const reworkRate = (tasksRequiringRework / completedTasks.length) * 100;

    // Calculate quality score using targets and weights
    let score = 0;
    const weights = METRIC_SCORING_WEIGHTS.QUALITY;

    // Accuracy rate score
    const accuracyScore = Math.min(100, (accuracyRate / targets.QUALITY.ACCURACY_RATE) * 100);
    score += (accuracyScore / 100) * weights.accuracyRate;

    // Error rate score (inverse relationship)
    const errorScore = errorRate <= targets.QUALITY.ERROR_RATE
        ? 100
        : Math.max(0, 100 - ((errorRate - targets.QUALITY.ERROR_RATE) / targets.QUALITY.ERROR_RATE) * 100);
    score += (errorScore / 100) * weights.errorRate;

    // Rework rate score (inverse relationship)
    const reworkScore = reworkRate <= targets.QUALITY.REWORK_RATE
        ? 100
        : Math.max(0, 100 - ((reworkRate - targets.QUALITY.REWORK_RATE) / targets.QUALITY.REWORK_RATE) * 100);
    score += (reworkScore / 100) * weights.reworkRate;

    const finalScore = Math.round(score);
    const rating = getPerformanceRating(finalScore);

    return {
        accuracyRate: Math.round(accuracyRate * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        reworkRate: Math.round(reworkRate * 100) / 100,
        totalCompleted: completedTasks.length,
        tasksWithErrors,
        tasksRequiringRework,
        score: finalScore,
        rating,
        targets: targets.QUALITY,
        breakdown: {
            accuracyScore: Math.round(accuracyScore),
            errorScore: Math.round(errorScore),
            reworkScore: Math.round(reworkScore)
        }
    };
};

// Calculate Efficiency Metrics
export const calculateEfficiencyMetrics = async (claimTasks, targets) => {
    const completedTasks = claimTasks.filter(task => task.status === TASK_STATUS.COMPLETED);

    if (completedTasks.length === 0) {
        return {
            averageCompletionTime: 0,
            onTimeCompletionRate: 0,
            score: 0,
            rating: PERFORMANCE_RATINGS.NOT_RATED.label,
            targets: targets.EFFICIENCY
        };
    }

    // Calculate average completion time in hours
    const totalCompletionTime = completedTasks.reduce((sum, task) => {
        if (task.timeTracking?.completedAt && task.timeTracking?.startedAt) {
            return sum + (new Date(task.timeTracking.completedAt) - new Date(task.timeTracking.startedAt));
        }
        return sum;
    }, 0);

    const avgCompletionTime = totalCompletionTime / completedTasks.length;
    const avgCompletionHours = avgCompletionTime / (1000 * 60 * 60);

    // Calculate on-time completion rate
    const onTimeTasks = completedTasks.filter(task => {
        if (task.dueDate && task.timeTracking?.completedAt) {
            return new Date(task.timeTracking.completedAt) <= new Date(task.dueDate);
        }
        return true; // If no due date, consider as on-time
    }).length;

    const onTimeRate = (onTimeTasks / completedTasks.length) * 100;

    // Calculate efficiency score using targets and weights
    let score = 0;
    const weights = METRIC_SCORING_WEIGHTS.EFFICIENCY;

    // Average completion time score (inverse relationship)
    const timeScore = avgCompletionHours <= targets.EFFICIENCY.AVG_COMPLETION_TIME
        ? 100
        : Math.max(0, 100 - ((avgCompletionHours - targets.EFFICIENCY.AVG_COMPLETION_TIME) / targets.EFFICIENCY.AVG_COMPLETION_TIME) * 50);
    score += (timeScore / 100) * weights.avgCompletionTime;

    // On-time completion rate score
    const onTimeScore = Math.min(100, (onTimeRate / targets.EFFICIENCY.ON_TIME_COMPLETION_RATE) * 100);
    score += (onTimeScore / 100) * weights.onTimeCompletionRate;

    const finalScore = Math.round(score);
    const rating = getPerformanceRating(finalScore);

    return {
        averageCompletionTime: Math.round(avgCompletionHours * 100) / 100,
        onTimeCompletionRate: Math.round(onTimeRate * 100) / 100,
        totalCompleted: completedTasks.length,
        onTimeTasks,
        score: finalScore,
        rating,
        targets: targets.EFFICIENCY,
        breakdown: {
            timeScore: Math.round(timeScore),
            onTimeScore: Math.round(onTimeScore)
        }
    };
};

// Calculate SLA Metrics
export const calculateSLAMetrics = async (employeeId, dateRange, targets) => {
    try {
        const slaTracking = await SLATracking.find({
            employeeRef: employeeId,
            'slaInfo.startDate': { $gte: dateRange.start, $lte: dateRange.end }
        });

        if (slaTracking.length === 0) {
            return {
                totalSLAs: 0,
                metSLAs: 0,
                breachedSLAs: 0,
                slaComplianceRate: 100,
                score: 100,
                rating: PERFORMANCE_RATINGS.EXCELLENT.label,
                targets: targets.SLA
            };
        }

        const metSLAs = slaTracking.filter(sla => sla.performance?.isWithinSLA).length;
        const breachedSLAs = slaTracking.filter(sla => sla.performance?.isBreached).length;
        const complianceRate = (metSLAs / slaTracking.length) * 100;

        // Calculate SLA score using brackets
        let score = SLA_SCORE_BRACKETS.POOR.score;
        Object.values(SLA_SCORE_BRACKETS).forEach(bracket => {
            if (complianceRate >= bracket.minRate) {
                score = Math.max(score, bracket.score);
            }
        });

        const rating = getPerformanceRating(score);

        return {
            totalSLAs: slaTracking.length,
            metSLAs,
            breachedSLAs,
            slaComplianceRate: Math.round(complianceRate * 100) / 100,
            score,
            rating,
            targets: targets.SLA
        };

    } catch (error) {
        console.error('Failed to calculate SLA metrics:', error);
        throw new ApiError(500, `Failed to calculate SLA metrics: ${error.message}`);
    }
};

// Calculate Volume Metrics
export const calculateVolumeMetrics = async (claimTasks, targets) => {
    const totalClaims = claimTasks.length;
    const completedClaims = claimTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
    const pendingClaims = claimTasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
    const deniedClaims = claimTasks.filter(task => task.status === TASK_STATUS.DENIED).length;

    // Group by claim type
    const claimTypes = claimTasks.reduce((acc, task) => {
        const type = task.claimType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const completionRate = totalClaims > 0 ? (completedClaims / totalClaims) * 100 : 0;

    return {
        totalClaims,
        completedClaims,
        pendingClaims,
        deniedClaims,
        claimTypes,
        completionRate: Math.round(completionRate * 100) / 100,
        targets: targets.VOLUME
    };
};

// Calculate Accuracy Metrics
export const calculateAccuracyMetrics = async (claimTasks, targets) => {
    const processedTasks = claimTasks.filter(task =>
        task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.DENIED
    );

    if (processedTasks.length === 0) {
        return {
            accuracyRate: 100,
            totalProcessed: 0,
            accurateTasks: 0,
            inaccurateTasks: 0,
            targets: targets.QUALITY
        };
    }

    const accurateTasks = processedTasks.filter(task =>
        !task.qualityAssurance?.hasErrors
    ).length;

    const accuracyRate = (accurateTasks / processedTasks.length) * 100;

    return {
        accuracyRate: Math.round(accuracyRate * 100) / 100,
        totalProcessed: processedTasks.length,
        accurateTasks,
        inaccurateTasks: processedTasks.length - accurateTasks,
        targets: targets.QUALITY
    };
};

// Calculate Timeliness Metrics
export const calculateTimelinessMetrics = async (claimTasks, targets) => {
    const tasksWithDueDate = claimTasks.filter(task => task.dueDate);

    if (tasksWithDueDate.length === 0) {
        return {
            timelinessRate: 100,
            onTimeSubmissions: 0,
            lateSubmissions: 0,
            totalWithDueDate: 0,
            targets: targets.EFFICIENCY
        };
    }

    const onTimeSubmissions = tasksWithDueDate.filter(task => {
        if (task.timeTracking?.completedAt) {
            return new Date(task.timeTracking.completedAt) <= new Date(task.dueDate);
        }
        return false;
    }).length;

    const timelinessRate = (onTimeSubmissions / tasksWithDueDate.length) * 100;

    return {
        timelinessRate: Math.round(timelinessRate * 100) / 100,
        onTimeSubmissions,
        lateSubmissions: tasksWithDueDate.length - onTimeSubmissions,
        totalWithDueDate: tasksWithDueDate.length,
        targets: targets.EFFICIENCY
    };
};

// Calculate Overall Performance Score
export const calculateOverallPerformanceScore = (metrics, weights) => {
    const overallScore =
        (metrics.productivity.score * weights.productivity) +
        (metrics.quality.score * weights.quality) +
        (metrics.efficiency.score * weights.efficiency) +
        (metrics.sla.score * weights.sla);

    return Math.round(overallScore);
};

// Calculate Working Days between two dates
export const calculateWorkingDays = (startDate, endDate) => {
    let workingDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
            workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays;
};

// Calculate Average Task Time (in minutes)
export const calculateAverageTaskTime = (tasks) => {
    if (tasks.length === 0) return 0;

    const totalTime = tasks.reduce((sum, task) => {
        if (task.timeTracking?.completedAt && task.timeTracking?.startedAt) {
            return sum + (new Date(task.timeTracking.completedAt) - new Date(task.timeTracking.startedAt));
        }
        return sum;
    }, 0);

    return totalTime / tasks.length / (1000 * 60); // Convert to minutes
};

// Helper function to get a rating based on a score
const getPerformanceRating = (score) => {
    for (const [key, rating] of Object.entries(PERFORMANCE_RATINGS)) {
        if (key === 'NOT_RATED') continue;
        if (score >= rating.minScore && score <= rating.maxScore) {
            return rating.label;
        }
    }
    return PERFORMANCE_RATINGS.NOT_RATED.label;
};