// backend/src/models/patient-model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true,
        default: () => `PAT-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },
    
    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company managing this patient
        required: [true, 'Company reference is required'],
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client who treats this patient
        required: [true, 'Client reference is required'],
        index: true
    },

    // ** PERSONAL INFORMATION **
    personalInfo: {
        // External patient ID from client's system
        externalPatientId: {
            type: String,
            trim: true,
            index: true
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        middleName: {
            type: String,
            trim: true,
            maxlength: [50, 'Middle name cannot exceed 50 characters']
        },
        suffix: {
            type: String,
            trim: true,
            enum: ['Jr', 'Sr', 'II', 'III', 'IV', ''],
            default: ''
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function(v) {
                    return v <= new Date();
                },
                message: 'Date of birth cannot be in the future'
            },
            index: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Unknown'],
            required: [true, 'Gender is required']
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Unknown'],
            default: 'Unknown'
        },
        socialSecurityNumber: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\d{3}-\d{2}-\d{4}$/.test(v);
                },
                message: 'SSN must be in XXX-XX-XXXX format'
            },
            select: false // Never return in queries for security
        },
        // Encrypted SSN for security
        encryptedSSN: {
            type: String,
            select: false
        }
    },

    // ** CONTACT INFORMATION **
    contactInfo: {
        primaryPhone: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                },
                message: 'Invalid phone number format'
            }
        },
        secondaryPhone: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                },
                message: 'Invalid phone number format'
            }
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Invalid email format'
            }
        },
        preferredContactMethod: {
            type: String,
            enum: ['Phone', 'Email', 'Mail', 'Text', 'No Contact'],
            default: 'Phone'
        },
        bestTimeToCall: {
            type: String,
            enum: ['Morning', 'Afternoon', 'Evening', 'Anytime'],
            default: 'Anytime'
        }
    },

    // ** ADDRESS INFORMATION **
    addressInfo: {
        homeAddress: {
            street: {
                type: String,
                trim: true,
                maxlength: [200, 'Street address cannot exceed 200 characters']
            },
            city: {
                type: String,
                trim: true,
                maxlength: [100, 'City cannot exceed 100 characters']
            },
            state: {
                type: String,
                trim: true,
                maxlength: [50, 'State cannot exceed 50 characters']
            },
            zipCode: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^\d{5}(-\d{4})?$/.test(v);
                    },
                    message: 'Invalid ZIP code format'
                }
            },
            country: {
                type: String,
                trim: true,
                default: 'United States'
            }
        },
        mailingAddress: {
            sameAsHomeAddress: {
                type: Boolean,
                default: true
            },
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },

    // ** INSURANCE INFORMATION **
    insuranceInfo: {
        primaryInsurance: {
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer',
                required: [true, 'Primary insurance payer reference is required']
            },
            memberId: {
                type: String,
                required: [true, 'Member ID is required'],
                trim: true,
                index: true
            },
            groupNumber: {
                type: String,
                trim: true
            },
            planName: {
                type: String,
                trim: true
            },
            planType: {
                type: String,
                enum: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Other'],
                default: 'Other'
            },
            effectiveDate: {
                type: Date,
                required: [true, 'Insurance effective date is required']
            },
            expirationDate: {
                type: Date,
                validate: {
                    validator: function(v) {
                        return !v || v > this.insuranceInfo.primaryInsurance.effectiveDate;
                    },
                    message: 'Expiration date must be after effective date'
                }
            },
            copay: {
                type: Number,
                min: [0, 'Copay cannot be negative'],
                default: 0
            },
            deductible: {
                type: Number,
                min: [0, 'Deductible cannot be negative'],
                default: 0
            },
            deductibleMet: {
                type: Number,
                min: [0, 'Deductible met cannot be negative'],
                default: 0
            },
            coinsurancePercentage: {
                type: Number,
                min: [0, 'Coinsurance percentage cannot be negative'],
                max: [100, 'Coinsurance percentage cannot exceed 100'],
                default: 20
            },
            outOfPocketMax: {
                type: Number,
                min: [0, 'Out of pocket max cannot be negative'],
                default: 0
            },
            outOfPocketMet: {
                type: Number,
                min: [0, 'Out of pocket met cannot be negative'],
                default: 0
            },
            subscriberRelationship: {
                type: String,
                enum: ['Self', 'Spouse', 'Child', 'Other'],
                required: [true, 'Subscriber relationship is required'],
                default: 'Self'
            },
            subscriberInfo: {
                name: String,
                dateOfBirth: Date,
                ssn: {
                    type: String,
                    select: false
                }
            },
            isActive: {
                type: Boolean,
                default: true,
                index: true
            }
        },
        secondaryInsurance: {
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer'
            },
            memberId: String,
            groupNumber: String,
            planName: String,
            planType: {
                type: String,
                enum: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Other']
            },
            effectiveDate: Date,
            expirationDate: Date,
            subscriberRelationship: {
                type: String,
                enum: ['Self', 'Spouse', 'Child', 'Other']
            },
            coordinationOfBenefits: {
                type: String,
                enum: ['Primary', 'Secondary', 'Tertiary'],
                default: 'Secondary'
            },
            isActive: {
                type: Boolean,
                default: false
            }
        },
        priorAuthRequired: {
            type: Boolean,
            default: false
        },
        eligibilityLastVerified: {
            type: Date,
            index: true
        },
        eligibilityStatus: {
            type: String,
            enum: ['Verified', 'Pending', 'Failed', 'Expired', 'Not Checked'],
            default: 'Not Checked',
            index: true
        },
        eligibilityNotes: {
            type: String,
            trim: true
        }
    },

    // ** MEDICAL INFORMATION **
    medicalInfo: {
        allergies: [{
            allergen: {
                type: String,
                trim: true,
                required: true
            },
            reaction: {
                type: String,
                trim: true
            },
            severity: {
                type: String,
                enum: ['Mild', 'Moderate', 'Severe', 'Unknown'],
                default: 'Unknown'
            }
        }],
        medications: [{
            medicationName: {
                type: String,
                trim: true,
                required: true
            },
            dosage: {
                type: String,
                trim: true
            },
            frequency: {
                type: String,
                trim: true
            },
            prescribedBy: {
                type: String,
                trim: true
            },
            startDate: Date,
            endDate: Date
        }],
        medicalHistory: [{
            condition: {
                type: String,
                trim: true,
                required: true
            },
            icdCode: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^[A-Z]\d{2}(\.\d{1,3})?$/.test(v);
                    },
                    message: 'Invalid ICD-10 code format'
                }
            },
            diagnosedDate: Date,
            status: {
                type: String,
                enum: ['Active', 'Resolved', 'Chronic', 'Unknown'],
                default: 'Unknown'
            },
            notes: String
        }],
        emergencyContact: {
            name: {
                type: String,
                trim: true
            },
            relationship: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                trim: true
            },
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String
            }
        }
    },

    // ** FINANCIAL INFORMATION **
    financialInfo: {
        employmentStatus: {
            type: String,
            enum: ['Employed', 'Unemployed', 'Retired', 'Disabled', 'Student', 'Other'],
            default: 'Other'
        },
        employer: {
            name: String,
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String
            },
            phone: String
        },
        financialClass: {
            type: String,
            enum: ['Commercial', 'Medicare', 'Medicaid', 'Self Pay', 'Workers Comp', 'Other'],
            required: [true, 'Financial class is required'],
            index: true
        },
        creditScore: {
            type: Number,
            min: [300, 'Credit score cannot be less than 300'],
            max: [850, 'Credit score cannot exceed 850']
        },
        paymentHistory: {
            totalPaid: {
                type: Number,
                default: 0,
                min: [0, 'Total paid cannot be negative']
            },
            totalOwed: {
                type: Number,
                default: 0,
                min: [0, 'Total owed cannot be negative']
            },
            lastPaymentDate: Date,
            lastPaymentAmount: {
                type: Number,
                default: 0
            },
            paymentPlan: {
                isActive: {
                    type: Boolean,
                    default: false
                },
                monthlyAmount: Number,
                startDate: Date,
                endDate: Date,
                remainingBalance: Number
            }
        }
    },

    // ** CARE TEAM & PROVIDERS **
    careTeam: {
        primaryCarePhysician: {
            name: String,
            npi: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || /^\d{10}$/.test(v);
                    },
                    message: 'NPI must be 10 digits'
                }
            },
            phone: String,
            specialty: String
        },
        referringPhysician: {
            name: String,
            npi: String,
            phone: String,
            specialty: String
        },
        specialists: [{
            name: String,
            npi: String,
            specialty: {
                type: String,
                required: true
            },
            phone: String,
            lastVisitDate: Date
        }]
    },

    // ** ACTIVITY & ENGAGEMENT **
    activityInfo: {
        totalClaims: {
            type: Number,
            default: 0,
            min: [0, 'Total claims cannot be negative']
        },
        totalClaimValue: {
            type: Number,
            default: 0,
            min: [0, 'Total claim value cannot be negative']
        },
        lastVisitDate: {
            type: Date,
            index: true
        },
        lastClaimDate: {
            type: Date,
            index: true
        },
        avgClaimsPerMonth: {
            type: Number,
            default: 0,
            min: [0, 'Average claims per month cannot be negative']
        },
        patientStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Deceased', 'Moved', 'Transferred'],
            default: 'Active',
            index: true
        },
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Low'
        },
        communicationPreferences: {
            receiveReminders: {
                type: Boolean,
                default: true
            },
            receiveStatements: {
                type: Boolean,
                default: true
            },
            receiveMarketing: {
                type: Boolean,
                default: false
            },
            preferredLanguage: {
                type: String,
                default: 'English'
            }
        }
    },

    // ** DATA SOURCE & INTEGRATION **
    sourceInfo: {
        dataSource: {
            type: String,
            enum: ['Manual Entry', 'EHR Sync', 'Registration Form', 'API Import', 'SFTP', 'Other'],
            required: [true, 'Data source is required'],
            default: 'Manual Entry'
        },
        sourceSystemId: {
            type: String,
            trim: true
        },
        lastSyncDate: {
            type: Date,
            index: true
        },
        syncStatus: {
            type: String,
            enum: ['Synced', 'Pending', 'Failed', 'Manual'],
            default: 'Manual'
        },
        importBatchId: {
            type: String,
            trim: true
        }
    },

    // ** COMPLIANCE & PRIVACY **
    complianceInfo: {
        hipaaAuthorization: {
            signed: {
                type: Boolean,
                default: false
            },
            signedDate: Date,
            expirationDate: Date
        },
        consentToTreat: {
            signed: {
                type: Boolean,
                default: false
            },
            signedDate: Date
        },
        financialResponsibility: {
            acknowledged: {
                type: Boolean,
                default: false
            },
            acknowledgedDate: Date
        },
        privacyNotice: {
            provided: {
                type: Boolean,
                default: false
            },
            providedDate: Date,
            acknowledgementReceived: {
                type: Boolean,
                default: false
            }
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isTestPatient: {
            type: Boolean,
            default: false,
            index: true
        },
        isDuplicate: {
            type: Boolean,
            default: false,
            index: true
        },
        duplicateCheckSum: {
            type: String,
            trim: true,
            index: true
        },
        dataQualityScore: {
            type: Number,
            min: [0, 'Data quality score cannot be negative'],
            max: [100, 'Data quality score cannot exceed 100'],
            default: 0
        },
        lastDataQualityCheck: Date,
        mergeCandidates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        }]
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Created by reference is required']
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        lastVerifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastVerifiedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
patientSchema.index({ companyRef: 1, clientRef: 1 });
patientSchema.index({ 'personalInfo.lastName': 1, 'personalInfo.firstName': 1 });
patientSchema.index({ 'personalInfo.dateOfBirth': 1 });
patientSchema.index({ 'insuranceInfo.primaryInsurance.memberId': 1 });
patientSchema.index({ 'financialInfo.financialClass': 1 });
patientSchema.index({ 'activityInfo.patientStatus': 1 });

// Compound indexes
patientSchema.index({
    'personalInfo.lastName': 1,
    'personalInfo.firstName': 1,
    'personalInfo.dateOfBirth': 1
});

patientSchema.index({
    clientRef: 1,
    'systemInfo.isActive': 1,
    'activityInfo.patientStatus': 1
});

// ** VIRTUAL FIELDS **
patientSchema.virtual('fullName').get(function() {
    const { firstName, middleName, lastName, suffix } = this.personalInfo;
    let name = `${firstName} ${lastName}`;
    if (middleName) name = `${firstName} ${middleName} ${lastName}`;
    if (suffix) name += ` ${suffix}`;
    return name;
});

patientSchema.virtual('age').get(function() {
    if (!this.personalInfo.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.personalInfo.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

patientSchema.virtual('insuranceStatus').get(function() {
    const primary = this.insuranceInfo.primaryInsurance;
    if (!primary.isActive) return 'No Insurance';
    
    const today = new Date();
    if (primary.expirationDate && primary.expirationDate < today) {
        return 'Expired';
    }
    
    if (this.insuranceInfo.eligibilityStatus === 'Verified') {
        return 'Active - Verified';
    }
    
    return 'Active - Not Verified';
});

patientSchema.virtual('totalActiveClaims', {
    ref: 'ClaimTasks',
    localField: '_id',
    foreignField: 'patientRef',
    count: true,
    match: { 
        'workflowStatus.currentStatus': { $nin: ['Completed', 'Closed'] },
        'systemInfo.isActive': true 
    }
});

// ** STATIC METHODS **
patientSchema.statics.findByInsurance = function(payerRef, memberId) {
    return this.findOne({
        'insuranceInfo.primaryInsurance.payerRef': payerRef,
        'insuranceInfo.primaryInsurance.memberId': memberId,
        'systemInfo.isActive': true
    });
};

patientSchema.statics.findDuplicates = function(firstName, lastName, dateOfBirth) {
    return this.find({
        'personalInfo.firstName': new RegExp(firstName, 'i'),
        'personalInfo.lastName': new RegExp(lastName, 'i'),
        'personalInfo.dateOfBirth': dateOfBirth,
        'systemInfo.isActive': true
    });
};

patientSchema.statics.findExpiredInsurance = function(companyRef) {
    const today = new Date();
    return this.find({
        companyRef,
        'insuranceInfo.primaryInsurance.expirationDate': { $lt: today },
        'insuranceInfo.primaryInsurance.isActive': true,
        'systemInfo.isActive': true
    });
};

patientSchema.statics.findEligibilityNeeded = function(companyRef, daysSinceLastCheck = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastCheck);
    
    return this.find({
        companyRef,
        $or: [
            { 'insuranceInfo.eligibilityLastVerified': { $lt: cutoffDate } },
            { 'insuranceInfo.eligibilityLastVerified': null },
            { 'insuranceInfo.eligibilityStatus': 'Failed' }
        ],
        'activityInfo.patientStatus': 'Active',
        'systemInfo.isActive': true
    });
};

// ** INSTANCE METHODS **
patientSchema.methods.calculateDataQualityScore = function() {
    let score = 0;
    let maxScore = 0;
    
    // Personal info completeness (30 points)
    maxScore += 30;
    if (this.personalInfo.firstName) score += 5;
    if (this.personalInfo.lastName) score += 5;
    if (this.personalInfo.dateOfBirth) score += 10;
    if (this.personalInfo.gender) score += 5;
    if (this.personalInfo.socialSecurityNumber) score += 5;
    
    // Contact info completeness (20 points)
    maxScore += 20;
    if (this.contactInfo.primaryPhone) score += 10;
    if (this.contactInfo.email) score += 10;
    
    // Address completeness (20 points)
    maxScore += 20;
    const addr = this.addressInfo.homeAddress;
    if (addr.street && addr.city && addr.state && addr.zipCode) score += 20;
    
    // Insurance completeness (30 points)
    maxScore += 30;
    const ins = this.insuranceInfo.primaryInsurance;
    if (ins.payerRef) score += 10;
    if (ins.memberId) score += 10;
    if (ins.effectiveDate) score += 5;
    if (ins.isActive) score += 5;
    
    this.systemInfo.dataQualityScore = Math.round((score / maxScore) * 100);
    this.systemInfo.lastDataQualityCheck = new Date();
    
    return this.systemInfo.dataQualityScore;
};

patientSchema.methods.updateEligibility = function(eligibilityData) {
    this.insuranceInfo.eligibilityStatus = eligibilityData.status;
    this.insuranceInfo.eligibilityLastVerified = new Date();
    this.insuranceInfo.eligibilityNotes = eligibilityData.notes || '';
    
    if (eligibilityData.benefits) {
        const primary = this.insuranceInfo.primaryInsurance;
        if (eligibilityData.benefits.copay !== undefined) primary.copay = eligibilityData.benefits.copay;
        if (eligibilityData.benefits.deductible !== undefined) primary.deductible = eligibilityData.benefits.deductible;
        if (eligibilityData.benefits.deductibleMet !== undefined) primary.deductibleMet = eligibilityData.benefits.deductibleMet;
        if (eligibilityData.benefits.coinsurancePercentage !== undefined) primary.coinsurancePercentage = eligibilityData.benefits.coinsurancePercentage;
        if (eligibilityData.benefits.outOfPocketMax !== undefined) primary.outOfPocketMax = eligibilityData.benefits.outOfPocketMax;
        if (eligibilityData.benefits.outOfPocketMet !== undefined) primary.outOfPocketMet = eligibilityData.benefits.outOfPocketMet;
    }
};

patientSchema.methods.encryptSensitiveData = function() {
    if (this.personalInfo.socialSecurityNumber && !this.encryptedSSN) {
        // Implement encryption logic here
        const crypto = require('crypto');
        const algorithm = 'aes-256-gcm';
        const secretKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
        
        const cipher = crypto.createCipher(algorithm, secretKey);
        let encrypted = cipher.update(this.personalInfo.socialSecurityNumber, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        this.encryptedSSN = encrypted;
        this.personalInfo.socialSecurityNumber = undefined; // Remove plain text
    }
};

// ** PRE-SAVE MIDDLEWARE **
patientSchema.pre('save', function(next) {
    // Calculate data quality score
    this.calculateDataQualityScore();
    
    // Generate duplicate checksum
    if (!this.systemInfo.duplicateCheckSum) {
        const checksumData = `${this.personalInfo.firstName}-${this.personalInfo.lastName}-${this.personalInfo.dateOfBirth}`;
        this.systemInfo.duplicateCheckSum = require('crypto')
            .createHash('md5')
            .update(checksumData.toLowerCase())
            .digest('hex');
    }
    
    // Auto-set mailing address if same as home address
    if (this.addressInfo.mailingAddress.sameAsHomeAddress) {
        this.addressInfo.mailingAddress = {
            ...this.addressInfo.homeAddress,
            sameAsHomeAddress: true
        };
    }
    
    // Encrypt sensitive data
    this.encryptSensitiveData();
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

export const Patient = mongoose.model('Patient', patientSchema, 'patients');