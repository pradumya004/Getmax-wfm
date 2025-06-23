import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';


const companySettingsSchema = new mongoose.Schema({
    timeZone:{
        type: String,
        default: 'Indian Mumbai (IST)',
    },
    businessStartHour: {
        type: Date,
    },
    businessEndHour: {
        type: Date,
    },
    workingDays: {
        type: Number,
        default: 5,
    },
    currency:{
        type: String,
        default: 'INR',
    }
    
}, {timestamps: true});

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);


const companySchema = new mongoose.Schema({
    companyID: {
        type: String,
        default: () => `COMP-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyOwnerName: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type:String,
    },
    ownerPhone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'],
        required: true,
    },
    billingContactName : {
        type: String,
        required: true,
    },
    billingEmail : {
        type: String,
        required: true,
        unique: true,
    },
    billingAddress : {
        type: String,
        required: true,
    },
    taxID : {
        type: String,
        required: true,
    },
    website : {
        type: String,
    },
    companySize : {
        type: Number,
    },
    industryType : {
        type: String,
    },
    clientType : {
        type: Enumerator(['Billing Company', 'Provider', 'Softwre Vendor', 'Consulting Firm']),
    },
    contractType : {
        type: Enumerator(['End to End', 'Transactional', 'FTE', 'Hybrid', 'Consulting']),
        required: true,
    },
    scopeFormatID : {
        type: String,
    },
    status : {
        type: Enumerator(['active', 'inactive', 'pending', 'suspended', 'terminated']),
        default: 'active',
    },
    timeZone:{
        type: String,
        default: 'Indian Mumbai (IST)',
    },
    companySettings : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanySettings',
        required: true,
    },
    
}, {timestamps: true});



companySchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

companySchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw Error('Error comparing passwords');
}
};


const Company = mongoose.model("companies", companySchema);

export default Company;