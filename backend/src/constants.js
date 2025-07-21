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

// Hardcoded master admin token
export const MASTER_ADMIN_CREDENTIALS = {
    email: "sriram@getmaxsolutions.com",
    password: "Sriram_1234",
    name: "Sriram",
    role: "MASTER_ADMIN"
};

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

// User Role Levels
export const USER_ROLE_LEVELS = {
    AGENT: 1,
    JUNIOR_STAFF: 2,
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
    PERFORMANCE_REPORT: 'performance_report',
    // NEW RCM EMAIL TEMPLATES
    CLAIM_DENIAL_ALERT: 'claim_denial_alert',
    AUTHORIZATION_EXPIRY: 'authorization_expiry',
    ERA_POSTING_COMPLETE: 'era_posting_complete',
    QA_REVIEW_FAILED: 'qa_review_failed',
    AR_AGING_ALERT: 'ar_aging_alert',
    WORKFLOW_ESCALATION: 'workflow_escalation',
    CLEARINGHOUSE_ERROR: 'clearinghouse_error'
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
    RCM: 'Revenue Cycle Management',
    // NEW DETAILED RCM SERVICES
    ELIGIBILITY_VERIFICATION: 'Eligibility Verification',
    BENEFITS_VERIFICATION: 'Benefits Verification',
    CHARGE_ENTRY: 'Charge Entry',
    CLAIM_SCRUBBING: 'Claim Scrubbing',
    EDI_MANAGEMENT: 'EDI Management',
    ERA_PROCESSING: 'ERA Processing',
    COLLECTIONS: 'Collections',
    REPORTING_ANALYTICS: 'Reporting & Analytics'
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
        PROCESS_IMPROVEMENT: 25,
        // NEW RCM REWARDS
        CLAIM_SUBMISSION: 15,
        DENIAL_OVERTURNED: 30,
        ERA_PROCESSED: 10,
        ELIGIBILITY_VERIFIED: 8,
        AUTH_OBTAINED: 25,
        PAYMENT_POSTED: 12,
        AR_COLLECTED: 20,
        CLEAN_CLAIM_RATE_90_PLUS: 40,
        ZERO_DENIALS_DAY: 60,
        CODING_ACCURACY_100: 50
    },

    // Achievement Categories
    ACHIEVEMENT_CATEGORIES: {
        PRODUCTIVITY: 'Productivity',
        QUALITY: 'Quality',
        CONSISTENCY: 'Consistency',
        COLLABORATION: 'Collaboration',
        INNOVATION: 'Innovation',
        LEARNING: 'Learning',
        // NEW RCM CATEGORIES
        CLAIMS_EXCELLENCE: 'Claims Excellence',
        DENIAL_MANAGEMENT: 'Denial Management',
        CODING_MASTERY: 'Coding Mastery',
        AR_CHAMPION: 'AR Champion',
        WORKFLOW_OPTIMIZER: 'Workflow Optimizer'
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
        CLAIMS_PROCESSING: 24,
        // NEW RCM SLAs
        ELIGIBILITY_VERIFICATION: 2,
        CLAIM_SUBMISSION: 8,
        ERA_PROCESSING: 4,
        DENIAL_APPEAL: 72,
        COLLECTIONS_FOLLOWUP: 48,
        CODING_REVIEW: 12,
        QA_REVIEW: 24,
        CLEARINGHOUSE_SUBMISSION: 1
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
        RESUBMITTED: 'Resubmitted',
        // NEW RCM QA STATUS
        CALIBRATION: 'Calibration',
        DISPUTE: 'Dispute',
        APPROVED_WITH_NOTES: 'Approved with Notes',
        TRAINING_REQUIRED: 'Training Required'
    },

    // Error Categories
    ERROR_CATEGORIES: {
        CLINICAL: 'Clinical',
        ADMINISTRATIVE: 'Administrative',
        TECHNICAL: 'Technical',
        COMPLIANCE: 'Compliance',
        DOCUMENTATION: 'Documentation',
        // NEW RCM ERROR CATEGORIES
        CODING_ERROR: 'Coding Error',
        BILLING_ERROR: 'Billing Error',
        INSURANCE_ERROR: 'Insurance Error',
        DEMOGRAPHIC_ERROR: 'Demographic Error',
        AUTHORIZATION_ERROR: 'Authorization Error',
        SUBMISSION_ERROR: 'Submission Error'
    },

    // Severity Levels
    SEVERITY_LEVELS: {
        CRITICAL: 'Critical',
        MAJOR: 'Major',
        MINOR: 'Minor',
        COSMETIC: 'Cosmetic',
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

// ==========================================================
// RCM CONSTANTS
// ==========================================================

// EDI Constants
export const EDI_CONSTANTS = {
    // Transaction Types
    TRANSACTION_TYPES: {
        EDI_270: 'Eligibility Inquiry',
        EDI_271: 'Eligibility Response',
        EDI_276: 'Claim Status Inquiry',
        EDI_277: 'Claim Status Response',
        EDI_835: 'ERA - Payment/Remittance',
        EDI_837P: 'Professional Claims',
        EDI_837I: 'Institutional Claims',
        EDI_837D: 'Dental Claims',
        EDI_278: 'Authorization Request/Response',
        EDI_999: 'Functional Acknowledgment',
        EDI_997: 'Functional Acknowledgment'
    },

    // EDI Status
    EDI_STATUS: {
        CREATED: 'Created',
        VALIDATED: 'Validated',
        QUEUED: 'Queued',
        TRANSMITTED: 'Transmitted',
        ACKNOWLEDGED: 'Acknowledged',
        ACCEPTED: 'Accepted',
        REJECTED: 'Rejected',
        ERROR: 'Error',
        RESUBMITTED: 'Resubmitted'
    },

    // Clearinghouse Names
    CLEARINGHOUSES: {
        AVAILITY: 'Availity',
        CHANGE_HEALTHCARE: 'Change Healthcare',
        RELAY_HEALTH: 'RelayHealth',
        TRIZETTO: 'Trizetto',
        OFFICE_ALLY: 'Office Ally',
        NAVICURE: 'Navicure',
        ATHENA_COLLECTOR: 'athenaCollector',
        NEXTGEN: 'NextGen',
        ALLMEDS: 'AllMeds',
        CLAIMMD: 'ClaimMD'
    },

    // File Formats
    FILE_FORMATS: {
        X12: 'X12',
        CSV: 'CSV',
        EXCEL: 'Excel',
        PDF: 'PDF',
        TEXT: 'Text',
        XML: 'XML'
    }
};

// Workflow Status
export const WORKFLOW_STATUS = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    PENDING_REVIEW: 'Pending Review',
    ON_HOLD: 'On Hold',
    ESCALATED: 'Escalated',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    FAILED: 'Failed',
    REWORK_REQUIRED: 'Rework Required'
};

// Claim Status
export const CLAIM_STATUS = {
    DRAFT: 'Draft',
    READY_FOR_SUBMISSION: 'Ready for Submission',
    SUBMITTED: 'Submitted',
    ACKNOWLEDGED: 'Acknowledged',
    IN_PROCESS: 'In Process',
    PAID: 'Paid',
    DENIED: 'Denied',
    PENDING: 'Pending',
    PARTIAL_PAID: 'Partial Paid',
    APPEALED: 'Appealed',
    VOIDED: 'Voided',
    REJECTED: 'Rejected'
};

// Denial Reasons
export const DENIAL_REASONS = {
    // Administrative Denials
    MISSING_INFORMATION: 'Missing Information',
    INVALID_MEMBER_ID: 'Invalid Member ID',
    DUPLICATE_CLAIM: 'Duplicate Claim',
    UNTIMELY_FILING: 'Untimely Filing',
    MISSING_AUTHORIZATION: 'Missing Authorization',
    INVALID_PROVIDER_ID: 'Invalid Provider ID',

    // Clinical Denials
    MEDICAL_NECESSITY: 'Medical Necessity',
    EXPERIMENTAL_INVESTIGATIONAL: 'Experimental/Investigational',
    NON_COVERED_SERVICE: 'Non-Covered Service',
    INCORRECT_DIAGNOSIS: 'Incorrect Diagnosis',
    MISSING_DOCUMENTATION: 'Missing Documentation',

    // Technical Denials
    INCORRECT_BILLING_CODE: 'Incorrect Billing Code',
    INVALID_DATE_OF_SERVICE: 'Invalid Date of Service',
    INCORRECT_MODIFIER: 'Incorrect Modifier',
    BUNDLING_ISSUE: 'Bundling Issue',
    COORDINATION_OF_BENEFITS: 'Coordination of Benefits'
};

// Adjustment Codes
export const ADJUSTMENT_CODES = {
    // Contractual Adjustments
    CO_45: 'Contractual Adjustment',
    CO_97: 'Payment Included in Previous Payment',
    CO_16: 'Claim Lacks Information',

    // Patient Responsibility
    PR_1: 'Deductible Amount',
    PR_2: 'Coinsurance Amount',
    PR_3: 'Copayment Amount',

    // Other Adjustments
    OA_23: 'Impact of Prior Payer Adjudication',
    PI_72: 'Sequestration Reduction',

    // Reversal/Correction
    CR_REVERSAL: 'Credit Reversal',
    LATE_FILING: 'Late Filing Penalty'
};

// Financial Constants
export const FINANCIAL_CONSTANTS = {
    // Payment Types
    PAYMENT_TYPES: {
        CHECK: 'Check',
        ACH: 'ACH/Wire Transfer',
        CREDIT_CARD: 'Credit Card',
        CASH: 'Cash',
        PATIENT_PAYMENT: 'Patient Payment',
        INSURANCE_PAYMENT: 'Insurance Payment',
        REFUND: 'Refund',
        ADJUSTMENT: 'Adjustment'
    },

    // AR Aging Buckets
    AR_AGING_BUCKETS: {
        CURRENT: '0-30 Days',
        BUCKET_31_60: '31-60 Days',
        BUCKET_61_90: '61-90 Days',
        BUCKET_91_120: '91-120 Days',
        BUCKET_120_PLUS: '120+ Days'
    },

    // Collection Actions
    COLLECTION_ACTIONS: {
        FIRST_NOTICE: 'First Notice Sent',
        SECOND_NOTICE: 'Second Notice Sent',
        PHONE_CALL: 'Phone Call Made',
        FINAL_NOTICE: 'Final Notice Sent',
        COLLECTION_AGENCY: 'Sent to Collection Agency',
        LEGAL_ACTION: 'Legal Action Initiated',
        WRITE_OFF: 'Written Off',
        PAYMENT_PLAN: 'Payment Plan Established'
    }
};

// Report Types (ENHANCED)
export const REPORT_TYPES = {
    PRODUCTIVITY: 'Productivity Report',
    QUALITY: 'Quality Report',
    SLA_COMPLIANCE: 'SLA Compliance Report',
    REVENUE: 'Revenue Report',
    CLIENT_PERFORMANCE: 'Client Performance Report',
    EMPLOYEE_PERFORMANCE: 'Employee Performance Report',
    OPERATIONAL: 'Operational Report',
    // NEW RCM REPORTS
    CLAIMS_AGING: 'Claims Aging Report',
    DENIAL_ANALYSIS: 'Denial Analysis Report',
    ERA_SUMMARY: 'ERA Summary Report',
    COLLECTIONS_REPORT: 'Collections Report',
    AUTHORIZATION_REPORT: 'Authorization Report',
    CLEAN_CLAIM_RATE: 'Clean Claim Rate Report',
    WORKFLOW_PERFORMANCE: 'Workflow Performance Report',
    FINANCIAL_SUMMARY: 'Financial Summary Report'
};

// Priority Levels
export const PRIORITY_LEVELS = {
    EMERGENCY: 'Emergency',
    CRITICAL: 'Critical',
    HIGH: 'High',
    NORMAL: 'Normal',
    LOW: 'Low'
};

// Notification Types (ENHANCED)
export const NOTIFICATION_TYPES = {
    // Existing
    SYSTEM_ALERT: 'System Alert',
    TASK_ASSIGNMENT: 'Task Assignment',
    DEADLINE_REMINDER: 'Deadline Reminder',
    ACHIEVEMENT_UNLOCKED: 'Achievement Unlocked',
    // NEW RCM NOTIFICATIONS
    CLAIM_DENIAL: 'Claim Denial',
    SLA_BREACH: 'SLA Breach',
    AUTHORIZATION_EXPIRY: 'Authorization Expiry',
    PAYMENT_RECEIVED: 'Payment Received',
    ERA_PROCESSED: 'ERA Processed',
    WORKFLOW_ESCALATION: 'Workflow Escalation',
    QA_REVIEW_REQUIRED: 'QA Review Required',
    CLEARINGHOUSE_ERROR: 'Clearinghouse Error'
};

// Integration Types
export const INTEGRATION_TYPES = {
    EHR: 'Electronic Health Record',
    PRACTICE_MANAGEMENT: 'Practice Management',
    CLEARINGHOUSE: 'Clearinghouse',
    BANK: 'Banking/Payment',
    PAYER: 'Insurance Payer',
    CREDIT_BUREAU: 'Credit Bureau',
    COLLECTION_AGENCY: 'Collection Agency'
};

// API Constants
export const API_CONSTANTS = {
    // Rate Limiting
    RATE_LIMITS: {
        STANDARD: 100, // requests per minute
        PREMIUM: 500,
        ENTERPRISE: 1000
    },

    // Response Codes
    RESPONSE_CODES: {
        SUCCESS: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        VALIDATION_ERROR: 422,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    }
};