// shared/constants/wfmConstants.js

// Central definition for all possible Service Types
export const SERVICE_TYPES = [
    "AR Calling",
    "Medical Coding",
    "Prior Authorization",
    "Eligibility Verification",
    "Denial Management",
    "Charge Entry",
    "Payment Posting",
    "Quality Assurance",
    "Custom Service",
    'Patient Registration',
    'Insurance Verification'
    // Add any new service types here in the future
];

// Central definition for all possible Client Types
export const CLIENT_TYPES = [
    'Hospital',
    'Private Practice',
    'Clinic',
    'Billing Agency',
    'Specialty Group'
    // Add any new client types here
];

// Central definition for all Compliance Document types
export const COMPLIANCE_DOCUMENT_TYPES = [
    'HIPAA BAA',
    'Master Service Agreement',
    'NDA',
    'Service Level Agreement'
    // Add any new document types here
];

// Central definition for all Clearinghouses
export const CLEARINGHOUSES = [
    'Availity',
    'Change Healthcare',
    'RelayHealth',
    'Trizetto',
    'Office Ally',
    'Navicure',
    'athenaCollector',
    'NextGen',
    'AllMeds',
    'ClaimMD',
    'Other'
];