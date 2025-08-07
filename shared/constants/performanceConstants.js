// shared/constants/performanceConstants.js

// Can be used in both frontend and backend applications

// Performance Rating Thresholds
export const PERFORMANCE_RATINGS = {
    EXCELLENT: {
        label: 'Excellent',
        minScore: 90,
        maxScore: 100,
        color: '#10B981', // Green
        badge: 'success'
    },
    GOOD: {
        label: 'Good',
        minScore: 80,
        maxScore: 89,
        color: '#3B82F6', // Blue
        badge: 'primary'
    },
    SATISFACTORY: {
        label: 'Satisfactory',
        minScore: 70,
        maxScore: 79,
        color: '#F59E0B', // Yellow
        badge: 'warning'
    },
    NEEDS_IMPROVEMENT: {
        label: 'Needs Improvement',
        minScore: 60,
        maxScore: 69,
        color: '#EF4444', // Red
        badge: 'danger'
    },
    POOR: {
        label: 'Poor',
        minScore: 0,
        maxScore: 59,
        color: '#DC2626', // Dark Red
        badge: 'danger'
    },
    NOT_RATED: {
        label: 'Not Rated',
        minScore: null,
        maxScore: null,
        color: '#6B7280', // Gray
        badge: 'secondary'
    }
};

// Overall Performance Score Weights
export const PERFORMANCE_WEIGHTS = {
    productivity: 0.25,
    quality: 0.30,
    efficiency: 0.25,
    sla: 0.20
};

// Alternative weight configurations for different roles/departments
export const ROLE_BASED_WEIGHTS = {
    CLAIMS_PROCESSOR: {
        productivity: 0.25,
        quality: 0.35,
        efficiency: 0.25,
        sla: 0.15
    },
    SENIOR_PROCESSOR: {
        productivity: 0.20,
        quality: 0.40,
        efficiency: 0.25,
        sla: 0.15
    },
    TEAM_LEAD: {
        productivity: 0.15,
        quality: 0.30,
        efficiency: 0.25,
        sla: 0.30
    },
    QUALITY_ANALYST: {
        productivity: 0.15,
        quality: 0.50,
        efficiency: 0.20,
        sla: 0.15
    }
};

// Performance Targets (Default Values)
export const PERFORMANCE_TARGETS = {
    // Productivity Targets
    PRODUCTIVITY: {
        TASKS_PER_DAY: 8,
        COMPLETION_RATE: 95, // percentage
        AVG_TIME_PER_TASK: 60, // minutes
        WORKING_HOURS_PER_DAY: 8
    },

    // Quality Targets
    QUALITY: {
        ACCURACY_RATE: 98, // percentage
        ERROR_RATE: 2, // percentage
        REWORK_RATE: 1 // percentage
    },

    // Efficiency Targets
    EFFICIENCY: {
        AVG_COMPLETION_TIME: 2, // hours
        ON_TIME_COMPLETION_RATE: 95 // percentage
    },

    // SLA Targets
    SLA: {
        COMPLIANCE_RATE: 98 // percentage
    },

    // Volume Targets
    VOLUME: {
        MONTHLY_CLAIMS: 160, // 8 tasks * 20 working days
        WEEKLY_CLAIMS: 40
    }
};

// Scoring Weights for Individual Metrics
export const METRIC_SCORING_WEIGHTS = {
    PRODUCTIVITY: {
        tasksPerDay: 30,
        completionRate: 40,
        avgTimePerTask: 30
    },

    QUALITY: {
        accuracyRate: 50,
        errorRate: 30,
        reworkRate: 20
    },

    EFFICIENCY: {
        avgCompletionTime: 50,
        onTimeCompletionRate: 50
    }
};

// SLA Compliance Score Brackets
export const SLA_SCORE_BRACKETS = {
    EXCELLENT: { minRate: 98, score: 100 },
    GOOD: { minRate: 95, score: 85 },
    SATISFACTORY: { minRate: 90, score: 70 },
    NEEDS_IMPROVEMENT: { minRate: 80, score: 50 },
    POOR: { minRate: 0, score: 25 }
};

// Time Period Constants
export const TIME_PERIODS = {
    CURRENT_DAY: 'current_day',
    CURRENT_WEEK: 'current_week',
    CURRENT_MONTH: 'current_month',
    CURRENT_QUARTER: 'current_quarter',
    CURRENT_YEAR: 'current_year',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    CUSTOM: 'custom'
};

// Time Period Labels for UI
export const TIME_PERIOD_LABELS = {
    [TIME_PERIODS.CURRENT_WEEK]: 'Current Week',
    [TIME_PERIODS.CURRENT_MONTH]: 'Current Month',
    [TIME_PERIODS.CURRENT_QUARTER]: 'Current Quarter',
    [TIME_PERIODS.CURRENT_YEAR]: 'Current Year',
    [TIME_PERIODS.LAST_30_DAYS]: 'Last 30 Days',
    [TIME_PERIODS.LAST_90_DAYS]: 'Last 90 Days',
    [TIME_PERIODS.CUSTOM]: 'Custom Range'
};

// Task Status Constants
export const TASK_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    DENIED: 'Denied',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled'
};

// Task Priority Levels
export const TASK_PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
    CRITICAL: 'Critical'
};

// Performance Metric Types
export const METRIC_TYPES = {
    PRODUCTIVITY: 'productivity',
    QUALITY: 'quality',
    EFFICIENCY: 'efficiency',
    SLA: 'sla',
    VOLUME: 'volume',
    ACCURACY: 'accuracy',
    TIMELINESS: 'timeliness'
};

// Performance Metric Labels for UI
export const METRIC_LABELS = {
    [METRIC_TYPES.PRODUCTIVITY]: 'Productivity',
    [METRIC_TYPES.QUALITY]: 'Quality',
    [METRIC_TYPES.EFFICIENCY]: 'Efficiency',
    [METRIC_TYPES.SLA]: 'SLA Compliance',
    [METRIC_TYPES.VOLUME]: 'Volume',
    [METRIC_TYPES.ACCURACY]: 'Accuracy',
    [METRIC_TYPES.TIMELINESS]: 'Timeliness'
};

// Performance Chart Colors
export const CHART_COLORS = {
    primary: '#3B82F6',
    secondary: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    success: '#10B981',
    gradient: {
        productivity: ['#3B82F6', '#1D4ED8'],
        quality: ['#10B981', '#059669'],
        efficiency: ['#F59E0B', '#D97706'],
        sla: ['#8B5CF6', '#7C3AED']
    }
};

// Dashboard Widget Configuration
export const DASHBOARD_WIDGETS = {
    OVERVIEW_CARDS: {
        overallScore: { icon: 'TrendingUp', color: 'primary' },
        productivity: { icon: 'Activity', color: 'blue' },
        quality: { icon: 'CheckCircle', color: 'green' },
        efficiency: { icon: 'Clock', color: 'yellow' },
        sla: { icon: 'Target', color: 'purple' }
    }
};

// Performance Improvement Recommendations
export const IMPROVEMENT_RECOMMENDATIONS = {
    PRODUCTIVITY: [
        'Focus on task prioritization and time management',
        'Use productivity tools and templates',
        'Break down complex tasks into smaller chunks',
        'Minimize distractions during work hours'
    ],
    QUALITY: [
        'Double-check work before submission',
        'Follow quality checklists and guidelines',
        'Seek feedback from supervisors',
        'Attend quality training sessions'
    ],
    EFFICIENCY: [
        'Streamline workflow processes',
        'Use keyboard shortcuts and automation',
        'Organize workspace and digital files',
        'Learn advanced software features'
    ],
    SLA: [
        'Monitor deadlines closely',
        'Communicate early about potential delays',
        'Prioritize high-priority tasks',
        'Plan work schedule effectively'
    ]
};

// Export default configuration
export const DEFAULT_CONFIG = { 
    weights: PERFORMANCE_WEIGHTS,
    targets: PERFORMANCE_TARGETS,
    ratings: PERFORMANCE_RATINGS,
    defaultPeriod: TIME_PERIODS.CURRENT_MONTH,
    trendsMonths: 6,
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8
};

export const SYSTEM_DEFAULT_TARGETS = {
    dailyClaimTarget: 30,
    qualityTarget: 90,
    slaTarget: 95
};

// Rating Lookup Arrays (for easy iteration in frontend)
export const RATING_ORDER = ['Poor', 'Needs Improvement', 'Satisfactory', 'Good', 'Excellent'];

export const METRIC_ORDER = ['productivity', 'quality', 'efficiency', 'sla', 'volume', 'accuracy', 'timeliness'];