// frontend/src/pages/client/client.constants.js

// Client Types
export const CLIENT_TYPES = [
    "Healthcare Provider",
    "Hospital System",
    "Medical Group",
    "Clinic",
    "Specialty Practice",
    "Billing Company",
    "Insurance Company",
    "Other"
];

// Client Sub-Types based on Client Type
export const CLIENT_SUBTYPES = {
    "Healthcare Provider": [
        "Solo Practice",
        "Group Practice",
        "Multi-Specialty",
        "Urgent Care",
        "Ambulatory Surgery Center"
    ],
    "Hospital System": [
        "Academic Medical Center",
        "Community Hospital",
        "Critical Access Hospital",
        "Specialty Hospital",
        "Health System"
    ],
    "Medical Group": [
        "Primary Care",
        "Specialty Care",
        "Multi-Specialty Group",
        "Physician-Hospital Organization"
    ],
    "Clinic": [
        "Outpatient Clinic",
        "Specialty Clinic",
        "Urgent Care Clinic",
        "Retail Clinic"
    ],
    "Specialty Practice": [
        "Cardiology",
        "Orthopedics",
        "Dermatology",
        "Gastroenterology",
        "Neurology",
        "Oncology",
        "Radiology",
        "Pathology",
        "Anesthesiology",
        "Other Specialty"
    ],
    "Billing Company": [
        "Revenue Cycle Management",
        "Medical Billing Service",
        "Claims Processing",
        "Denial Management"
    ],
    "Insurance Company": [
        "Health Insurance",
        "Workers Compensation",
        "Auto Insurance",
        "Other Insurance"
    ],
    "Other": [
        "Government Entity",
        "Non-Profit Organization",
        "Technology Company",
        "Consulting Firm"
    ]
};

// Status Options
export const STATUS_OPTIONS = [
    "Prospect",
    "Active",
    "Inactive",
    "Suspended",
    "Terminated",
    "Under Review"
];

// Onboarding Status Options
export const ONBOARDING_STATUS_OPTIONS = [
    "Not Started",
    "Documentation Pending",
    "Technical Setup",
    "Testing Phase",
    "Training Phase",
    "Go Live",
    "Completed"
];

// Workflow Types
export const WORKFLOW_TYPES = [
    "Manual Only",
    "API Integration Only",
    "SFTP Integration",
    "Hybrid Integration"
];

// EHR/PM Systems
export const EHR_SYSTEMS = [
    "Epic",
    "Cerner",
    "Allscripts",
    "eClinicalWorks",
    "NextGen",
    "Athenahealth",
    "Practice Fusion",
    "Greenway Health",
    "Meditech",
    "GE Healthcare",
    "Sage Intergy",
    "Amazing Charts",
    "DrChrono",
    "Kareo",
    "AdvancedMD",
    "CureMD",
    "Praxis",
    "Aprima",
    "ChartLogic",
    "Lytec",
    "MedEZ",
    "Optum",
    "Vitera",
    "Other",
    "None"
];

// Payment Terms
export const PAYMENT_TERMS = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due on Receipt",
    "Custom"
];

// Currencies
export const CURRENCIES = [
    "USD",
    "INR",
    "EUR",
    "GBP",
    "CAD",
    "AUD"
];

// Countries (formatted as objects for consistency)
export const COUNTRIES = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "IN", label: "India" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "NL", label: "Netherlands" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "CH", label: "Switzerland" },
    { value: "AT", label: "Austria" },
    { value: "BE", label: "Belgium" },
    { value: "LU", label: "Luxembourg" },
    { value: "IE", label: "Ireland" },
    { value: "PT", label: "Portugal" },
    { value: "GR", label: "Greece" },
    { value: "CZ", label: "Czech Republic" },
    { value: "PL", label: "Poland" },
    { value: "HU", label: "Hungary" },
    { value: "SK", label: "Slovakia" },
    { value: "SI", label: "Slovenia" },
    { value: "HR", label: "Croatia" },
    { value: "RO", label: "Romania" },
    { value: "BG", label: "Bulgaria" },
    { value: "LT", label: "Lithuania" },
    { value: "LV", label: "Latvia" },
    { value: "EE", label: "Estonia" },
    { value: "MT", label: "Malta" },
    { value: "CY", label: "Cyprus" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "CN", label: "China" },
    { value: "SG", label: "Singapore" },
    { value: "HK", label: "Hong Kong" },
    { value: "TW", label: "Taiwan" },
    { value: "MY", label: "Malaysia" },
    { value: "TH", label: "Thailand" },
    { value: "PH", label: "Philippines" },
    { value: "ID", label: "Indonesia" },
    { value: "VN", label: "Vietnam" },
    { value: "BR", label: "Brazil" },
    { value: "MX", label: "Mexico" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "CO", label: "Colombia" },
    { value: "PE", label: "Peru" },
    { value: "VE", label: "Venezuela" },
    { value: "UY", label: "Uruguay" },
    { value: "PY", label: "Paraguay" },
    { value: "BO", label: "Bolivia" },
    { value: "EC", label: "Ecuador" },
    { value: "GY", label: "Guyana" },
    { value: "SR", label: "Suriname" },
    { value: "GF", label: "French Guiana" },
    { value: "ZA", label: "South Africa" },
    { value: "EG", label: "Egypt" },
    { value: "NG", label: "Nigeria" },
    { value: "KE", label: "Kenya" },
    { value: "GH", label: "Ghana" },
    { value: "MA", label: "Morocco" },
    { value: "TN", label: "Tunisia" },
    { value: "DZ", label: "Algeria" },
    { value: "LY", label: "Libya" },
    { value: "SD", label: "Sudan" },
    { value: "ET", label: "Ethiopia" },
    { value: "UG", label: "Uganda" },
    { value: "TZ", label: "Tanzania" },
    { value: "ZW", label: "Zimbabwe" },
    { value: "BW", label: "Botswana" },
    { value: "NA", label: "Namibia" },
    { value: "SZ", label: "Swaziland" },
    { value: "LS", label: "Lesotho" },
    { value: "MZ", label: "Mozambique" },
    { value: "MG", label: "Madagascar" },
    { value: "MU", label: "Mauritius" },
    { value: "SC", label: "Seychelles" },
    { value: "RE", label: "Reunion" },
    { value: "YT", label: "Mayotte" },
    { value: "KM", label: "Comoros" },
    { value: "RU", label: "Russia" },
    { value: "UA", label: "Ukraine" },
    { value: "BY", label: "Belarus" },
    { value: "MD", label: "Moldova" },
    { value: "GE", label: "Georgia" },
    { value: "AM", label: "Armenia" },
    { value: "AZ", label: "Azerbaijan" },
    { value: "KZ", label: "Kazakhstan" },
    { value: "KG", label: "Kyrgyzstan" },
    { value: "TJ", label: "Tajikistan" },
    { value: "TM", label: "Turkmenistan" },
    { value: "UZ", label: "Uzbekistan" },
    { value: "MN", label: "Mongolia" },
    { value: "TR", label: "Turkey" },
    { value: "IL", label: "Israel" },
    { value: "PS", label: "Palestine" },
    { value: "JO", label: "Jordan" },
    { value: "LB", label: "Lebanon" },
    { value: "SY", label: "Syria" },
    { value: "IQ", label: "Iraq" },
    { value: "IR", label: "Iran" },
    { value: "AF", label: "Afghanistan" },
    { value: "PK", label: "Pakistan" },
    { value: "BD", label: "Bangladesh" },
    { value: "LK", label: "Sri Lanka" },
    { value: "MV", label: "Maldives" },
    { value: "BT", label: "Bhutan" },
    { value: "NP", label: "Nepal" },
    { value: "MM", label: "Myanmar" },
    { value: "KH", label: "Cambodia" },
    { value: "LA", label: "Laos" },
    { value: "BN", label: "Brunei" },
    { value: "TL", label: "Timor-Leste" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "QA", label: "Qatar" },
    { value: "BH", label: "Bahrain" },
    { value: "KW", label: "Kuwait" },
    { value: "OM", label: "Oman" },
    { value: "YE", label: "Yemen" },
    { value: "NZ", label: "New Zealand" },
    { value: "FJ", label: "Fiji" },
    { value: "PG", label: "Papua New Guinea" },
    { value: "NC", label: "New Caledonia" },
    { value: "VU", label: "Vanuatu" },
    { value: "SB", label: "Solomon Islands" },
    { value: "WS", label: "Samoa" },
    { value: "TO", label: "Tonga" },
    { value: "TV", label: "Tuvalu" },
    { value: "KI", label: "Kiribati" },
    { value: "NR", label: "Nauru" },
    { value: "PW", label: "Palau" },
    { value: "FM", label: "Micronesia" },
    { value: "MH", label: "Marshall Islands" },
    { value: "CK", label: "Cook Islands" },
    { value: "NU", label: "Niue" },
    { value: "TK", label: "Tokelau" },
    { value: "WF", label: "Wallis and Futuna" },
    { value: "PF", label: "French Polynesia" },
    { value: "AS", label: "American Samoa" },
    { value: "GU", label: "Guam" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "VI", label: "U.S. Virgin Islands" },
    { value: "PR", label: "Puerto Rico" },
    { value: "Other", label: "Other" }
];

// Billing Frequency
export const BILLING_FREQUENCY = [
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Quarterly",
    "Annually"
];

// Timezones
export const TIMEZONES = [
    { value: "EST", label: "Eastern Standard Time (EST)" },
    { value: "CST", label: "Central Standard Time (CST)" },
    { value: "MST", label: "Mountain Standard Time (MST)" },
    { value: "PST", label: "Pacific Standard Time (PST)" },
    { value: "IST", label: "India Standard Time (IST)" },
    { value: "GMT", label: "Greenwich Mean Time (GMT)" },
    { value: "CET", label: "Central European Time (CET)" },
    { value: "JST", label: "Japan Standard Time (JST)" },
    { value: "AEST", label: "Australian Eastern Standard Time (AEST)" }
];

// Working Days
export const WORKING_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

// Allowed File Formats
export const ALLOWED_FILE_FORMATS = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "csv",
    "txt",
    "xml",
    "json",
    "edi",
    "hl7",
    "zip",
    "rar"
];

// Authentication Methods
export const AUTH_METHODS = [
    "API Key",
    "OAuth 2.0",
    "Basic Authentication",
    "Bearer Token",
    "JWT Token",
    "Certificate-based",
    "SAML",
    "Custom"
];

// Service Types
export const SERVICE_TYPES = [
    "Revenue Cycle Management",
    "Medical Coding",
    "Claims Processing",
    "Denial Management",
    "Patient Collections",
    "Credentialing",
    "Consulting",
    "Full Service",
    "Prior Authorization",
    "Eligibility Verification",
    "Payment Posting",
    "Charge Entry",
    "AR Follow-up",
    "Reporting & Analytics"
];

// Compliance Requirements
export const COMPLIANCE_REQUIREMENTS = [
    "HIPAA",
    "SOX",
    "HITECH",
    "PCI DSS",
    "ISO 27001",
    "SOC 2",
    "GDPR",
    "CCPA",
    "PIPEDA",
    "Other"
];

// Invoice Formats
export const INVOICE_FORMATS = [
    "PDF",
    "Excel",
    "CSV",
    "XML",
    "JSON",
    "EDI"
];

// Sync Frequencies
export const SYNC_FREQUENCIES = [
    "Real-time",
    "Every 15 minutes",
    "Every 30 minutes",
    "Hourly",
    "Every 2 hours",
    "Every 4 hours",
    "Every 6 hours",
    "Every 12 hours",
    "Daily",
    "Weekly",
    "Monthly",
    "Manual"
];

// File Processing Statuses
export const FILE_PROCESSING_STATUSES = [
    "Pending",
    "Processing",
    "Completed",
    "Failed",
    "Rejected",
    "Partially Processed"
];

// Integration Statuses
export const INTEGRATION_STATUSES = [
    "Not Configured",
    "Configured",
    "Testing",
    "Active",
    "Inactive",
    "Error",
    "Maintenance"
];