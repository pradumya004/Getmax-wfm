// backend/src/models/employee.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import performanceMetricsSchema from "./performance.model.js";
import gamificationSchema from "./gamification.model.js";

// rank - 4 diff (rank 1 guardian(5,4,3,2,1), rank 2 elite, rank 3 pro, rank 4 master) {affecting ranks}
// level - 
// exp
// coins

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
            enum: ["Male", "Female", "Other", "Prefer not to say"],
            default: "Prefer not to say"
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
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

    // WFM Performance Tracking
    performanceMetrics: {
        type: performanceMetricsSchema,
        default: () => ({})
    },

    // WFM Gamification System
    gamification: {
        type: gamificationSchema,
        default: () => ({})
    },

    // WFM Specific Performance Targets
    performanceTargets: {
        dailyClaimTarget: {
            type: Number,
            default: 30,
            min: [0, 'Daily claim target cannot be negative']
        },
        qualityTarget: {
            type: Number,
            min: [0, 'Quality target cannot be negative'],
            max: [100, 'Quality target cannot exceed 100%'],
            default: 90
        },
        slaTarget: {
            type: Number,
            min: [0, 'SLA target cannot be negative'],
            max: [100, 'SLA target cannot exceed 100%'],
            default: 95
        },
        currentPerformanceRating: {
            type: String,
            enum: {
                values: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Could be better", "Need to Improve"],
                message: 'Performance rating must be a valid rating'
            },
            default: null
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
        technicalSkills: [{   // changed
            skill: {
                type: String,
                enum: ["Java", "JavaScript", "Python", "C#", "C++", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "TypeScript", "SQL", "NoSQL", "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "ASP.NET Core", "Express.js", "GraphQL", "RESTful APIs", "Microservices", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud Platform", "Machine Learning", "Data Science", "Big Data", "DevOps", "Agile Methodologies", "Scrum", "Kanban", "Project Management", "UI/UX Design", "Cybersecurity", "Blockchain", "Internet of Things (IoT)", "AR/VR Development", "Game Development", "Mobile App Development", "Web Development", "Software Testing", "Quality Assurance", "Technical Writing"],
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
            },
            certifiedDate: Date,
            expiryDate: Date,
        }],
        softSkills: [{       // changed
            skill: {
                type: String,
                enum: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Adaptability", "Leadership", "Critical Thinking", "Creativity", "Emotional Intelligence", "Conflict Resolution", "Negotiation", "Decision Making", "Collaboration", "Interpersonal Skills", "Active Listening", "Public Speaking", "Presentation Skills", "Customer Service", "Networking", "Cultural Awareness", "Stress Management", "Work Ethic", "Attention to Detail", "Analytical Thinking", "Organizational Skills", "Project Management", "Change Management", "Mentoring", "Coaching", "Influencing", "Persuasion", "Sales Skills", "Marketing Skills", "Business Acumen", "Financial Acumen", "Strategic Thinking", "Innovation", "Agility", "Resilience", "Self-Motivation", "Goal Setting", "Visionary Thinking"],
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
            }
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
        return this.personalInfo.profilePicture.startsWith('http') ? this.personalInfo.profilePicture : `${process.env.BASE_URL || 'http://localhost:3000'}${this.personalInfo.profilePicture}`
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

employeeSchema.virtual('activeSowAssignments').get(function () {
    return this.sowAssignments.filter(assignment => assignment.isActive);
});

employeeSchema.virtual('currentPerformanceLevel').get(function () {
    return this.gamification.experience.currentLevel;
});

employeeSchema.virtual('todaysMetrics').get(function () {
    const today = new Date().toDateString();
    return this.performanceMetrics.dailyMetrics.find(metric =>
        new Date(metric.date).toDateString() === today
    );
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
    let completedFields = 0;
    const totalFields = 15; // Adjust based on required fields

    // Check required personal info
    if (this.personalInfo.firstName) completedFields++;
    if (this.personalInfo.lastName) completedFields++;
    if (this.personalInfo.dateOfBirth) completedFields++;
    if (this.personalInfo.gender !== "Prefer not to say") completedFields++;

    // Check contact info
    if (this.contactInfo.primaryEmail) completedFields++;
    if (this.contactInfo.primaryPhone) completedFields++;

    // Check employment info
    if (this.employmentInfo.dateOfJoining) completedFields++;
    if (this.employmentInfo.employmentType) completedFields++;

    // Check organizational assignments
    if (this.roleRef) completedFields++;
    if (this.departmentRef) completedFields++;
    if (this.designationRef) completedFields++;
    if (this.compensation.baseSalary) completedFields++;

    // Check skills and qualifications
    if (this.skillsAndQualifications.technicalSkills.length > 0) completedFields++;
    if (this.skillsAndQualifications.softSkills.length > 0) completedFields++;
    if (this.skillsAndQualifications.languages.length > 0) completedFields++;

    // Check SOW assignments
    if (this.sowAssignments.length > 0) completedFields++;
    if (this.reportingStructure.directManager) completedFields++;

    // Check performance targets
    if (this.performanceTargets.dailyClaimTarget) completedFields++;
    if (this.performanceTargets.qualityTarget) completedFields++;
    if (this.performanceTargets.slaTarget) completedFields++;

    this.systemInfo.profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);
};

employeeSchema.methods.awardExperience = function (points, reason) {
    this.gamification.experience.totalXP += points;

    // Calculate level progression
    const newLevel = Math.floor(this.gamification.experience.totalXP / 100) + 1;
    if (newLevel > this.gamification.experience.currentLevel) {
        this.gamification.experience.levelUpHistory.push({
            level: newLevel,
            achievedDate: new Date(),
            xpRequired: newLevel * 100
        });
        this.gamification.experience.currentLevel = newLevel;
    }

    this.gamification.experience.xpToNextLevel =
        (this.gamification.experience.currentLevel * 100) - this.gamification.experience.totalXP;
};

// change rampPercentage
// employeeSchema.methods.assignToSOW = function (sowRef, rampPercentage = 100) {
//     const existingAssignment = this.sowAssignments.find(
//         assignment => assignment.sowRef.equals(sowRef) && assignment.isActive
//     );

//     if (existingAssignment) {
//         existingAssignment.rampPercentage = rampPercentage;
//     } else {
//         this.sowAssignments.push({
//             sowRef,
//             rampPercentage,
//             isActive: true,
//             assignedDate: new Date()
//         });
//     }
// };

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

employeeSchema.statics.getPerformanceLeaderboard = function (companyRef, period = 'weekly') {
    const matchStage = {
        companyRef: new mongoose.Types.ObjectId(companyRef),
        'status.employeeStatus': 'Active'
    };

    return this.aggregate([
        { $match: matchStage },
        {
            $addFields: {
                currentPeriodScore: period === 'weekly'
                    ? '$performanceMetrics.weeklyMetrics.averageQualityScore'
                    : '$performanceMetrics.monthlyMetrics.averageQualityScore'
            }
        },
        { $sort: { currentPeriodScore: -1 } },
        { $limit: 10 },
        {
            $project: {
                employeeId: 1,
                fullName: { $concat: ['$personalInfo.firstName', ' ', '$personalInfo.lastName'] },
                currentPeriodScore: 1,
                gamificationLevel: '$gamification.experience.currentLevel',
                totalXP: '$gamification.experience.totalXP'
            }
        }
    ]);
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