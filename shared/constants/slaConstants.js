// shared/constants/slaConstants.js

// Shared SLA Constants for Frontend and Backend
// This file contains all SLA-related constants used across the application

// SLA Types
export const SLA_TYPES = {
    TASK_COMPLETION: 'task_completion',
    RESPONSE_TIME: 'response_time',
    RESOLUTION_TIME: 'resolution_time',
    QUALITY_METRICS: 'quality_metrics',
    CLIENT_COMMUNICATION: 'client_communication',
    ESCALATION_TIME: 'escalation_time'
};

// SLA Type Labels for UI Display
export const SLA_TYPE_LABELS = {
    [SLA_TYPES.TASK_COMPLETION]: 'Task Completion',
    [SLA_TYPES.RESPONSE_TIME]: 'Response Time',
    [SLA_TYPES.RESOLUTION_TIME]: 'Resolution Time',
    [SLA_TYPES.QUALITY_METRICS]: 'Quality Metrics',
    [SLA_TYPES.CLIENT_COMMUNICATION]: 'Client Communication',
    [SLA_TYPES.ESCALATION_TIME]: 'Escalation Time'
};

// Priority Levels
export const SLA_PRIORITIES = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    NORMAL: 'Normal',
    HIGH: 'High',
    URGENT: 'Urgent',
    CRITICAL: 'Critical'
};

// Priority Colors for UI
export const SLA_PRIORITY_COLORS = {
    [SLA_PRIORITIES.LOW]: '#6B7280',
    [SLA_PRIORITIES.MEDIUM]: '#3B82F6',
    [SLA_PRIORITIES.NORMAL]: '#3B82F6',
    [SLA_PRIORITIES.HIGH]: '#F59E0B',
    [SLA_PRIORITIES.URGENT]: '#EF4444',
    [SLA_PRIORITIES.CRITICAL]: '#DC2626'
};

// SLA Status Types
export const SLA_STATUS = {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'On Hold',
    PAUSED: 'Paused',
    EXPIRED: 'Expired'
};

// SLA Status Colors for UI
export const SLA_STATUS_COLORS = {
    [SLA_STATUS.ACTIVE]: '#10B981',
    [SLA_STATUS.COMPLETED]: '#059669',
    [SLA_STATUS.CANCELLED]: '#6B7280',
    [SLA_STATUS.ON_HOLD]: '#F59E0B',
    [SLA_STATUS.PAUSED]: '#F59E0B',
    [SLA_STATUS.EXPIRED]: '#DC2626'
};

// Default SLA Targets (in hours)
export const DEFAULT_SLA_TARGETS = {
    STANDARD_CLAIMS: {
        completion: 24,
        response: 2,
        resolution: 48
    },
    URGENT_CLAIMS: {
        completion: 8,
        response: 1,
        resolution: 12
    },
    CRITICAL_CLAIMS: {
        completion: 4,
        response: 0.5,
        resolution: 6
    }
};

// Priority to Target Mapping
export const PRIORITY_TARGET_MAP = {
    [SLA_PRIORITIES.LOW]: 'STANDARD_CLAIMS',
    [SLA_PRIORITIES.MEDIUM]: 'STANDARD_CLAIMS',
    [SLA_PRIORITIES.NORMAL]: 'STANDARD_CLAIMS',
    [SLA_PRIORITIES.HIGH]: 'URGENT_CLAIMS',
    [SLA_PRIORITIES.URGENT]: 'URGENT_CLAIMS',
    [SLA_PRIORITIES.CRITICAL]: 'CRITICAL_CLAIMS'
};

// Alert Types
export const SLA_ALERT_TYPES = {
    WARNING: 'warning',
    CRITICAL: 'critical',
    BREACH: 'breach'
};

// Alert Thresholds (percentage of remaining time)
export const SLA_ALERT_THRESHOLDS = {
    WARNING: 25, // 25% remaining
    CRITICAL: 10, // 10% remaining
    BREACH: 0    // 0% remaining (breached)
};

// Alert Configuration
export const SLA_ALERT_CONFIG = {
    [SLA_ALERT_TYPES.WARNING]: {
        subject: '⚠️ SLA Warning Alert',
        urgency: 'Warning',
        threshold: '25%',
        color: '#F59E0B',
        icon: '⚠️'
    },
    [SLA_ALERT_TYPES.CRITICAL]: {
        subject: '🔥 SLA Critical Alert',
        urgency: 'Critical',
        threshold: '10%',
        color: '#EF4444',
        icon: '🔥'
    },
    [SLA_ALERT_TYPES.BREACH]: {
        subject: '🚨 SLA Breach Alert',
        urgency: 'Breach',
        threshold: '0%',
        color: '#DC2626',
        icon: '🚨'
    }
};

// Time Periods for Reports
export const SLA_TIME_PERIODS = {
    CURRENT_WEEK: 'current_week',
    CURRENT_MONTH: 'current_month',
    CURRENT_QUARTER: 'current_quarter',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    CURRENT_YEAR: 'current_year'
};

// Time Period Labels
export const SLA_TIME_PERIOD_LABELS = {
    [SLA_TIME_PERIODS.CURRENT_WEEK]: 'Current Week',
    [SLA_TIME_PERIODS.CURRENT_MONTH]: 'Current Month',
    [SLA_TIME_PERIODS.CURRENT_QUARTER]: 'Current Quarter',
    [SLA_TIME_PERIODS.LAST_7_DAYS]: 'Last 7 Days',
    [SLA_TIME_PERIODS.LAST_30_DAYS]: 'Last 30 Days',
    [SLA_TIME_PERIODS.LAST_90_DAYS]: 'Last 90 Days',
    [SLA_TIME_PERIODS.CURRENT_YEAR]: 'Current Year'
};

// Compliance Types
export const SLA_COMPLIANCE_TYPES = {
    INTERNAL: 'Internal SLA',
    EXTERNAL: 'External SLA',
    REGULATORY: 'Regulatory Compliance',
    CONTRACTUAL: 'Contractual SLA'
};

// Resolution Types
export const SLA_RESOLUTION_TYPES = {
    COMPLETED_ON_TIME: 'completed_on_time',
    COMPLETED_LATE: 'completed_late',
    ESCALATED: 'escalated',
    CANCELLED: 'cancelled',
    EXCEPTION_GRANTED: 'exception_granted'
};

// Resolution Type Labels
export const SLA_RESOLUTION_TYPE_LABELS = {
    [SLA_RESOLUTION_TYPES.COMPLETED_ON_TIME]: 'Completed On Time',
    [SLA_RESOLUTION_TYPES.COMPLETED_LATE]: 'Completed Late',
    [SLA_RESOLUTION_TYPES.ESCALATED]: 'Escalated',
    [SLA_RESOLUTION_TYPES.CANCELLED]: 'Cancelled',
    [SLA_RESOLUTION_TYPES.EXCEPTION_GRANTED]: 'Exception Granted'
};

// Chart Colors for Analytics
export const SLA_CHART_COLORS = {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    NEUTRAL: '#6B7280',
    ACCENT: '#8B5CF6'
};

// Performance Metrics
export const SLA_METRICS = {
    COMPLIANCE_RATE: 'compliance_rate',
    BREACH_RATE: 'breach_rate',
    AVERAGE_COMPLETION_TIME: 'avg_completion_time',
    TOTAL_SLAS: 'total_slas',
    ACTIVE_SLAS: 'active_slas',
    COMPLETED_SLAS: 'completed_slas',
    BREACHED_SLAS: 'breached_slas'
};

// Metric Labels
export const SLA_METRIC_LABELS = {
    [SLA_METRICS.COMPLIANCE_RATE]: 'Compliance Rate',
    [SLA_METRICS.BREACH_RATE]: 'Breach Rate',
    [SLA_METRICS.AVERAGE_COMPLETION_TIME]: 'Average Completion Time',
    [SLA_METRICS.TOTAL_SLAS]: 'Total SLAs',
    [SLA_METRICS.ACTIVE_SLAS]: 'Active SLAs',
    [SLA_METRICS.COMPLETED_SLAS]: 'Completed SLAs',
    [SLA_METRICS.BREACHED_SLAS]: 'Breached SLAs'
};

// Notification Categories
export const SLA_NOTIFICATION_CATEGORIES = {
    SLA_WARNING: 'sla_warning',
    SLA_CRITICAL: 'sla_critical',
    SLA_BREACH: 'sla_breach',
    SLA_COMPLETED: 'sla_completed',
    SLA_CANCELLED: 'sla_cancelled'
};

// Email Template Types
export const SLA_EMAIL_TEMPLATES = {
    SLA_ALERT: 'sla_alert',
    SLA_BREACH: 'sla_breach',
    SLA_COMPLETED: 'sla_completed',
    SLA_SUMMARY: 'sla_summary'
};

// API Endpoints (relative paths)
export const SLA_API_ENDPOINTS = {
    CREATE: '/api/sla',
    UPDATE: '/api/sla/:id',
    DELETE: '/api/sla/:id',
    GET_BY_ID: '/api/sla/:id',
    GET_ALL: '/api/sla',
    STATISTICS: '/api/sla/statistics',
    MONITOR: '/api/sla/monitor',
    TRENDS: '/api/sla/trends',
    BULK_UPDATE: '/api/sla/bulk-update'
};

// Frontend Route Paths
export const SLA_ROUTES = {
    DASHBOARD: '/sla',
    LIST: '/sla/list',
    CREATE: '/sla/create',
    EDIT: '/sla/edit/:id',
    VIEW: '/sla/view/:id',
    STATISTICS: '/sla/statistics',
    REPORTS: '/sla/reports'
};

// Table Column Keys
export const SLA_TABLE_COLUMNS = {
    SLA_TYPE: 'slaType',
    PRIORITY: 'priority',
    STATUS: 'status',
    TARGET_TIME: 'targetTimeHours',
    REMAINING_TIME: 'remainingTime',
    COMPLIANCE: 'isWithinSLA',
    CREATED_DATE: 'createdAt',
    DUE_DATE: 'dueDate',
    EMPLOYEE: 'employee',
    CLIENT: 'client',
    CLAIM_NUMBER: 'claimNumber'
};

// Filter Options
export const SLA_FILTER_OPTIONS = {
    ALL_TYPES: Object.values(SLA_TYPES),
    ALL_PRIORITIES: Object.values(SLA_PRIORITIES),
    ALL_STATUSES: Object.values(SLA_STATUS),
    ALL_PERIODS: Object.values(SLA_TIME_PERIODS)
};

// Default Values
export const SLA_DEFAULTS = {
    PRIORITY: SLA_PRIORITIES.MEDIUM,
    SLA_TYPE: SLA_TYPES.TASK_COMPLETION,
    TIME_PERIOD: SLA_TIME_PERIODS.CURRENT_MONTH,
    WARNING_THRESHOLD: 0.75, // 75% of target time
    CRITICAL_THRESHOLD: 0.90, // 90% of target time
    COMPLIANCE_TYPE: SLA_COMPLIANCE_TYPES.INTERNAL
};

// Error Messages
export const SLA_ERROR_MESSAGES = {
    REQUIRED_FIELDS: 'Company reference and SLA type are required',
    NOT_FOUND: 'SLA tracking not found',
    CREATE_FAILED: 'Failed to create SLA tracking',
    UPDATE_FAILED: 'Failed to update SLA status',
    MONITOR_FAILED: 'Failed to monitor SLAs',
    STATS_FAILED: 'Failed to get SLA statistics',
    AUTO_CREATE_FAILED: 'Failed to auto-create SLA for task'
};

// Success Messages
export const SLA_SUCCESS_MESSAGES = {
    CREATED: 'SLA tracking created successfully',
    UPDATED: 'SLA status updated successfully',
    DELETED: 'SLA tracking deleted successfully',
    COMPLETED: 'SLA completed successfully',
    CANCELLED: 'SLA cancelled successfully'
};

// Validation Rules
export const SLA_VALIDATION = {
    MIN_TARGET_TIME: 0.5, // 30 minutes
    MAX_TARGET_TIME: 720, // 30 days
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_NOTES_LENGTH: 1000
};