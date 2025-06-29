import jwt from 'jsonwebtoken';

export const generateCompanyToken = (companyId) => {
    return jwt.sign(
        { id: companyId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const createToken = (company) => {
    return jwt.sign(
        { id: company._id, email: company.contactEmail, Name: company.companyName },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};