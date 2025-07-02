// backend/src/constants.js

// Multer File Paths
export const MULTER_AVATAR_PATH = './public/uploads/avatars'
export const MULTER_DOCUMENT_PATH = './public/uploads/documents'
export const MULTER_BULK_PATH = './public/uploads/bulk'
export const MULTER_TEMP_PATH = './public/uploads/temp'

// File Size
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024  // 5MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024  // 20MB
export const MAX_BULK_FILE_SIZE = 50 * 1024 * 1024  // 50MB

// Allowed File Types
export const AVATAR_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

export const DOCUMENT_ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/jpeg',
    'image/jpg',
    'image/png'
];

export const BULK_FILE_ALLOWED_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
];

// Employee Status
export const EMPLOYEE_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ON_LEAVE: 'On Leave',
    SUSPENDED: 'Suspended',
    TERMINATED: 'Terminated',
    NOTICE_PERIOD: 'Notice Period'
};

// Company Subscription Plans
export const SUBSCRIPTION_PLANS = {
    TRIAL: 'Trial',
    BASIC: 'Basic',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Enterprise'
};

// Default Role Levels (for permission checking)
export const ROLE_LEVELS = {
    INTERN: 1,
    JUNIOR: 2,
    STAFF: 3,
    SENIOR_STAFF: 4,
    TEAM_LEAD: 5,
    MANAGER: 6,
    DIRECTOR: 7,
    SENIOR_ADMIN: 8,
    ADMIN: 9,
    SUPER_ADMIN: 10
};

// Email Templates
export const EMAIL_TEMPLATES = {
    COMPANY_WELCOME: 'company_welcome',
    EMPLOYEE_WELCOME: 'employee_welcome',
    PASSWORD_RESET: 'password_reset',
    BULK_UPLOAD_RESULTS: 'bulk_upload_results',
    CLIENT_ONBOARDING: 'client_onboarding',
    INVOICE_GENERATED: 'invoice_generated',
    SLA_BREACH_ALERT: 'sla_breach_alert',
    PERFORMANCE_REPORT: 'performance_report'
};

// Service Types
export const SERVICE_TYPES = {
    AR_CALLING: 'AR Calling',
    MEDICAL_CODING: 'Medical Coding',
    PRIOR_AUTH: 'Prior Authorization',
    DENIAL_MANAGEMENT: 'Denial Management',
    PATIENT_REGISTRATION: 'Patient Registration',
    INSURANCE_VERIFICATION: 'Insurance Verification',
    PAYMENT_POSTING: 'Payment Posting',
    CLAIMS_PROCESSING: 'Claims Processing',
    CREDENTIALING: 'Credentialing',
    MEDICAL_BILLING: 'Medical Billing',
    RCM: 'Revenue Cycle Management'
};

// Client Types
export const CLIENT_TYPES = {
    INDIVIDUAL_PROVIDER: 'Individual Provider',
    GROUP_PRACTICE: 'Group Practice',
    HOSPITAL: 'Hospital',
    CLINIC: 'Clinic',
    BILLING_COMPANY: 'Billing Company',
    ASC: 'ASC',
    LAB: 'Lab',
    DME: 'DME',
    OTHER: 'Other'
};

// Specialty Types
export const SPECIALTY_TYPES = [
    'Primary Care',
    'Cardiology',
    'Dermatology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
    'Emergency Medicine',
    'Anesthesiology',
    'Pathology',
    'Physical Therapy',
    'Dental',
    'Vision',
    'Mental Health',
    'Multi-Specialty',
    'Other'
];

// Performance Rating Scale
export const PERFORMANCE_RATINGS = {
    OUTSTANDING: 'Outstanding',
    EXCEEDS_EXPECTATIONS: 'Exceeds Expectations',
    MEETS_EXPECTATIONS: 'Meets Expectations',
    BELOW_EXPECTATIONS: 'Below Expectations',
    NEEDS_IMPROVEMENT: 'Needs Improvement'
};

// Gamification Constants
export const GAMIFICATION = {
    // Experience Points
    XP_REWARDS: {
        TASK_COMPLETED: 10,
        QUALITY_TARGET_MET: 15,
        SLA_MET: 20,
        PERFECT_WEEK: 50,
        MONTHLY_TARGET_ACHIEVED: 100,
        HELPING_COLLEAGUE: 5,
        PROCESS_IMPROVEMENT: 25
    },

    // Achievement Categories
    ACHIEVEMENT_CATEGORIES: {
        PRODUCTIVITY: 'Productivity',
        QUALITY: 'Quality',
        CONSISTENCY: 'Consistency',
        COLLABORATION: 'Collaboration',
        INNOVATION: 'Innovation',
        LEARNING: 'Learning'
    },

    // Badge Rarity
    BADGE_RARITY: {
        COMMON: 'Common',
        RARE: 'Rare',
        EPIC: 'Epic',
        LEGENDARY: 'Legendary'
    },

    // Level Calculation
    XP_PER_LEVEL: 100,
    MAX_LEVEL: 100
};

// SLA Constants
export const SLA_CONSTANTS = {
    // Default SLA Times (in hours)
    DEFAULT_SLA: {
        AR_CALLING: 48,
        MEDICAL_CODING: 24,
        PRIOR_AUTH: 72,
        DENIAL_MANAGEMENT: 48,
        PATIENT_REGISTRATION: 4,
        INSURANCE_VERIFICATION: 24,
        PAYMENT_POSTING: 24,
        CLAIMS_PROCESSING: 24
    },

    // SLA Status
    SLA_STATUS: {
        ON_TRACK: 'On Track',
        AT_RISK: 'At Risk',
        BREACHED: 'Breached',
        RESOLVED: 'Resolved'
    },

    // Warning Thresholds (percentage of time remaining)
    WARNING_THRESHOLDS: {
        GREEN: 50, // Above 50% time remaining
        YELLOW: 25, // 25-50% time remaining
        RED: 0 // Below 25% time remaining
    }
};

// Quality Assurance Constants
export const QA_CONSTANTS = {
    // QA Status
    QA_STATUS: {
        PENDING: 'Pending',
        IN_REVIEW: 'In Review',
        PASSED: 'Passed',
        FAILED: 'Failed',
        RESUBMITTED: 'Resubmitted'
    },

    // Error Categories
    ERROR_CATEGORIES: {
        CLINICAL: 'Clinical',
        ADMINISTRATIVE: 'Administrative',
        TECHNICAL: 'Technical',
        COMPLIANCE: 'Compliance',
        DOCUMENTATION: 'Documentation'
    },

    // Severity Levels
    SEVERITY_LEVELS: {
        CRITICAL: 'Critical',
        MAJOR: 'Major',
        MINOR: 'Minor',
        COSMETIC: 'Cosmetic'
    },

    // Quality Thresholds
    QUALITY_THRESHOLDS: {
        EXCELLENT: 95,
        GOOD: 90,
        SATISFACTORY: 85,
        NEEDS_IMPROVEMENT: 80,
        UNSATISFACTORY: 0
    }
};

// Report Types
export const REPORT_TYPES = {
    PRODUCTIVITY: 'Productivity Report',
    QUALITY: 'Quality Report',
    SLA_COMPLIANCE: 'SLA Compliance Report',
    REVENUE: 'Revenue Report',
    CLIENT_PERFORMANCE: 'Client Performance Report',
    EMPLOYEE_PERFORMANCE: 'Employee Performance Report',
    OPERATIONAL: 'Operational Report'
};

// Time Zones
export const TIME_ZONES = {
    EST: 'Eastern Standard Time',
    CST: 'Central Standard Time',
    MST: 'Mountain Standard Time',
    PST: 'Pacific Standard Time',
    GMT: 'Greenwich Mean Time',
    IST: 'India Standard Time'
};

// Currencies
export const CURRENCIES = {
    USD: 'US Dollar',
    INR: 'Indian Rupee',
    EUR: 'Euro',
    GBP: 'British Pound',
    CAD: 'Canadian Dollar',
    AED: 'UAE Dirham'
};

// Payment Terms
export const PAYMENT_TERMS = {
    NET_15: 'Net 15',
    NET_30: 'Net 30',
    NET_45: 'Net 45',
    NET_60: 'Net 60',
    DUE_ON_RECEIPT: 'Due on Receipt'
};

// Billing Models
export const BILLING_MODELS = {
    PER_TRANSACTION: 'Per Transaction',
    HOURLY: 'Hourly',
    MONTHLY_FIXED: 'Monthly Fixed',
    PERCENTAGE: 'Percentage',
    FTE: 'Full Time Equivalent'
};

// Integration Types
export const INTEGRATION_TYPES = {
    PMS_SOFTWARE: [
        'Epic',
        'Cerner',
        'Allscripts',
        'eClinicalWorks',
        'Medisoft',
        'AdvancedMD',
        'NextGen',
        'Kareo',
        'Other',
        'None'
    ],
    DATA_FORMATS: [
        'Excel',
        'CSV',
        'XML',
        'JSON',
        'HL7',
        'EDI',
        'API'
    ],
    AUTH_METHODS: [
        'API Key',
        'OAuth',
        'Basic Auth',
        'Token'
    ]
};

// Claim Status
export const CLAIM_STATUS = {
    NEW: 'New',
    IN_PROGRESS: 'In Progress',
    PENDING: 'Pending',
    SUBMITTED: 'Submitted',
    PAID: 'Paid',
    DENIED: 'Denied',
    APPEALED: 'Appealed',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled'
};

// Work Location Types
export const WORK_LOCATIONS = {
    OFFICE: 'Office',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid'
};

// Employment Types
export const EMPLOYMENT_TYPES = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    INTERN: 'Intern',
    CONSULTANT: 'Consultant',
    TEMPORARY: 'Temporary'
};

// Default Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// API Rate Limiting
export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // requests per window
    MESSAGE: 'Too many requests from this IP, please try again later'
};

// Session Configuration
export const SESSION_CONFIG = {
    EMPLOYEE_SESSION_DURATION: 12 * 60 * 60 * 1000, // 12 hours
    COMPANY_SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000 // 30 days
};