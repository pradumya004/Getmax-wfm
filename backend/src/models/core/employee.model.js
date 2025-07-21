// backend/src/models/core/employee.model.js

// COMPLETE MODEL WITH ALL EXISTING FIELDS + NEW RCM SKILLS, QA METRICS, SLA PERFORMANCE

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import performanceMetricsSchema from "../performance/performance.model.js";
import gamificationSchema from "../performance/gamification.model.js";
import { USER_ROLE_LEVELS, SERVICE_TYPES, SPECIALTY_TYPES } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

// NEW RCM Skills Schema (ADDED)
const rcmSkillsSchema = new mongoose.Schema({
    skillCategory: {
        type: String,
        enum: ['Medical Coding', 'Billing', 'Collections', 'Authorization', 'EDI', 'QA', 'Analytics', 'Customer Service'],
        required: true
    },
    skillName: {
        type: String,
        required: true,
        trim: true
    },
    proficiencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true
    },
    certifiedLevel: {
        type: String,
        enum: ['Self-Assessed', 'Manager-Verified', 'Certified', 'Expert-Certified'],
        default: 'Self-Assessed'
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
        max: 50
    },
    lastAssessedDate: Date,
    assessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    // Specific skill details
    specialties: [{ type: String, enum: SPECIALTY_TYPES }],
    clearinghouses: [{ type: String, enum: ['Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto', 'Office Ally'] }],
    softwareProficiency: [{
        softwareName: String,
        version: String,
        proficiencyLevel: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'] }
    }]
}, { _id: false });

// NEW QA Metrics Schema (ADDED)
const qaMetricsSchema = new mongoose.Schema({
    // Overall QA Performance
    overallQaScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    passedReviews: {
        type: Number,
        default: 0
    },
    failedReviews: {
        type: Number,
        default: 0
    },

    // QA History by Service Type
    qaHistoryByService: [{
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES),
            required: true
        },
        reviews: [{
            reviewId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'QAReview'
            },
            reviewDate: Date,
            score: { type: Number, min: 0, max: 100 },
            status: { type: String, enum: ['Passed', 'Failed', 'Pending', 'Disputed'] },
            reviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            categories: [{
                category: String,
                score: Number,
                weight: Number
            }]
        }],
        averageScore: { type: Number, min: 0, max: 100, default: 0 },
        trend: { type: String, enum: ['Improving', 'Declining', 'Stable'], default: 'Stable' }
    }],

    // Error Patterns
    commonErrors: [{
        errorCategory: String,
        errorType: String,
        frequency: Number,
        severity: { type: String, enum: ['Critical', 'Major', 'Minor', 'Cosmetic'] },
        lastOccurrence: Date,
        trainingProvided: { type: Boolean, default: false },
        trainingDate: Date
    }],

    // Calibration Data
    calibrationScores: [{
        calibrationDate: Date,
        expectedScore: Number,
        actualScore: Number,
        variance: Number,
        calibrator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],

    // Monthly Trends
    monthlyTrends: [{
        year: Number,
        month: Number,
        averageScore: Number,
        totalReviews: Number,
        passRate: Number,
        improvement: Number // Percentage change from previous month
    }],

    lastReviewDate: Date,
    nextReviewDate: Date
}, { _id: false });

// NEW SLA Performance Schema (ADDED)
const slaPerformanceSchema = new mongoose.Schema({
    // Overall SLA Performance
    overallSlaCompliance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    totalTasks: {
        type: Number,
        default: 0
    },
    tasksMetSla: {
        type: Number,
        default: 0
    },
    tasksBreachedSla: {
        type: Number,
        default: 0
    },

    // SLA Performance by Service Type
    slaHistoryByService: [{
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES),
            required: true
        },
        tasks: [{
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ClaimTasks'
            },
            taskDate: Date,
            slaHours: Number,
            completionHours: Number,
            status: { type: String, enum: ['Met', 'Breached', 'In Progress'] },
            breachReason: String
        }],
        averageCompletionTime: { type: Number, default: 0 }, // in hours
        complianceRate: { type: Number, min: 0, max: 100, default: 0 }
    }],

    // Time Management Metrics
    averageTaskTime: {
        type: Number,
        default: 0 // in hours
    },
    productivityRate: {
        type: Number,
        min: 0,
        max: 200, // Percentage of expected productivity
        default: 100
    },

    // Escalation History
    escalations: [{
        escalationDate: Date,
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClaimTasks'
        },
        reason: String,
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolution: String,
        resolutionDate: Date
    }],

    // Monthly SLA Trends
    monthlyTrends: [{
        year: Number,
        month: Number,
        complianceRate: Number,
        averageCompletionTime: Number,
        totalTasks: Number,
        improvement: Number // Percentage change from previous month
    }],

    lastUpdated: Date
}, { _id: false });

// Employee Schema (PRESERVING ALL EXISTING FIELDS + ENHANCEMENTS)
const employeeSchema = new mongoose.Schema({
    // Core Employee ID (PRESERVED EXACTLY)
    employeeId: {
        type: String,
        unique: true,
        // default: () => `EMP-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },

    // Company Reference (PRESERVED EXACTLY)
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true,
    },

    // Organizational Assignment (PRESERVED EXACTLY)
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

    // Personal Information (PRESERVED EXACTLY)
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
        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return v <= new Date();
                },
                message: 'Date of birth cannot be in the future'
            }
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
            default: 'Prefer not to say'
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'],
            default: 'Prefer not to say'
        },
        nationality: {
            type: String,
            trim: true,
            default: 'Indian'
        },
        profilePicture: {
            type: String,
            trim: true
        },
        socialProfiles: {
            linkedin: {
                type: String,
                validate: {
                    validator: function (v) {
                        if (!v) return true;
                        return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(v);
                    },
                    message: 'Invalid LinkedIn profile URL'
                }
            },
            github: {
                type: String,
                validate: {
                    validator: function (v) {
                        if (!v) return true;
                        return /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(v);
                    },
                    message: 'Invalid GitHub profile URL'
                }
            }
        }
    },

    // Contact Information (PRESERVED EXACTLY)
    contactInfo: {
        primaryEmail: {
            type: String,
            required: [true, 'Primary email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Invalid email format'
            }
        },
        secondaryEmail: {
            type: String,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Invalid secondary email format'
            }
        },
        primaryPhone: {
            type: String,
            required: [true, 'Primary phone is required'],
            validate: {
                validator: function (v) {
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid primary phone number'
            }
        },
        secondaryPhone: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid secondary phone number'
            }
        },
        whatsappNumber: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid WhatsApp number'
            }
        },
        preferredContactMethod: {
            type: String,
            enum: ['Email', 'Phone', 'WhatsApp', 'Slack'],
            default: 'Email'
        },
        address: {
            currentAddress: {
                street: {
                    type: String,
                    trim: true,
                    maxlength: [200, 'Street address cannot exceed 200 characters']
                },
                city: {
                    type: String,
                    trim: true,
                    maxlength: [100, 'City name cannot exceed 100 characters']
                },
                state: {
                    type: String,
                    trim: true,
                    maxlength: [50, 'State name cannot exceed 50 characters']
                },
                zipCode: {
                    type: String,
                    trim: true,
                    maxlength: [20, 'Zip code cannot exceed 20 characters']
                },
                country: {
                    type: String,
                    trim: true,
                    default: 'India'
                }
            },
            permanentAddress: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: {
                    type: String,
                    default: 'India'
                }
            },
            isSameAsCurrent: {
                type: Boolean,
                default: false
            }
        },
        emergencyContact: {
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

    // Employment Information (PRESERVED EXACTLY)
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

    // Reporting Structure (PRESERVED EXACTLY)
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

    // Compensation (PRESERVED EXACTLY)
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

    // Work Schedule (PRESERVED EXACTLY)
    workSchedule: {
        standardHours: {
            startTime: {
                type: String,
                default: "09:00",
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Invalid time format. Use HH:MM format'
                }
            },
            endTime: {
                type: String,
                default: "17:00",
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Invalid time format. Use HH:MM format'
                }
            },
            timeZone: {
                type: String,
                default: "IST",
                enum: ["IST", "EST", "CST", "MST", "PST", "GMT"]
            }
        },
        workingDays: [{
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }],
        isFlexible: {
            type: Boolean,
            default: false
        },
        overtimeEligible: {
            type: Boolean,
            default: true
        }
    },

    // Skills and Qualifications (PRESERVED + ENHANCED)
    skillsAndQualifications: {
        education: [{
            degree: {
                type: String,
                trim: true,
                maxlength: [100, 'Degree name cannot exceed 100 characters']
            },
            institution: {
                type: String,
                trim: true,
                maxlength: [100, 'Institution name cannot exceed 100 characters']
            },
            year: {
                type: Number,
                min: [1950, 'Year cannot be before 1950'],
                max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
            },
            cgpa: {
                type: Number,
                min: [0, 'CGPA cannot be negative'],
                max: [10, 'CGPA cannot exceed 10']
            },
            isHighest: {
                type: Boolean,
                default: false
            }
        }],
        certifications: [{
            name: {
                type: String,
                trim: true,
                required: true,
                maxlength: [100, 'Certification name cannot exceed 100 characters']
            },
            issuingBody: {
                type: String,
                trim: true,
                maxlength: [100, 'Issuing body name cannot exceed 100 characters']
            },
            issueDate: Date,
            expiryDate: Date,
            certificateNumber: {
                type: String,
                trim: true,
                maxlength: [50, 'Certificate number cannot exceed 50 characters']
            },
            verificationUrl: {
                type: String,
                validate: {
                    validator: function (v) {
                        if (!v) return true;
                        return /^https?:\/\/.+/.test(v);
                    },
                    message: 'Invalid URL format'
                }
            }
        }],
        skills: [{
            type: String,
            trim: true,
            maxlength: [50, 'Skill name cannot exceed 50 characters']
        }],
        experience: [{
            company: {
                type: String,
                trim: true,
                maxlength: [100, 'Company name cannot exceed 100 characters']
            },
            position: {
                type: String,
                trim: true,
                maxlength: [100, 'Position cannot exceed 100 characters']
            },
            startDate: Date,
            endDate: Date,
            description: {
                type: String,
                trim: true,
                maxlength: [500, 'Description cannot exceed 500 characters']
            },
            isCurrent: {
                type: Boolean,
                default: false
            }
        }],
        languages: [{
            language: {
                type: String,
                required: true,
                trim: true
            },
            proficiency: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
                required: true
            },
            canRead: {
                type: Boolean,
                default: true
            },
            canWrite: {
                type: Boolean,
                default: true
            },
            canSpeak: {
                type: Boolean,
                default: true
            }
        }],

        // NEW RCM SKILLS (ADDED)
        rcmSkills: [rcmSkillsSchema],

        // Service Type Proficiencies (ADDED)
        serviceTypeProficiencies: [{
            serviceType: {
                type: String,
                enum: Object.values(SERVICE_TYPES),
                required: true
            },
            proficiencyLevel: {
                type: String,
                enum: ['Trainee', 'Junior', 'Senior', 'Expert', 'Trainer'],
                required: true
            },
            productivityRate: {
                type: Number,
                min: 0,
                max: 200 // Percentage of expected productivity
            },
            qualityScore: {
                type: Number,
                min: 0,
                max: 100
            },
            certificationDate: Date,
            lastTrainingDate: Date,
            requiresSupervision: {
                type: Boolean,
                default: true
            }
        }]
    },

    // SOW Assignments (PRESERVED + ENHANCED)
    sowAssignments: [{
        sowRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SOW',
            required: true
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        // NEW FIELDS (ADDED)
        allocationPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 100
        },
        expectedProductivity: {
            type: Number,
            min: 0
        },
        currentProductivity: {
            type: Number,
            min: 0,
            default: 0
        },
        lastProductivityUpdate: Date
    }],

    // Performance Metrics (PRESERVED EXACTLY)
    performanceMetrics: {
        type: performanceMetricsSchema,
        default: () => ({})
    },

    // Gamification (PRESERVED EXACTLY)
    gamification: {
        type: gamificationSchema,
        default: () => ({})
    },

    // NEW RCM PERFORMANCE SCHEMAS (ADDED)
    qaMetrics: {
        type: qaMetricsSchema,
        default: () => ({})
    },
    slaPerformance: {
        type: slaPerformanceSchema,
        default: () => ({})
    },

    // Login and Authentication (PRESERVED EXACTLY)
    loginInfo: {
        hashedPassword: {
            type: String,
            select: false
        },
        lastLogin: Date,
        lastLoginIP: String,
        loginAttempts: {
            type: Number,
            default: 0
        },
        accountLocked: {
            type: Boolean,
            default: false
        },
        lockUntil: Date,
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpiry: Date,
        mfaEnabled: {
            type: Boolean,
            default: false
        },
        mfaSecret: {
            type: String,
            select: false
        }
    },

    // Employee Status (PRESERVED EXACTLY)
    status: {
        employeeStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'On Leave', 'Terminated', 'Suspended'],
            default: 'Active',
            index: true
        },
        probationPeriod: {
            isOnProbation: {
                type: Boolean,
                default: true
            },
            probationStartDate: {
                type: Date,
                default: Date.now
            },
            probationEndDate: {
                type: Date,
                default: function () {
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 3); // 3 months probation
                    return endDate;
                }
            }
        },
        terminationInfo: {
            terminationDate: Date,
            terminationReason: {
                type: String,
                enum: ["Voluntary", "Involuntary", "Retirement", "Contract End", "Layoff"]
            },
            reason: String,
        }
    },

    // System Information (PRESERVED EXACTLY)
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

    // Audit Trail (PRESERVED EXACTLY)
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

// Indexes (PRESERVED + NEW)
employeeSchema.index({ companyRef: 1, "contactInfo.primaryEmail": 1 }, { unique: true });
employeeSchema.index({ companyRef: 1, "status.employeeStatus": 1 });
employeeSchema.index({ departmentRef: 1, subdepartmentRef: 1 });
employeeSchema.index({ roleRef: 1, designationRef: 1 });
// NEW RCM INDEXES
employeeSchema.index({ 'skillsAndQualifications.rcmSkills.skillCategory': 1 });
employeeSchema.index({ 'qaMetrics.overallQaScore': 1 });
employeeSchema.index({ 'slaPerformance.overallSlaCompliance': 1 });

// Virtual Fields (PRESERVED + NEW)
employeeSchema.virtual('fullName').get(function () {
    const { firstName, middleName, lastName } = this.personalInfo;
    return middleName ?
        `${firstName} ${middleName} ${lastName}` :
        `${firstName} ${lastName}`;
});

employeeSchema.virtual('avatarUrl').get(function () {
    if (this.personalInfo.profilePicture) {
        return this.personalInfo.profilePicture.startsWith('http') ?
            this.personalInfo.profilePicture :
            `/uploads/avatars/${this.personalInfo.profilePicture}`;
    }
    return `/uploads/avatars/default-avatar.png`;
});

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

employeeSchema.virtual('yearsOfService').get(function () {
    if (!this.employmentInfo.dateOfJoining) return 0;
    const today = new Date();
    const joinDate = new Date(this.employmentInfo.dateOfJoining);
    return Math.floor((today - joinDate) / (365.25 * 24 * 60 * 60 * 1000));
});

employeeSchema.virtual('isOnProbation').get(function () {
    if (!this.status.probationPeriod?.isOnProbation) return false;
    const today = new Date();
    const probationEnd = this.status.probationPeriod.probationEndDate;
    return probationEnd && today <= probationEnd;
});

// NEW RCM VIRTUAL FIELDS (ADDED)
employeeSchema.virtual('primarySkills').get(function () {
    return this.skillsAndQualifications?.rcmSkills?.filter(skill =>
        ['Advanced', 'Expert'].includes(skill.proficiencyLevel)
    ) || [];
});

employeeSchema.virtual('qaPassRate').get(function () {
    const qa = this.qaMetrics;
    if (!qa || qa.totalReviews === 0) return 0;
    return Math.round((qa.passedReviews / qa.totalReviews) * 100);
});

employeeSchema.virtual('avgSlaCompliance').get(function () {
    return this.slaPerformance?.overallSlaCompliance || 0;
});

employeeSchema.virtual('performanceGrade').get(function () {
    const qaScore = this.qaMetrics?.overallQaScore || 0;
    const slaScore = this.slaPerformance?.overallSlaCompliance || 0;
    const avgScore = (qaScore + slaScore) / 2;

    if (avgScore >= 95) return 'A+';
    if (avgScore >= 90) return 'A';
    if (avgScore >= 85) return 'B+';
    if (avgScore >= 80) return 'B';
    if (avgScore >= 75) return 'C+';
    if (avgScore >= 70) return 'C';
    return 'D';
});

// Static Methods (PRESERVED + NEW)
employeeSchema.statics.findActiveEmployees = function (companyRef) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active'
    }).populate('roleRef departmentRef designationRef');
};

employeeSchema.statics.findByDepartment = function (companyRef, departmentRef) {
    return this.find({
        companyRef,
        departmentRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active'
    });
};

employeeSchema.statics.findByRole = function (companyRef, roleRef) {
    return this.find({
        companyRef,
        roleRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active'
    });
};

// NEW RCM STATIC METHODS (ADDED)
employeeSchema.statics.findBySkill = function (companyRef, skillCategory, minProficiency = 'Intermediate') {
    const proficiencyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const minIndex = proficiencyOrder.indexOf(minProficiency);

    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active',
        'skillsAndQualifications.rcmSkills': {
            $elemMatch: {
                skillCategory,
                proficiencyLevel: { $in: proficiencyOrder.slice(minIndex) }
            }
        }
    });
};

employeeSchema.statics.findTopPerformers = function (companyRef, limit = 10) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active'
    })
        .sort({
            'qaMetrics.overallQaScore': -1,
            'slaPerformance.overallSlaCompliance': -1
        })
        .limit(limit);
};

employeeSchema.statics.findNeedingTraining = function (companyRef, qaThreshold = 80, slaThreshold = 85) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.employeeStatus': 'Active',
        $or: [
            { 'qaMetrics.overallQaScore': { $lt: qaThreshold } },
            { 'slaPerformance.overallSlaCompliance': { $lt: slaThreshold } }
        ]
    });
};

// Instance Methods (PRESERVED + NEW)
employeeSchema.methods.getActiveSowAssignments = function () {
    return this.sowAssignments.filter(assignment => assignment.isActive);
};

employeeSchema.methods.isEmployeeActive = function () {
    return this.systemInfo.isActive &&
        this.status.employeeStatus === 'Active' &&
        !this.status.terminationInfo?.terminationDate;
};

employeeSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.loginInfo?.hashedPassword) return false;
    return await bcrypt.compare(candidatePassword, this.loginInfo.hashedPassword);
};

employeeSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.loginInfo.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.loginInfo.passwordResetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

// NEW RCM INSTANCE METHODS (ADDED)
employeeSchema.methods.updateQaMetrics = function (reviewData) {
    if (!this.qaMetrics) this.qaMetrics = {};

    this.qaMetrics.totalReviews = (this.qaMetrics.totalReviews || 0) + 1;

    if (reviewData.status === 'Passed') {
        this.qaMetrics.passedReviews = (this.qaMetrics.passedReviews || 0) + 1;
    } else if (reviewData.status === 'Failed') {
        this.qaMetrics.failedReviews = (this.qaMetrics.failedReviews || 0) + 1;
    }

    // Recalculate overall score
    this.qaMetrics.overallQaScore = Math.round(
        (this.qaMetrics.passedReviews / this.qaMetrics.totalReviews) * 100
    );

    this.qaMetrics.lastReviewDate = new Date();
};

employeeSchema.methods.updateSlaPerformance = function (taskData) {
    if (!this.slaPerformance) this.slaPerformance = {};

    this.slaPerformance.totalTasks = (this.slaPerformance.totalTasks || 0) + 1;

    if (taskData.status === 'Met') {
        this.slaPerformance.tasksMetSla = (this.slaPerformance.tasksMetSla || 0) + 1;
    } else if (taskData.status === 'Breached') {
        this.slaPerformance.tasksBreachedSla = (this.slaPerformance.tasksBreachedSla || 0) + 1;
    }

    // Recalculate compliance rate
    this.slaPerformance.overallSlaCompliance = Math.round(
        (this.slaPerformance.tasksMetSla / this.slaPerformance.totalTasks) * 100
    );

    this.slaPerformance.lastUpdated = new Date();
};

employeeSchema.methods.hasSkill = function (skillCategory, minProficiency = 'Intermediate') {
    const proficiencyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const minIndex = proficiencyOrder.indexOf(minProficiency);

    return this.skillsAndQualifications?.rcmSkills?.some(skill =>
        skill.skillCategory === skillCategory &&
        proficiencyOrder.indexOf(skill.proficiencyLevel) >= minIndex
    );
};

// Helper method to calculate profile completion
employeeSchema.methods.calculateProfileCompletion = function () {
    let completedFields = 0;
    let totalFields = 0;

    // Personal Info (40% weight)
    const personalFields = ['firstName', 'lastName', 'dateOfBirth', 'gender'];
    personalFields.forEach(field => {
        totalFields++;
        if (this.personalInfo[field]) completedFields++;
    });

    // Contact Info (30% weight)
    const contactFields = ['primaryEmail', 'primaryPhone'];
    contactFields.forEach(field => {
        totalFields++;
        if (this.contactInfo[field]) completedFields++;
    });

    // Employment Info (20% weight)
    totalFields++;
    if (this.employmentInfo.dateOfJoining) completedFields++;

    // Skills (10% weight)
    totalFields++;
    if (this.skillsAndQualifications?.skills?.length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
};

// PLUGINS
employeeSchema.plugin(scopedIdPlugin, {
    idField: 'employeeId',
    prefix: 'EMP',
    companyRefPath: 'companyRef'
});

// Pre-save middleware (PRESERVED + NEW)
employeeSchema.pre('save', async function (next) {
    // Hash password if modified
    if (this.isModified('loginInfo.hashedPassword') && this.loginInfo?.hashedPassword) {
        const salt = await bcrypt.genSalt(12);
        this.loginInfo.hashedPassword = await bcrypt.hash(this.loginInfo.hashedPassword, salt);
    }

    // Auto-generate employee code if not provided
    if (this.isNew && !this.employmentInfo.employeeCode) {
        this.employmentInfo.employeeCode = `EMP-${Date.now()}`;
    }

    // Auto-generate display name if not provided
    if (!this.personalInfo.displayName) {
        this.personalInfo.displayName = this.fullName;
    }

    // Update profile completion percentage
    this.systemInfo.profileCompletionPercentage = this.calculateProfileCompletion();

    next();
});

export const Employee = mongoose.model("Employee", employeeSchema, "employees");