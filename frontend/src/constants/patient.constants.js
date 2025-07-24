// frontend/src/components/constants/patient.constants.js

// Based on the patient.model.js schema
const mapToOptions = (arr) => arr.map(item => ({ value: item, label: item }));

export const GENDERS = mapToOptions([
    'Male', 
    'Female', 
    'Other', 
    'Unknown'
]); //

export const SUBSCRIBER_RELATIONSHIPS = mapToOptions([
    'Self',
    'Spouse',
    'Child',
    'Other'
]); //

export const FINANCIAL_CLASSES = mapToOptions([
    'Commercial',
    'Medicare',
    'Medicaid',
    'Self Pay',
    'Workers Comp',
    'Other'
]); //

export const PATIENT_STATUSES = mapToOptions([
    'Active',
    'Inactive',
    'Deceased',
    'Moved',
    'Transferred'
]); //