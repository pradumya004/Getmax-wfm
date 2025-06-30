import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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
        process.env.JWT_SECRET || 'GetMax_4893_Heatlcare_839_solutions_4338',
        { expiresIn: "7d" }
    );
};

// add time .....