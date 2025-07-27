// shared/constants/reportConstants.js

// Report Types
export const REPORT_TYPES = {
    EMPLOYEE_PERFORMANCE: 'employee_performance',
    TEAM_PRODUCTIVITY: 'team_productivity',
    SLA_COMPLIANCE: 'sla_compliance',
    CLIENT_ANALYTICS: 'client_analytics',
    TASK_ANALYTICS: 'task_analytics',
    GAMIFICATION_REPORT: 'gamification_report',
    OPERATIONAL_DASHBOARD: 'operational_dashboard',
    EXECUTIVE_SUMMARY: 'executive_summary',
    CUSTOM_REPORT: 'custom_report'
};

// Report Periods
export const REPORT_PERIODS = {
    CURRENT_WEEK: 'current_week',
    CURRENT_MONTH: 'current_month',
    CURRENT_QUARTER: 'current_quarter',
    CURRENT_YEAR: 'current_year',
    LAST_WEEK: 'last_week',
    LAST_MONTH: 'last_month',
    LAST_QUARTER: 'last_quarter',
    LAST_YEAR: 'last_year',
    CUSTOM: 'custom'
};

// Export Formats
export const EXPORT_FORMATS = {
    CSV: 'csv',
    EXCEL: 'excel',
    PDF: 'pdf',
    JSON: 'json'
};

// Group By Options
export const GROUP_BY_OPTIONS = {
    DEPARTMENT: 'department',
    ROLE: 'role',
    EMPLOYEE: 'employee',
    CLIENT: 'client',
    DATE: 'date',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter'
};

// Performance Rating Thresholds
export const PERFORMANCE_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 80,
    SATISFACTORY: 70,
    NEEDS_IMPROVEMENT: 60,
    POOR: 0
};

// Performance Rating Labels
export const PERFORMANCE_RATINGS = {
    EXCELLENT: 'Excellent',
    GOOD: 'Good',
    SATISFACTORY: 'Satisfactory',
    NEEDS_IMPROVEMENT: 'Needs Improvement',
    POOR: 'Poor'
};

// Task Status
export const TASK_STATUS = {
    NEW: 'New',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
    REVIEW: 'Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
};

// Employee Status
export const EMPLOYEE_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    TERMINATED: 'Terminated',
    ON_LEAVE: 'On Leave'
};

// Client Status
export const CLIENT_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    PROSPECTIVE: 'Prospective',
    TERMINATED: 'Terminated'
};

// SLA Types
export const SLA_TYPES = {
    RESPONSE_TIME: 'response_time',
    RESOLUTION_TIME: 'resolution_time',
    FIRST_CALL_RESOLUTION: 'first_call_resolution',
    QUALITY_SCORE: 'quality_score',
    CUSTOMER_SATISFACTION: 'customer_satisfaction',
    AVAILABILITY: 'availability',
    PROCESSING_TIME: 'processing_time'
};

// SLA Priority Levels
export const SLA_PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
    URGENT: 'Urgent'
};

// SLA Status
export const SLA_STATUS = {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    BREACHED: 'Breached',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled'
};

// Report Filter Options
export const FILTER_OPTIONS = {
    INCLUDE_DETAILS: 'includeDetails',
    INCLUDE_FINANCIALS: 'includeFinancials',
    INCLUDE_BREAKDOWN: 'includeBreakdown',
    INCLUDE_TRENDS: 'includeTrends',
    INCLUDE_COMPARISONS: 'includeComparisons'
};

// Chart Types for Visualizations
export const CHART_TYPES = {
    BAR: 'bar',
    LINE: 'line',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    AREA: 'area',
    SCATTER: 'scatter',
    GAUGE: 'gauge',
    HEATMAP: 'heatmap'
};

// Date Range Presets
export const DATE_RANGE_PRESETS = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    THIS_WEEK: 'this_week',
    LAST_WEEK: 'last_week',
    THIS_MONTH: 'this_month',
    LAST_MONTH: 'last_month',
    THIS_QUARTER: 'this_quarter',
    LAST_QUARTER: 'last_quarter',
    THIS_YEAR: 'this_year',
    LAST_YEAR: 'last_year'
};

// Metric Types
export const METRIC_TYPES = {
    COUNT: 'count',
    PERCENTAGE: 'percentage',
    AVERAGE: 'average',
    SUM: 'sum',
    RATE: 'rate',
    RATIO: 'ratio',
    SCORE: 'score',
    TIME: 'time',
    CURRENCY: 'currency'
};

// Sort Orders
export const SORT_ORDERS = {
    ASC: 'asc',
    DESC: 'desc'
};

// Sort Fields
export const SORT_FIELDS = {
    NAME: 'name',
    DATE: 'date',
    SCORE: 'score',
    COUNT: 'count',
    RATE: 'rate',
    DEPARTMENT: 'department',
    ROLE: 'role',
    CLIENT: 'client',
    STATUS: 'status',
    PRIORITY: 'priority'
};

// Report Colors for Charts
export const REPORT_COLORS = {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#06B6D4',
    SECONDARY: '#6B7280',
    CHART_PALETTE: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#06B6D4', '#8B5CF6', '#F97316', '#EC4899',
        '#14B8A6', '#84CC16', '#6366F1', '#F43F5E'
    ]
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100, 200],
    MAX_PAGE_SIZE: 1000
};

// File Size Limits
export const FILE_LIMITS = {
    MAX_EXPORT_SIZE_MB: 50,
    MAX_ROWS_PER_EXPORT: 100000,
    CHUNK_SIZE: 1000
};

// Cache Settings
export const CACHE_SETTINGS = {
    REPORT_TTL_MINUTES: 30,
    SUMMARY_TTL_MINUTES: 60,
    DASHBOARD_TTL_MINUTES: 15
};

// API Response Status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed'
};

// Report Generation Status
export const REPORT_STATUS = {
    QUEUED: 'queued',
    GENERATING: 'generating',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

// Insight Types
export const INSIGHT_TYPES = {
    POSITIVE: 'positive',
    CONCERN: 'concern',
    NEUTRAL: 'neutral',
    TREND: 'trend',
    ALERT: 'alert'
};

// Insight Categories
export const INSIGHT_CATEGORIES = {
    PRODUCTIVITY: 'productivity',
    PERFORMANCE: 'performance',
    COMPLIANCE: 'compliance',
    QUALITY: 'quality',
    EFFICIENCY: 'efficiency',
    FINANCIAL: 'financial',
    OPERATIONAL: 'operational'
};

// Contract Types
export const CONTRACT_TYPES = {
    HOURLY: 'Hourly',
    FIXED: 'Fixed',
    RETAINER: 'Retainer',
    PROJECT: 'Project',
    MAINTENANCE: 'Maintenance'
};

// Payment Terms
export const PAYMENT_TERMS = {
    NET_15: 'Net 15',
    NET_30: 'Net 30',
    NET_60: 'Net 60',
    NET_90: 'Net 90',
    IMMEDIATE: 'Immediate',
    ADVANCE: 'Advance'
};

// Role Levels
export const ROLE_LEVELS = {
    JUNIOR: 'Junior',
    INTERMEDIATE: 'Intermediate',
    SENIOR: 'Senior',
    LEAD: 'Lead',
    MANAGER: 'Manager',
    DIRECTOR: 'Director',
    EXECUTIVE: 'Executive'
};

// Time Units
export const TIME_UNITS = {
    MINUTES: 'minutes',
    HOURS: 'hours',
    DAYS: 'days',
    WEEKS: 'weeks',
    MONTHS: 'months',
    YEARS: 'years'
};

// Error Messages
export const ERROR_MESSAGES = {
    REPORT_GENERATION_FAILED: 'Failed to generate report',
    INVALID_DATE_RANGE: 'Invalid date range provided',
    INSUFFICIENT_DATA: 'Insufficient data for report generation',
    EXPORT_FAILED: 'Failed to export report',
    UNAUTHORIZED_ACCESS: 'Unauthorized access to report',
    INVALID_FILTERS: 'Invalid filters provided',
    MISSING_REQUIRED_FIELDS: 'Missing required fields'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    REPORT_GENERATED: 'Report generated successfully',
    REPORT_EXPORTED: 'Report exported successfully',
    FILTERS_APPLIED: 'Filters applied successfully',
    DATA_UPDATED: 'Data updated successfully'
};

// Default Values
export const DEFAULTS = {
    PERIOD: REPORT_PERIODS.CURRENT_MONTH,
    EXPORT_FORMAT: EXPORT_FORMATS.EXCEL,
    GROUP_BY: GROUP_BY_OPTIONS.DEPARTMENT,
    SORT_ORDER: SORT_ORDERS.DESC,
    PAGE_SIZE: PAGINATION.DEFAULT_PAGE_SIZE,
    CHART_TYPE: CHART_TYPES.BAR,
    INCLUDE_DETAILS: false,
    INCLUDE_FINANCIALS: false
};

// Validation Rules
export const VALIDATION_RULES = {
    MAX_DATE_RANGE_DAYS: 365,
    MIN_EMPLOYEE_COUNT: 1,
    MAX_EMPLOYEE_COUNT: 10000,
    MIN_SCORE: 0,
    MAX_SCORE: 100,
    MAX_FILTER_VALUES: 100
};