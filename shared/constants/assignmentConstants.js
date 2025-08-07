// shared/constants/assignmentConstants.js

// Shared constants for assignment functionality across frontend and backend

// Assignment Algorithms
export const ASSIGNMENT_ALGORITHMS = {
    ROUND_ROBIN: 'round_robin',
    SKILL_BASED: 'skill_based',
    WORKLOAD_BALANCED: 'workload_balanced',
    PERFORMANCE_BASED: 'performance_based',
    PRIORITY_FIRST: 'priority_first',
    HYBRID: 'hybrid'
};

// Algorithm Display Names
export const ALGORITHM_DISPLAY_NAMES = {
    [ASSIGNMENT_ALGORITHMS.ROUND_ROBIN]: 'Round Robin',
    [ASSIGNMENT_ALGORITHMS.SKILL_BASED]: 'Skill Based',
    [ASSIGNMENT_ALGORITHMS.WORKLOAD_BALANCED]: 'Workload Balanced',
    [ASSIGNMENT_ALGORITHMS.PERFORMANCE_BASED]: 'Performance Based',
    [ASSIGNMENT_ALGORITHMS.PRIORITY_FIRST]: 'Priority First',
    [ASSIGNMENT_ALGORITHMS.HYBRID]: 'Hybrid Algorithm'
};

// Algorithm Descriptions
export const ALGORITHM_DESCRIPTIONS = {
    [ASSIGNMENT_ALGORITHMS.ROUND_ROBIN]: 'Distributes tasks evenly among available employees in rotation',
    [ASSIGNMENT_ALGORITHMS.SKILL_BASED]: 'Assigns tasks based on employee skill matching',
    [ASSIGNMENT_ALGORITHMS.WORKLOAD_BALANCED]: 'Assigns to employees with the lowest current workload',
    [ASSIGNMENT_ALGORITHMS.PERFORMANCE_BASED]: 'Prioritizes high-performing employees for task assignment',
    [ASSIGNMENT_ALGORITHMS.PRIORITY_FIRST]: 'Considers task priority when selecting employees',
    [ASSIGNMENT_ALGORITHMS.HYBRID]: 'Combines multiple factors for optimal assignment decisions'
};

// Task Statuses
export const TASK_STATUSES = {
    NEW: 'New',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    ON_HOLD: 'On Hold',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled'
};

// Task Priorities
export const TASK_PRIORITIES = {
    LOW: 'Low',
    NORMAL: 'Normal',
    HIGH: 'High',
    CRITICAL: 'Critical'
};

// Priority Colors (for UI)
export const PRIORITY_COLORS = {
    [TASK_PRIORITIES.LOW]: '#10B981',        // Green
    [TASK_PRIORITIES.NORMAL]: '#3B82F6',     // Blue
    [TASK_PRIORITIES.HIGH]: '#F59E0B',       // Orange
    [TASK_PRIORITIES.CRITICAL]: '#EF4444'    // Red
};

// Assignment Methods
export const ASSIGNMENT_METHODS = {
    MANUAL: 'manual',
    AUTOMATIC: 'automatic',
    SYSTEM: 'system'
};

// Employee Status
export const EMPLOYEE_STATUSES = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ON_LEAVE: 'On Leave',
    SUSPENDED: 'Suspended'
};

// Claim Types and Required Skills Mapping
export const CLAIM_TYPES = {
    PROFESSIONAL: 'Professional',
    INSTITUTIONAL: 'Institutional',
    DENTAL: 'Dental',
    VISION: 'Vision',
    DME: 'DME',
    PHARMACY: 'Pharmacy'
};

export const CLAIM_TYPE_SKILLS = {
    [CLAIM_TYPES.PROFESSIONAL]: ['Medical Coding', 'Claims Processing'],
    [CLAIM_TYPES.INSTITUTIONAL]: ['Hospital Billing', 'Claims Processing'],
    [CLAIM_TYPES.DENTAL]: ['Dental Coding', 'Claims Processing'],
    [CLAIM_TYPES.VISION]: ['Vision Coding', 'Claims Processing'],
    [CLAIM_TYPES.DME]: ['DME Coding', 'Claims Processing'],
    [CLAIM_TYPES.PHARMACY]: ['Pharmacy Billing', 'Claims Processing']
};

// Workload Thresholds
export const WORKLOAD_THRESHOLDS = {
    AVAILABLE: 90,      // Under 90% is considered available
    HIGH_CAPACITY: 70,  // Under 70% for high priority tasks
    OPTIMAL: 50         // Under 50% for critical tasks
};

// Default Values
export const DEFAULT_VALUES = {
    MAX_CAPACITY: 10,           // Default tasks per day
    PERFORMANCE_SCORE: 70,      // Default performance score
    SKILL_SCORE: 50            // Default skill score when no skills match
};

// Scoring Weights for Hybrid Algorithm
export const HYBRID_WEIGHTS = {
    SKILL: 0.30,        // 30% weight for skill matching
    WORKLOAD: 0.25,     // 25% weight for workload balance
    PERFORMANCE: 0.25,  // 25% weight for performance
    PRIORITY: 0.20      // 20% weight for priority handling
};

// Time Periods for Statistics
export const TIME_PERIODS = {
    TODAY: 'today',
    CURRENT_WEEK: 'current_week',
    CURRENT_MONTH: 'current_month',
    CURRENT_QUARTER: 'current_quarter',
    CURRENT_YEAR: 'current_year',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days'
};

// Period Display Names
export const PERIOD_DISPLAY_NAMES = {
    [TIME_PERIODS.TODAY]: 'Today',
    [TIME_PERIODS.CURRENT_WEEK]: 'This Week',
    [TIME_PERIODS.CURRENT_MONTH]: 'This Month',
    [TIME_PERIODS.CURRENT_QUARTER]: 'This Quarter',
    [TIME_PERIODS.CURRENT_YEAR]: 'This Year',
    [TIME_PERIODS.LAST_7_DAYS]: 'Last 7 Days',
    [TIME_PERIODS.LAST_30_DAYS]: 'Last 30 Days',
    [TIME_PERIODS.LAST_90_DAYS]: 'Last 90 Days'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    TASK_ASSIGNED: 'task_assigned',
    TASK_REASSIGNED: 'task_reassigned',
    TASK_COMPLETED: 'task_completed',
    WORKLOAD_HIGH: 'workload_high'
};

// Assignment Result Messages
export const ASSIGNMENT_MESSAGES = {
    NO_TASKS: 'No unassigned tasks found',
    NO_EMPLOYEES: 'No available employees found',
    SUCCESS: 'Tasks assigned successfully',
    PARTIAL_SUCCESS: 'Some tasks could not be assigned',
    EMPLOYEE_AT_CAPACITY: 'Employee has reached maximum capacity',
    TASK_NOT_FOUND: 'Task not found',
    EMPLOYEE_NOT_FOUND: 'Employee not found'
};

// API Response Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Validation Rules
export const VALIDATION_RULES = {
    MIN_TASK_PRIORITY: 1,
    MAX_TASK_PRIORITY: 4,
    MIN_PERFORMANCE_SCORE: 0,
    MAX_PERFORMANCE_SCORE: 100,
    MIN_WORKLOAD_PERCENTAGE: 0,
    MAX_WORKLOAD_PERCENTAGE: 100
};

// Export all constants as a single object for easier importing
export const ASSIGNMENT_CONSTANTS = {
    ASSIGNMENT_ALGORITHMS,
    ALGORITHM_DISPLAY_NAMES,
    ALGORITHM_DESCRIPTIONS,
    TASK_STATUSES,
    TASK_PRIORITIES,
    PRIORITY_COLORS,
    ASSIGNMENT_METHODS,
    EMPLOYEE_STATUSES,
    CLAIM_TYPES,
    CLAIM_TYPE_SKILLS,
    WORKLOAD_THRESHOLDS,
    DEFAULT_VALUES,
    HYBRID_WEIGHTS,
    TIME_PERIODS,
    PERIOD_DISPLAY_NAMES,
    NOTIFICATION_TYPES,
    ASSIGNMENT_MESSAGES,
    HTTP_STATUS,
    VALIDATION_RULES
};