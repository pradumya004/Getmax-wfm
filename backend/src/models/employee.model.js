import mongoose from "mongoose";

// Business Schema
// const businessSchema = new mongoose.Schema({
//     startTime: {
//         type: String,
//         default: '09:00',
//         match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (e.g. - 09:00, 21:05, etc.)']
//     },
//     endTime: {
//         type: String,
//         default: '17:00',
//         match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (e.g. - 09:00, 21:05, etc.)']
//     },
//     workingDays: {
//         type: [String],
//         enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//         default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//     }
// }, { _id: false });

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
