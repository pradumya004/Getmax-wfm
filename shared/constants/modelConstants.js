// shared/constants/modelConstants.js

// USE THIS IN BOTH FRONTEND & BACKEND TO AVOID DUPLICATION

export const COMPANY_CONSTANTS = {
    SUBSCRIPTION_PLANS: ['Trial', 'Basic', 'Professional', 'Enterprise'],
    SUBSCRIPTION_STATUS: ['Active', 'Suspended', 'Inactive', 'Terminated'],
    PAYMENT_STATUS: ['Paid', 'Pending', 'Overdue', 'Failed'],
    TIME_ZONES: ['IST', 'EST', 'CST', 'MST', 'PST', 'GMT'],
    CURRENCIES: ['USD', 'INR', 'EUR', 'GBP', 'CAD'],
    COUNTRIES: ['India', 'United States', 'Canada', 'United Kingdom'],
    COMPANY_SIZES: ['1-10', '10-50', '50-200', '200-500', '500+'],

    CLIENT_TYPES: [
        { value: "Billing Company", label: "Billing Company", description: "Direct billing services" },
        { value: "Provider", label: "Healthcare Provider", description: "Medical service provider" },
        { value: "Insurance", label: "Insurance Company", description: "Insurance services" },
        { value: "Third Party", label: "Third Party", description: "Third-party services" },
        { value: "Others", label: "Others", description: "Other client types" },
    ],

    CONTRACT_TYPES: [
        { value: "End to End", label: "End to End", description: "Complete service delivery" },
        { value: "Transactional", label: "Transactional", description: "Per-transaction basis" },
        { value: "FTE", label: "Full-Time Equivalent", description: "Dedicated resources" },
        { value: "Hybrid", label: "Hybrid", description: "Mixed service model" },
        { value: "Consulting", label: "Consulting", description: "Advisory services" },
        { value: "Project Based", label: "Project Based", description: "Specific project delivery" },
    ],

    SPECIALTY_TYPES: [
        { value: "Primary Care", label: "Primary Care", description: "General healthcare" },
        { value: "Specialty Care", label: "Specialty Care", description: "Specialized medical care" },
        { value: "Dental", label: "Dental", description: "Dental services" },
        { value: "Vision", label: "Vision", description: "Eye care services" },
        { value: "Mental Health", label: "Mental Health", description: "Psychological services" },
        { value: "Surgery Centers", label: "Surgery Centers", description: "Surgical procedures" },
        { value: "Hospitals", label: "Hospitals", description: "Hospital services" },
        { value: "Labs", label: "Labs", description: "Laboratory services" },
        { value: "Multi Specialty", label: "Multi Specialty", description: "Multiple specialties" },
        { value: "DME", label: "DME", description: "Durable Medical Equipment" },
    ],

    SCOPE_FORMATS: [
        { value: "ClaimMD", label: "ClaimMD", description: "ClaimMD format" },
        { value: "Medisoft", label: "Medisoft", description: "Medisoft system" },
        { value: "Epic", label: "Epic", description: "Epic EHR system" },
        { value: "Cerner", label: "Cerner", description: "Cerner platform" },
        { value: "Custom", label: "Custom", description: "Custom format" },
        { value: "HL7", label: "HL7", description: "HL7 standards" },
    ],

    SERVICE_AREAS: [
        { value: "Claims Processing", label: "Claims Processing", description: "Medical claims processing" },
        { value: "Prior Authorization", label: "Prior Authorization", description: "Pre-approval services" },
        { value: "Eligibility Verification", label: "Eligibility Verification", description: "Insurance verification" },
        { value: "Denial Management", label: "Denial Management", description: "Claim denial handling" },
        { value: "Payment Posting", label: "Payment Posting", description: "Payment processing" },
        { value: "AR Follow-up", label: "AR Follow-up", description: "Accounts receivable" },
        { value: "Credentialing", label: "Credentialing", description: "Provider credentialing" },
        { value: "Coding Services", label: "Coding Services", description: "Medical coding" },
    ],
};

export const ROLE_CONSTANTS = {
    PERMISSION_LEVELS: ["None", "View", "Create", "Manage", "Full"],
    CLAIM_PERMISSIONS: ["None", "ViewOwn", "ViewTeam", "ViewAll", "Assign", "Manage", "Full"],
    REPORT_PERMISSIONS: ["None", "View", "Create", "Export", "Full"],
    DATA_RESTRICTIONS: ["All", "Assigned", "None"],
    REPORT_SCOPES: ["Company", "Team", "Self"],
    ROLE_LEVELS: { MIN: 1, MAX: 10 }
};

export const CLAIM_CONSTANTS = {
    CLAIM_TYPES: [
        'Professional', 'Institutional', 'Dental', 'Vision',
        'DME', 'Pharmacy', 'Behavioral Health', 'Other'
    ],
    CLAIM_STATUS: ['New', 'In Progress', 'Completed', 'Denied', 'Pending'],
    PRIORITY_LEVELS: ['Low', 'Normal', 'High', 'Critical']
};

export const EMPLOYEE_CONSTANTS = {
    EMPLOYMENT_TYPES: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    EMPLOYEE_STATUS: ['Active', 'Inactive', 'Terminated', 'On Leave'],
    FUNCTION_TYPES: ["Operational", "Support", "Administrative", "Technical", "Quality", "Training", "Research", "Development"],
    WORK_TYPES: ["Production", "Support", "Quality Control", "Training", "Administrative", "Research"],
    TERMINATION_TYPES: ["Voluntary", "Retirement", "Contract End", "Layoff"],
    GENDER_OPTIONS: ["Male", "Female", "Other", "Prefer not to say"],
    BLOOD_GROUPS: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
};

// VALIDATION PATTERNS
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_US: /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    PHONE_IN: /^(\+91|91)?[6-9]\d{9}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// VALIDATION MESSAGES
export const VALIDATION_MESSAGES = {
    REQUIRED: (field) => `${field} is required`,
    EMAIL_INVALID: 'Please enter a valid email address',
    PHONE_INVALID: 'Invalid phone number format',
    PASSWORD_WEAK: 'Password must contain uppercase, lowercase, number and special character',
    MAX_LENGTH: (field, max) => `${field} cannot exceed ${max} characters`,
    MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
    MIN_VALUE: (field, min) => `${field} must be at least ${min}`,
    MAX_VALUE: (field, max) => `${field} cannot exceed ${max}`
};

// AUTO-GENERATE FIELD OPTIONS FOR FRONTEND DROPDOWNS
export const getFieldOptions = (constantArray) => {
    return constantArray.map(value => ({ label: value, value }));
};

// EXPORT FOR MONGOOSE SCHEMAS
export const getEnumValidator = (constantArray, fieldName) => ({
    enum: {
        values: constantArray,
        message: `{VALUE} is not a valid ${fieldName}`
    }
});