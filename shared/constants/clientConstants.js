// shared/constants/clientConstants.js

export const ONBOARDING_STATUS_PROGRESS = {
    'Not Started': 0,
    'Documentation Pending': 20,
    'Technical Setup': 40,
    'Testing Phase': 60,
    'Training Phase': 80,
    'Go Live': 90,
    'Completed': 100
};

// By exporting the keys, you can also ensure consistent usage of status names
export const ONBOARDING_STATUSES = Object.keys(ONBOARDING_STATUS_PROGRESS);