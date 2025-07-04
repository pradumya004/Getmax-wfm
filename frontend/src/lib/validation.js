// frontend/src/lib/validation.js  
import { isValidEmail } from './utils';

export const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
};

export const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Please enter a valid email';
    return null;
};

export const validatePhone = (phone) => {
    if (!phone) return null; // Optional field
    const phoneRegex = /^[+]?([1-9][\d]{0,15})$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
        return 'Please enter a valid phone number';
    }
    return null;
};

export const validateForm = (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const value = data[field];
        const rule = rules[field];

        if (rule.required) {
            const error = validateRequired(value, rule.label || field);
            if (error) errors[field] = error;
        }

        if (rule.type === 'email' && value) {
            const error = validateEmail(value);
            if (error) errors[field] = error;
        }

        if (rule.type === 'phone' && value) {
            const error = validatePhone(value);
            if (error) errors[field] = error;
        }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
};