import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    empID: {
        type: Number,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'],
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    DOB: {
        type: Date,
    },
    DOJ: {
        type: Date,
        required: true
    },
    employeeType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Intern', 'Contractor', 'Freelancer'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'terminated', 'on-leave'],
        default: 'active'
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Employee = mongoose.model('employees', employeeSchema);

export default Employee;
