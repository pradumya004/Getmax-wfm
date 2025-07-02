// backend/src/utils/jwtHelper.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Generate Company Token
export const generateCompanyToken = (companyId) => {
    return jwt.sign(
        {
            id: companyId,
            type: 'company'
        },
        JWT_SECRET,
        { expiresIn: process.env.COMPANY_TOKEN_EXPIRY || '7d' }
    );
};

// Generate Employee Token with role and company info
export const generateEmployeeToken = (payload) => {
    return jwt.sign(
        {
            employeeId: payload.employeeId,
            companyId: payload.companyId,
            role: payload.role,
            email: payload.email,
            type: 'employee'
        },
        JWT_SECRET,
        { expiresIn: process.env.EMPLOYEE_TOKEN_EXPIRY || '8h' }
    );
};

// Verify Company Token
export const verifyCompanyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'company') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Verify Employee Token
export const verifyEmployeeToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'employee') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
