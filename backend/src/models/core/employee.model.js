// backend/src/models/core/employee.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { EMPLOYEE_CONSTANTS } from "../../../../shared/constants/modelConstants.js";
import { SYSTEM_DEFAULT_TARGETS } from "../../../../shared/constants/performanceConstants.js";

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        default: () => `EMP-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Fixed: Use model name
        required: [true, 'Company reference is required'],
        index: true,
    },

    // Organizational Assignment
    roleRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Role is required'],
        index: true,
    },
    departmentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required'],
        index: true,
    },
    subdepartmentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDepartment',
        default: null
    },
    designationRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation',
        required: [true, 'Designation is required'],
        index: true
    },

    // Personal Information
    personalInfo: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        middleName: {
            type: String,
            trim: true,
            maxlength: [50, 'Middle name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        displayName: {
            type: String,
            trim: true,
            maxlength: [100, 'Display name cannot exceed 100 characters']
        },
        profilePicture: {
            type: String, // URL/path to avatar image
            default: null
        },
        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (v) {
                    return !v || v < new Date();
                },
                message: 'Date of birth cannot be in the future'
            }
        },
        gender: {
            type: String,
            enum: EMPLOYEE_CONSTANTS.GENDER_OPTIONS,
            default: "Prefer not to say"
        },
        bloodGroup: {
            type: String,
            enum: EMPLOYEE_CONSTANTS.BLOOD_GROUPS,
            trim: true,
        },
    },

    // Contact Information
    contactInfo: {
        primaryEmail: {
            type: String,
            required: [true, 'Primary email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            validate: {
                validator: function (v) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Please enter a valid email for primary email'
            }
        },
        personalEmail: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Please enter a valid email for personal email'
            }
        },
        primaryPhone: {
            type: String,
            required: [true, 'Primary phone is required'],
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return false;
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid phone number format'
            }
        },
        alternatePhone: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid alternate phone number format'
            }
        },
        emergencyContact: { // Optional
            name: {
                type: String,
                trim: true,
                maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
            },
            relationship: {
                type: String,
                trim: true,
                maxlength: [50, 'Relationship cannot exceed 50 characters']
            },
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        if (!v) return true;
                        try {
                            return isValidPhoneNumber(v, 'IN');
                        } catch (error) {
                            return false;
                        }
                    },
                    message: 'Invalid emergency contact phone number'
                }
            }
        }
    },

    // Employment Details
    employmentInfo: {
        employeeCode: {
            type: String,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Employee code cannot exceed 20 characters']
        },
        dateOfJoining: {
            type: Date,
            required: [true, 'Date of joining is required'],
            index: true
        },
        employmentType: {
            type: String,
            enum: ["Full Time", "Part Time", "Intern", "Consultant", "Temporary"],
            default: "Full Time",
            required: true
        },
        workLocation: {
            type: String,
            enum: ["Office", "Remote", "Hybrid"],
            default: "Office"
        },
        shiftType: {
            type: String,
            enum: ["Day", "Night", "Flexible"],
            default: "Day"
        }
    },

    // Reporting Structure
    reportingStructure: {
        directManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        teamLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        }
    },

    // Compensation
    compensation: {
        baseSalary: {
            type: Number,
            min: [0, 'Salary cannot be negative'],
            default: 0
        },
        hourlyRate: {
            type: Number,
            min: [0, 'Hourly rate cannot be negative']
        },
        currency: {
            type: String,
            default: "INR",
            enum: ["USD", "INR", "EUR", "GBP", "CAD", "AED"]
        },
        payFrequency: {
            type: String,
            enum: ["Weekly", "Bi-weekly", "Monthly", "Semi-monthly"],
            default: "Monthly"
        }
    },

    // Work Schedule
    workSchedule: {
        standardHours: {
            startTime: {
                type: String,
                default: "09:00",
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Start time must be in HH:MM format'
                }
            },
            endTime: {
                type: String,
                default: "17:00",
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'End time must be in HH:MM format'
                }
            },
            workingDays: {
                type: [String],
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            },
            totalHoursPerWeek: {
                type: Number,
                default: 40,
                min: [0, 'Hours per week cannot be negative'],
                max: [80, 'Hours per week cannot exceed 80']
            }
        },
        timeZone: {
            type: String,
            enum: ["EST", "CST", "MST", "PST", "GMT", "IST"],
            default: "IST"
        },
        flexibleHours: {
            type: Boolean,
            default: false
        }
    },

    // Effective Targets (The single source of truth)
    effectiveTargets: {
        dailyClaimTarget: {
            value: { type: Number, default: SYSTEM_DEFAULT_TARGETS.dailyClaimTarget },
            source: { type: String, enum: ['SOW', 'SubDepartment', 'Employee'], default: 'Employee' },
            sourceRef: { type: mongoose.Schema.Types.ObjectId }
        },
        qualityTarget: {
            value: { type: Number, default: SYSTEM_DEFAULT_TARGETS.qualityTarget },
            source: { type: String, enum: ['SOW', 'SubDepartment', 'Employee'], default: 'Employee' },
            sourceRef: { type: mongoose.Schema.Types.ObjectId }
        },
        slaTarget: {
            value: { type: Number, default: SYSTEM_DEFAULT_TARGETS.slaTarget },
            source: { type: String, enum: ['SOW', 'SubDepartment', 'Employee'], default: 'Employee' },
            sourceRef: { type: mongoose.Schema.Types.ObjectId }
        },
        lastUpdatedAt: {
            type: Date,
            default: Date.now
        }
    },

    // SOW Assignments - Key for WFM
    sowAssignments: [{
        sowRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SOW",
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
    }],

    // rampPercentage shifted from sow to employee...
    rampPercentage: {
        type: Number,
        min: [0, 'Ramp percentage cannot be negative'],
        max: [100, 'Ramp percentage cannot exceed 100%'],
        default: 100
    },
    // Skills and Qualifications
    skillsAndQualifications: {
        technicalSkills: [{
            skillRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill',
                required: true
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                required: true
            },
            certifiedDate: Date,
            expiryDate: Date,
            _id: false
        }],
        softSkills: [{       // changed
            skillRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill',
                required: true
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                required: true
            },
            _id: false
        }],
        certifications: [{
            name: String,
            issuingOrganization: String,
            issueDate: Date,
            expiryDate: Date,
            certificateNumber: String
        }],
        education: [{
            degree: String,
            institution: String,
            fieldOfStudy: String,
            graduationYear: Number,
            gpa: Number
        }],
        languages: [{
            languages: {
                type: String,
                enum: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese", "Hindi", "Arabic", "Bengali", "Urdu", "Turkish", "Vietnamese", "Polish", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", "Greek", "Czech", "Hungarian", "Thai", "Indonesian", "Filipino", "Malay", "Romanian", "Ukrainian", "Hebrew", "Persian", "Swahili", "Zulu", "Xhosa", "Tamil", "Telugu", "Kannada", "Gujarati", "Marathi", "Punjabi", "Malayalam", "Burmese", "Khmer", "Lao", "Serbian", "Croatian", "Bulgarian", "Slovak", "Slovenian", "Lithuanian", "Latvian", "Estonian", "Tulu", "Assamese", "Odia", "Maithili", "Sanskrit", "Nepali", "Sinhala", "Bhojpuri", "Konkani", "Manipuri", "Dogri", "Santali", "Sindhi", "Kashmiri"],
            },
            proficiency: {
                type: String,
                enum: ["Basic", "Conversational", "Fluent", "Native"]
            }
        }]
    },

    // Authentication and Security
    authentication: {
        passwordHash: {
            type: String,
            select: false
        },
        lastPasswordChange: {
            type: Date,
            default: Date.now
        },
        failedLoginAttempts: {
            type: Number,
            default: 0
        },
        accountLockedUntil: {
            type: Date,
            default: null
        },
        lastLogin: {
            type: Date,
            default: null
        },
        // sessionTokens: [{
        //     token: String,
        //     createdAt: Date,
        //     expiresAt: Date,
        //     ipAddress: String,
        //     userAgent: String
        // }]
    },

    // Employee Status and Lifecycle
    status: {
        employeeStatus: {
            type: String,
            enum: ["Active", "Inactive", "On Leave", "Suspended", "Terminated", "Notice Period"],
            default: "Active",
            index: true
        },
        statusEffectiveDate: {
            type: Date,
            default: Date.now
        },
        statusReason: String,
        noticePeriod: {
            startDate: Date,
            endDate: Date,
            reason: String
        },
        terminationInfo: {
            terminationDate: Date,
            terminationType: {
                type: String,
                enum: ["Voluntary", "Involuntary", "Retirement", "Contract End", "Layoff"]
            },
            reason: String,
        }
    },

    // System Fields
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: {
            type: String,
            select: false
        },
        emailVerificationExpiry: Date,
        lastLogin: Date,
        lastLoginIP: String,
        loginCount: {
            type: Number,
            default: 0
        },
        profileCompletionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Audit Trail
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
        lastModifiedAt: Date,
        archivedAt: Date,
        archivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// employeeSchema.index({ employeeId: 1 }, { unique: true });
employeeSchema.index({ companyRef: 1, "contactInfo.primaryEmail": 1 }, { unique: true });
employeeSchema.index({ companyRef: 1, "status.employeeStatus": 1 });
employeeSchema.index({ departmentRef: 1, subdepartmentRef: 1 });
employeeSchema.index({ roleRef: 1, designationRef: 1 });
// employeeSchema.index({ "reportingStructure.directManager": 1 });
// employeeSchema.index({ "sowAssignments.sowRef": 1 });

// Virtuals
employeeSchema.virtual('fullName').get(function () {
    const { firstName, middleName, lastName } = this.personalInfo;
    return middleName ?
        `${firstName} ${middleName} ${lastName}` :
        `${firstName} ${lastName}`;
});

employeeSchema.virtual('avatarUrl').get(function () {
    if (this.personalInfo.profilePicture) {
        // If the path is already a full URL, return it directly.
        if (this.personalInfo.profilePicture.startsWith('http')) {
            return this.personalInfo.profilePicture;
        }
        // Otherwise, prepend the base URL from environment variables.
        // If BASE_URL is not set, it defaults to an empty string, returning a 
        // relative path, which is safer than a hardcoded, incorrect domain.
        const baseUrl = process.env.BASE_URL || '';
        return `${baseUrl}${this.personalInfo.profilePicture}`;
    }

    // Return default avatar based on name initials
    const initials = `${this.personalInfo.firstName[0]}${this.personalInfo.lastName[0]}`;
    return `https://ui-avatars.com/api/?name=${initials}&size=128&background=2563eb&color=fff`;
})

employeeSchema.virtual('age').get(function () {
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

// Instance Methods
employeeSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.authentication.passwordHash) return false;
    return await bcrypt.compare(candidatePassword, this.authentication.passwordHash);
};

employeeSchema.methods.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(12);
    this.authentication.passwordHash = await bcrypt.hash(password, salt);
    this.authentication.lastPasswordChange = new Date();
};

employeeSchema.methods.updateProfileCompletion = function () {
    const completionCriteria = [
        // Personal Info
        () => !!this.personalInfo.firstName,
        () => !!this.personalInfo.lastName,
        () => !!this.personalInfo.dateOfBirth,
        () => this.personalInfo.gender !== "Prefer not to say",

        // Contact Info
        () => !!this.contactInfo.primaryEmail,
        () => !!this.contactInfo.primaryPhone,
        () => !!this.contactInfo.emergencyContact?.name,

        // Employment Info
        () => !!this.employmentInfo.dateOfJoining,
        () => !!this.employmentInfo.employmentType,
        () => !!this.employmentInfo.employeeCode,

        // Organizational Assignments
        () => !!this.roleRef,
        () => !!this.departmentRef,
        () => !!this.designationRef,
        () => !!this.reportingStructure.directManager,

        // Compensation
        () => this.compensation.baseSalary > 0,

        // Skills and Qualifications (at least one of each)
        () => this.skillsAndQualifications.technicalSkills.length > 0,
        () => this.skillsAndQualifications.softSkills.length > 0,
        () => this.skillsAndQualifications.education.length > 0,
        () => this.skillsAndQualifications.languages.length > 0,

        // SOW Assignments
        () => this.sowAssignments.some(a => a.isActive),
    ];

    // The total number of fields is now dynamic, based on the criteria list.
    const totalFields = completionCriteria.length;

    // The number of completed fields is calculated by running each check.
    const completedFields = completionCriteria.filter(criterion => criterion()).length;

    // The calculation is now always correct and easy to update.
    if (totalFields > 0) {
        this.systemInfo.profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);
    } else {
        this.systemInfo.profileCompletionPercentage = 0;
    }
};

employeeSchema.methods.removeFromSOW = function (sowRef) {
    const assignment = this.sowAssignments.find(
        assignment => assignment.sowRef.equals(sowRef) && assignment.isActive
    );

    if (assignment) {
        assignment.isActive = false;
    }
};

employeeSchema.methods.canBeDeleted = async function () {
    // Check if employee has active claims, is a manager, etc.
    const hasActiveSOWs = this.sowAssignments.some(assignment => assignment.isActive);
    const isManager = mongoose.models.Employee && await mongoose.models.Employee.exists({
        'reportingStructure.directManager': this._id,
        'status.employeeStatus': 'Active'
    });

    return !hasActiveSOWs && !isManager && this.status.employeeStatus !== 'Active';
};

// Static Methods
employeeSchema.statics.findByCompany = function (companyRef, includeInactive = false) {
    const query = { companyRef };
    // if (!includeInactive) {
    //     query['status.employeeStatus'] = 'Active',
    //     query['systemInfo.isActive'] = true
    // }
    return this.find(query).sort({ 'personalInfo.firstName': 1 });
};

employeeSchema.statics.findByDepartment = function (departmentRef, includeInactive = false) {
    const query = { departmentRef };
    // if (!includeInactive) {
    //     query['status.employeeStatus'] = 'Active',
    // }
    return this.find(query).sort({ 'personalInfo.firstName': 1 });
};

employeeSchema.statics.findBySOW = function (sowRef) {
    return this.find({
        'sowAssignments.sowRef': sowRef,
        'sowAssignments.isActive': true,
        'status.employeeStatus': 'Active'
    }).sort({ 'personalInfo.firstName': 1 });
};

employeeSchema.statics.findByRole = function (roleRef, companyRef) {
    return this.find({
        roleRef,
        companyRef,
        'status.employeeStatus': 'Active'
    }).sort({ 'personalInfo.firstName': 1 });
};

// Pre-save middleware
employeeSchema.pre('save', async function (next) {
    try {
        // Auto-generate employee ID using company name and random string
        if (!this.employeeId) {
            const company = await mongoose.model('Company').findById(this.companyRef);

            if (company) {
                const randomString = uuidv4().substring(0, 6).toUpperCase();
                this.employeeId = `EMP-${company.companyName.substring(0, 3).toUpperCase()}-${randomString}`;
            }
        }

        // Auto-generate display name
        if (!this.personalInfo.displayName) {
            this.personalInfo.displayName = this.fullName;
        }

        // Update profile completion
        this.updateProfileCompletion();

        // Validate reporting structure 
        if (this.reportingStructure.directManager && this.reportingStructure.directManager.equals(this._id)) {
            return next(new Error('Employee cannot be their own manager'));
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Error handling for duplicates
employeeSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern && error.keyPattern.primaryEmail) {
            next(new Error('Employee with this email already exists'));
        } else if (error.keyPattern && error.keyPattern.employeeId) {
            next(new Error('Employee ID already exists'));
        } else {
            next(new Error('Duplicate employee entry found'));
        }
    } else {
        next(error);
    }
});

export const Employee = mongoose.model('Employee', employeeSchema, "employees");