// frontend/src/pages/client/client.constants.js

// Client Type Options
export const CLIENT_TYPES = [
    "Healthcare Provider",
    "Billing Company",
    "Hospital System",
    "Multi-Specialty Clinic",
    "Individual Practice",
    "DME Company",
    "Laboratory",
    "Dental Practice",
    "Behavioral Health",
    "Other",
];

// Client Subtype Options
export const CLIENT_SUBTYPES = {
    [CLIENT_TYPES[0]]: [
        "Clinic",
        "Hospital",
        "Specialty Practice",
        "Urgent Care",
        "Other",
    ],
    [CLIENT_TYPES[1]]: [
        "Small Practice",
        "Large Group",
        "Hospital System",
        "Specialty Focused",
        "Other",
    ],
    [CLIENT_TYPES[2]]: ["Regional", "National", "Academic", "Private", "Other"],
    [CLIENT_TYPES[3]]: [
        "Primary Care",
        "Specialty Care",
        "Mixed",
        "Other",
    ],
    [CLIENT_TYPES[4]]: ["Solo", "Small Group", "Other"],
    [CLIENT_TYPES[5]]: ["Equipment", "Supplies", "Both", "Other"],
    [CLIENT_TYPES[6]]: ["Clinical", "Pathology", "Radiology", "Other"],
    [CLIENT_TYPES[7]]: ["General", "Specialty", "Orthodontics", "Other"],
    [CLIENT_TYPES[8]]: ["Mental Health", "Substance Abuse", "Mixed", "Other"],
};

// Status Options
export const STATUS_OPTIONS = [
    { value: "Prospect", label: "Prospect" },
    { value: "Active", label: "Active" },
    { value: "On Hold", label: "On Hold" },
    { value: "Inactive", label: "Inactive" },
    { value: "Terminated", label: "Terminated" },
    { value: "Under Review", label: "Under Review" },
];

// Onboarding Status Options
export const ONBOARDING_STATUS_OPTIONS = [
    { value: "Not Started", label: "Not Started" },
    { value: "Documentation Pending", label: "Documentation Pending" },
    { value: "Technical Setup", label: "Technical Setup" },
    { value: "Testing Phase", label: "Testing Phase" },
    { value: "Training Phase", label: "Training Phase" },
    { value: "Go Live", label: "Go Live" },
    { value: "Completed", label: "Completed" },
];

// Workflow Type Options
export const WORKFLOW_TYPES = [
    "Manual Only",
    "API Integration Only",
    "SFTP Integration",
    "Hybrid Integration",
];

// EHR System Options
export const EHR_SYSTEMS = [
    "None",
    "Epic",
    "Cerner",
    "Allscripts",
    "eClinicalWorks",
    "NextGen",
    "AthenaHealth",
    "Practice Fusion",
    "Meditech",
    "Other",
];

// Payment Terms Options
export const PAYMENT_TERMS = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due on Receipt",
];

// Currency Options
export const CURRENCIES = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AED", label: "AED - UAE Dirham" },
];

// Country Options
export const COUNTRIES = [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "India", label: "India" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Other", label: "Other" },
];