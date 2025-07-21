// backend/src/models/core/patient.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { SPECIALTY_TYPES } from '../../constants.js';

// Eligibility History Schema 
const eligibilityHistorySchema = new mongoose.Schema({
    verificationId: {
        type: String,
        default: () => `ELG-${uuidv4().substring(0, 8).toUpperCase()}`,
        index: true
    },
    verificationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    payerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer',
        required: true
    },
    verificationMethod: {
        type: String,
        enum: ['Phone', 'Web Portal', 'EDI 270/271', 'API', 'Manual'],
        default: 'EDI 270/271'
    },
    verificationStatus: {
        type: String,
        enum: ['Verified', 'Not Verified', 'Pending', 'Error', 'Expired'],
        required: true
    },
    eligibilityDetails: {
        isActive: Boolean,
        effectiveDate: Date,
        terminationDate: Date,
        planName: String,
        planType: String,
        groupNumber: String,
        memberNumber: String,
        subscriberName: String,
        relationshipToSubscriber: {
            type: String,
            enum: ['Self', 'Spouse', 'Child', 'Other']
        }
    },
    benefitDetails: {
        deductible: {
            individual: Number,
            family: Number,
            met: Number,
            remaining: Number
        },
        copay: {
            primaryCare: Number,
            specialist: Number,
            emergencyRoom: Number,
            urgentCare: Number
        },
        coinsurance: {
            inNetwork: Number,
            outOfNetwork: Number
        },
        outOfPocketMax: {
            individual: Number,
            family: Number,
            met: Number,
            remaining: Number
        },
        priorAuthRequired: Boolean,
        referralRequired: Boolean,
        precertificationRequired: Boolean
    },
    coverageDetails: {
        medicalCoverage: Boolean,
        prescriptionCoverage: Boolean,
        mentalHealthCoverage: Boolean,
        visionCoverage: Boolean,
        dentalCoverage: Boolean,
        chiropracticCoverage: Boolean,
        physicalTherapyCoverage: Boolean
    },
    verificationNotes: String,
    responseData: {
        rawResponse: String, // Store raw EDI 271 or API response
        responseCode: String,
        errorMessage: String,
        transactionId: String
    },
    nextVerificationDate: Date,
    isExpired: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Authorization History Schema 
const authorizationHistorySchema = new mongoose.Schema({
    authorizationId: {
        type: String,
        default: () => `AUTH-${uuidv4().substring(0, 8).toUpperCase()}`,
        unique: true,
        index: true
    },
    requestDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    payerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer',
        required: true
    },
    authorizationType: {
        type: String,
        enum: ['Prior Authorization', 'Precertification', 'Referral', 'Notification'],
        required: true
    },
    serviceDetails: {
        serviceType: String,
        cptCodes: [String],
        icdCodes: [String],
        serviceDescription: String,
        requestedUnits: Number,
        approvedUnits: Number,
        dateOfService: Date,
        placeOfService: String,
        renderingProvider: {
            name: String,
            npi: String,
            taxonomy: String
        }
    },
    authorizationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Denied', 'Partial Approval', 'Expired', 'Cancelled'],
        required: true,
        default: 'Pending'
    },
    authorizationNumber: String,
    approvedDetails: {
        approvalDate: Date,
        effectiveDate: Date,
        expirationDate: Date,
        approvedUnits: Number,
        usedUnits: {
            type: Number,
            default: 0
        },
        remainingUnits: Number,
        limitations: String,
        conditions: String
    },
    denialDetails: {
        denialDate: Date,
        denialReason: String,
        denialCode: String,
        appealDeadline: Date,
        appealFiled: {
            type: Boolean,
            default: false
        },
        appealDate: Date,
        appealOutcome: String
    },
    communicationLog: [{
        date: Date,
        method: {
            type: String,
            enum: ['Phone', 'Fax', 'Email', 'Web Portal', 'EDI']
        },
        direction: {
            type: String,
            enum: ['Inbound', 'Outbound']
        },
        summary: String,
        contactPerson: String,
        followUpRequired: Boolean,
        followUpDate: Date
    }],
    documents: [{
        documentType: String,
        documentName: String,
        filePath: String,
        uploadDate: Date,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],
    notes: String,
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { _id: false });

// Main Patient Schema (PRESERVING ALL FIELDS + ENHANCEMENTS)
const patientSchema = new mongoose.Schema({
    // PATIENT ID (PRESERVED EXACTLY)
    patientId: {
        type: String,
        unique: true,
        default: () => `PAT-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // MAIN RELATIONSHIPS (PRESERVED EXACTLY)
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

    // PERSONAL INFORMATION (PRESERVED EXACTLY)
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
                validator: function (v) {
                    return v <= new Date();
                },
                message: 'Date of birth cannot be in the future'
            },
            index: true
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: ['M', 'F', 'O', 'U'], // Male, Female, Other, Unknown
            index: true
        },
        race: {
            type: String,
            enum: [
                'American Indian or Alaska Native',
                'Asian',
                'Black or African American',
                'Native Hawaiian or Other Pacific Islander',
                'White',
                'Other',
                'Unknown',
                'Declined to Answer'
            ],
            default: 'Unknown'
        },
        ethnicity: {
            type: String,
            enum: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Unknown', 'Declined to Answer'],
            default: 'Unknown'
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Unknown'],
            default: 'Unknown'
        },
        ssn: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^\d{3}-\d{2}-\d{4}$/.test(v);
                },
                message: 'SSN must be in XXX-XX-XXXX format'
            },
            select: false // Don't return SSN in queries by default for security
        },
        language: {
            primaryLanguage: {
                type: String,
                default: 'English'
            },
            interpreterNeeded: {
                type: Boolean,
                default: false
            },
            preferredLanguages: [String]
        }
    },

    // CONTACT INFORMATION (PRESERVED EXACTLY)
    contactInfo: {
        address: {
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
                    validator: function (v) {
                        return !v || /^\d{5}(-\d{4})?$/.test(v);
                    },
                    message: 'Invalid ZIP code format'
                }
            },
            country: {
                type: String,
                default: 'United States'
            }
        },
        phone: {
            home: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                    },
                    message: 'Invalid phone number format'
                }
            },
            mobile: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                    },
                    message: 'Invalid mobile number format'
                }
            },
            work: {
                type: String,
                trim: true
            }
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Invalid email format'
            }
        },
        preferredContactMethod: {
            type: String,
            enum: ['Phone', 'Email', 'Text', 'Mail', 'No Contact'],
            default: 'Phone'
        },
        bestTimeToCall: {
            type: String,
            enum: ['Morning', 'Afternoon', 'Evening', 'Anytime'],
            default: 'Anytime'
        }
    },

    // INSURANCE INFORMATION
    insuranceInfo: {
        primaryInsurance: {
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer',
                index: true
            },
            memberId: {
                type: String,
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
                enum: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Other']
            },
            effectiveDate: Date,
            expirationDate: Date,
            subscriberInfo: {
                isSubscriber: {
                    type: Boolean,
                    default: true
                },
                subscriberName: {
                    firstName: String,
                    lastName: String,
                    middleName: String
                },
                subscriberDateOfBirth: Date,
                subscriberSSN: {
                    type: String,
                    select: false
                },
                relationshipToPatient: {
                    type: String,
                    enum: ['Self', 'Spouse', 'Child', 'Parent', 'Other'],
                    default: 'Self'
                }
            },
            coordinationOfBenefits: {
                type: String,
                enum: ['Primary', 'Secondary', 'Tertiary'],
                default: 'Primary'
            },
            copayAmount: {
                type: Number,
                min: [0, 'Copay cannot be negative']
            },
            deductibleAmount: {
                type: Number,
                min: [0, 'Deductible cannot be negative']
            },
            coinsurancePercentage: {
                type: Number,
                min: [0, 'Coinsurance cannot be negative'],
                max: [100, 'Coinsurance cannot exceed 100%']
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

    // MEDICAL INFORMATION
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
                    validator: function (v) {
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

    // FINANCIAL INFORMATION
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

    // CARE TEAM & PROVIDERS
    careTeam: {
        primaryCarePhysician: {
            name: String,
            npi: {
                type: String,
                validate: {
                    validator: function (v) {
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

    // ACTIVITY & ENGAGEMENT
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
            receiveMarketingMaterial: {
                type: Boolean,
                default: false
            },
            preferredCommunicationTime: {
                type: String,
                enum: ['Morning', 'Afternoon', 'Evening'],
                default: 'Morning'
            }
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters']
        }
    },

    // ELIGIBILITY HISTORY
    eligibilityHistory: [eligibilityHistorySchema],

    // AUTHORIZATION HISTORY
    authorizationHistory: [authorizationHistorySchema],

    // CONSENT & PRIVACY
    consentAndPrivacy: {
        hipaaAuthorizationSigned: {
            type: Boolean,
            default: false,
            required: true
        },
        hipaaAuthorizationDate: Date,
        consentToTreat: {
            type: Boolean,
            default: false,
            required: true
        },
        consentToTreatDate: Date,
        financialResponsibilityAcknowledged: {
            type: Boolean,
            default: false
        },
        financialResponsibilityDate: Date,
        allowEmailCommunication: {
            type: Boolean,
            default: true
        },
        allowTextCommunication: {
            type: Boolean,
            default: false
        },
        allowPhoneCommunication: {
            type: Boolean,
            default: true
        },
        dataRetentionConsent: {
            type: Boolean,
            default: true
        },
        thirdPartyDisclosureConsent: {
            type: Boolean,
            default: false
        },
        consentDocuments: [{
            documentType: String,
            signedDate: Date,
            documentPath: String,
            version: String
        }]
    },

    //SYSTEM INFO
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        dataSource: {
            type: String,
            enum: ['Manual Entry', 'Import', 'API', 'EHR Integration', 'Registration System'],
            default: 'Manual Entry'
        },
        duplicateChecksum: {
            type: String,
            index: true // For duplicate detection
        },
        migrationInfo: {
            sourceSystem: String,
            migrationDate: Date,
            migrationBatch: String,
            validationStatus: {
                type: String,
                enum: ['Pending', 'Validated', 'Issues Found'],
                default: 'Pending'
            }
        }
    },

    // AUDIT INFO
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
        accessLog: [{
            accessedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            accessTime: {
                type: Date,
                default: Date.now
            },
            action: {
                type: String,
                enum: ['View', 'Edit', 'Export', 'Print', 'Download'],
                required: true
            },
            ipAddress: String,
            reason: String
        }],
        changeHistory: [{
            modifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            modifiedAt: {
                type: Date,
                default: Date.now
            },
            changeType: {
                type: String,
                enum: ['Created', 'Updated', 'Status Changed', 'Archived', 'Merged'],
                required: true
            },
            changedFields: [String],
            oldValues: mongoose.Schema.Types.Mixed,
            newValues: mongoose.Schema.Types.Mixed,
            reason: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// INDEXES
patientSchema.index({ companyRef: 1, clientRef: 1 });
patientSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
patientSchema.index({ 'personalInfo.dateOfBirth': 1 });
patientSchema.index({ 'personalInfo.externalPatientId': 1 });
patientSchema.index({ 'insuranceInfo.primaryInsurance.memberId': 1 });
patientSchema.index({ 'financialInfo.financialClass': 1 });
patientSchema.index({ 'activityInfo.patientStatus': 1 });
patientSchema.index({ 'systemInfo.duplicateChecksum': 1 });
patientSchema.index({ 'eligibilityHistory.verificationDate': -1 });
patientSchema.index({ 'authorizationHistory.authorizationStatus': 1 });
patientSchema.index({ 'authorizationHistory.expirationDate': 1 });

// VIRTUAL FIELDS
patientSchema.virtual('fullName').get(function () {
    const { firstName, middleName, lastName, suffix } = this.personalInfo;
    let fullName = firstName;
    if (middleName) fullName += ` ${middleName}`;
    fullName += ` ${lastName}`;
    if (suffix) fullName += ` ${suffix}`;
    return fullName;
});

patientSchema.virtual('age').get(function () {
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

patientSchema.virtual('primaryInsurance').get(function () {
    return this.insuranceInfo.primaryInsurance;
});

patientSchema.virtual('hasActiveInsurance').get(function () {
    return this.insuranceInfo.primaryInsurance.isActive ||
        this.insuranceInfo.secondaryInsurance?.isActive;
});

patientSchema.virtual('fullAddress').get(function () {
    const addr = this.contactInfo.address;
    if (!addr.street) return '';
    return `${addr.street}, ${addr.city || ''} ${addr.state || ''} ${addr.zipCode || ''}`.trim();
});

// RCM VIRTUAL FIELDS
patientSchema.virtual('latestEligibilityVerification').get(function () {
    if (!this.eligibilityHistory || this.eligibilityHistory.length === 0) return null;
    return this.eligibilityHistory
        .sort((a, b) => new Date(b.verificationDate) - new Date(a.verificationDate))[0];
});

patientSchema.virtual('activeAuthorizations').get(function () {
    if (!this.authorizationHistory) return [];
    const now = new Date();
    return this.authorizationHistory.filter(auth =>
        auth.authorizationStatus === 'Approved' &&
        auth.isActive &&
        (!auth.approvedDetails?.expirationDate || auth.approvedDetails.expirationDate > now)
    );
});

patientSchema.virtual('expiringAuthorizations').get(function () {
    if (!this.authorizationHistory) return [];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return this.authorizationHistory.filter(auth =>
        auth.authorizationStatus === 'Approved' &&
        auth.isActive &&
        auth.approvedDetails?.expirationDate &&
        auth.approvedDetails.expirationDate <= thirtyDaysFromNow &&
        auth.approvedDetails.expirationDate > new Date()
    );
});

patientSchema.virtual('needsEligibilityVerification').get(function () {
    const latest = this.latestEligibilityVerification;
    if (!latest) return true;

    const daysSinceVerification = Math.floor(
        (new Date() - new Date(latest.verificationDate)) / (1000 * 60 * 60 * 24)
    );

    return daysSinceVerification > 30 || latest.verificationStatus !== 'Verified';
});

// STATIC METHODS
patientSchema.statics.findActivePatients = function (companyRef, clientRef = null) {
    const filter = {
        companyRef,
        'systemInfo.isActive': true,
        'activityInfo.patientStatus': 'Active'
    };
    if (clientRef) filter.clientRef = clientRef;

    return this.find(filter)
        .populate('clientRef', 'clientInfo.clientName')
        .sort({ 'personalInfo.lastName': 1, 'personalInfo.firstName': 1 });
};

patientSchema.statics.findByInsurance = function (companyRef, payerRef) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        $or: [
            { 'insuranceInfo.primaryInsurance.payerRef': payerRef },
            { 'insuranceInfo.secondaryInsurance.payerRef': payerRef }
        ]
    });
};

patientSchema.statics.findDuplicates = function (firstName, lastName, dateOfBirth) {
    return this.find({
        'personalInfo.firstName': new RegExp(`^${firstName}$`, 'i'),
        'personalInfo.lastName': new RegExp(`^${lastName}$`, 'i'),
        'personalInfo.dateOfBirth': dateOfBirth,
        'systemInfo.isActive': true
    });
};

// RCM STATIC METHODS
patientSchema.statics.findNeedingEligibilityVerification = function (companyRef, clientRef = null) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filter = {
        companyRef,
        'systemInfo.isActive': true,
        'activityInfo.patientStatus': 'Active',
        $or: [
            { 'insuranceInfo.eligibilityLastVerified': { $lt: thirtyDaysAgo } },
            { 'insuranceInfo.eligibilityLastVerified': { $exists: false } },
            { 'insuranceInfo.eligibilityStatus': { $in: ['Failed', 'Expired', 'Not Checked'] } }
        ]
    };

    if (clientRef) filter.clientRef = clientRef;
    return this.find(filter);
};

patientSchema.statics.findWithExpiringAuthorizations = function (companyRef, daysAhead = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'authorizationHistory': {
            $elemMatch: {
                'authorizationStatus': 'Approved',
                'isActive': true,
                'approvedDetails.expirationDate': { $lte: targetDate, $gte: new Date() }
            }
        }
    });
};

// INSTANCE METHODS
patientSchema.methods.isPatientActive = function () {
    return this.systemInfo.isActive && this.activityInfo.patientStatus === 'Active';
};

patientSchema.methods.generateDuplicateChecksum = function () {
    const data = `${this.personalInfo.firstName.toLowerCase()}_${this.personalInfo.lastName.toLowerCase()}_${this.personalInfo.dateOfBirth.toISOString().split('T')[0]}`;
    return crypto.createHash('md5').update(data).digest('hex');
};

patientSchema.methods.getInsuranceForPayer = function (payerRef) {
    if (this.insuranceInfo.primaryInsurance.payerRef?.equals(payerRef)) {
        return { type: 'primary', insurance: this.insuranceInfo.primaryInsurance };
    }
    if (this.insuranceInfo.secondaryInsurance?.payerRef?.equals(payerRef)) {
        return { type: 'secondary', insurance: this.insuranceInfo.secondaryInsurance };
    }
    return null;
};

// RCM INSTANCE METHODS 
patientSchema.methods.addEligibilityVerification = function (verificationData) {
    if (!this.eligibilityHistory) this.eligibilityHistory = [];

    const verification = {
        ...verificationData,
        verificationDate: new Date()
    };

    this.eligibilityHistory.push(verification);

    // Update insurance info with latest verification
    if (verification.verificationStatus === 'Verified') {
        this.insuranceInfo.eligibilityLastVerified = verification.verificationDate;
        this.insuranceInfo.eligibilityStatus = 'Verified';
    } else {
        this.insuranceInfo.eligibilityStatus = verification.verificationStatus;
    }

    return verification;
};

patientSchema.methods.addAuthorization = function (authorizationData) {
    if (!this.authorizationHistory) this.authorizationHistory = [];

    const authorization = {
        ...authorizationData,
        requestDate: new Date()
    };

    this.authorizationHistory.push(authorization);
    return authorization;
};

patientSchema.methods.updateAuthorizationStatus = function (authorizationId, statusData) {
    const auth = this.authorizationHistory?.find(a => a.authorizationId === authorizationId);
    if (auth) {
        Object.assign(auth, statusData);
        return auth;
    }
    return null;
};

patientSchema.methods.getActiveAuthorizationFor = function (serviceType, cptCode = null) {
    if (!this.authorizationHistory) return null;

    const now = new Date();
    return this.authorizationHistory.find(auth =>
        auth.authorizationStatus === 'Approved' &&
        auth.isActive &&
        (!auth.approvedDetails?.expirationDate || auth.approvedDetails.expirationDate > now) &&
        (auth.serviceDetails?.serviceType === serviceType ||
            (cptCode && auth.serviceDetails?.cptCodes?.includes(cptCode)))
    );
};

// PRE-SAVE MIDDLEWARE
patientSchema.pre('save', function (next) {
    // Generate duplicate checksum for new patients
    if (this.isNew) {
        this.systemInfo.duplicateChecksum = this.generateDuplicateChecksum();
    }

    // Update lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.systemInfo.lastModifiedAt = new Date();
    }

    // Validate insurance effective dates
    if (this.insuranceInfo.primaryInsurance.effectiveDate &&
        this.insuranceInfo.primaryInsurance.expirationDate) {
        if (this.insuranceInfo.primaryInsurance.effectiveDate >=
            this.insuranceInfo.primaryInsurance.expirationDate) {
            return next(new Error('Insurance effective date must be before expiration date'));
        }
    }

    // Update authorization remaining units
    if (this.authorizationHistory) {
        this.authorizationHistory.forEach(auth => {
            if (auth.approvedDetails && auth.approvedDetails.approvedUnits) {
                auth.approvedDetails.remainingUnits =
                    auth.approvedDetails.approvedUnits - (auth.approvedDetails.usedUnits || 0);
            }
        });
    }

    next();
});

// POST-SAVE MIDDLEWARE
patientSchema.post('save', function (doc, next) {
    // Could trigger eligibility verification, authorization checks, etc.
    next();
});

export const Patient = mongoose.model('Patient', patientSchema, 'patients');