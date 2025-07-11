// backend/src/models/designation.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const designationSchema = new mongoose.Schema({
    designationId: {
        type: String,
        unique: true,
        default: () => `DESIG-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // Designation Information
    designationName: {
        type: String,
        required: [true, 'Designation name is required'],
        trim: true,
        maxlength: [100, 'Designation name cannot exceed 100 characters']
    },
    designationCode: {
        type: String,
        required: [true, 'Designation code is required'],
        trim: true,
        uppercase: true,
        maxlength: [15, 'Designation code cannot exceed 15 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Hierarchy and Classification
    level: {
        type: Number,
        required: [true, 'Designation level is required'],
        min: [1, 'Level must be at least 1'],
        max: [15, 'Level cannot exceed 15']
    },
    category: {
        type: String,
        enum: ["C-Level", "VP", "Director", "Manager", "Team Lead", "Senior", "Mid Level", "Junior", "Entry Level", "Intern", "Contractor", "Consultant"],
        required: [true, 'Category is required']
    },

    // Department Association
    applicableDepartments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }],

    // Related roles that typically have this designation
    compatibleRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }],

    // Reporting Structure
    reportsTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation"
    }],

    // Requirements and Qualifications
    requirements: {
        minimumExperience: {
            type: Number,
            default: 0,
            min: [0, 'Minimum experience cannot be negative']
        },
        requiredEducation: {
            type: String,
            enum: ["None", "High School", "Associates", "Bachelors", "Masters", "PhD", "Professional Certification"],
            default: "None"
        },
        requiredSkills: [{
            skill: {
                type: String,
                trim: true,
                // required: true
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                default: "Intermediate"
            }
        }]
    },

    // Access and Privileges
    systemPrivileges: {
        canApproveLeave: {
            type: Boolean,
            default: false
        },
        canApproveExpenses: {
            type: Boolean,
            default: false
        },
        canAccessFinancials: {
            type: Boolean,
            default: false
        },
        canManageTeam: {
            type: Boolean,
            default: false
        }
    },

    // Status and Metadata
    isActive: {
        type: Boolean,
        default: true
    },
    isLeadershipRole: {
        type: Boolean,
        default: false
    },
    allowsRemoteWork: {
        type: Boolean,
        default: true
    },

    // Audit Trail
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    archivedAt: Date,
    archivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// designationSchema.index({ designationId: 1 }, { unique: true });
designationSchema.index({ companyRef: 1, designationCode: 1 }, { unique: true });
designationSchema.index({ companyRef: 1, level: 1, category: 1 });
designationSchema.index({ companyRef: 1, isActive: 1 });

// Virtuals
designationSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'designationRef'
});

// Instance Methods
designationSchema.methods.canReportTo = function (supervisorDesignation) {
    return this.reportsTo.some(id => id.equals(supervisorDesignation._id)) ||
        supervisorDesignation.level > this.level;
};

designationSchema.methods.isQualifiedCandidate = function (candidateProfile) {
    const { experience, education } = candidateProfile;

    // Check experience requirements
    if (experience < this.requirements.minimumExperience) {
        return { qualified: false, reason: 'Insufficient experience' };
    }

    if (this.requirements.maximumExperience && experience > this.requirements.maximumExperience) {
        return { qualified: false, reason: 'Overqualified by experience' };
    }

    // Check education requirements
    const educationLevels = ["None", "High School", "Associates", "Bachelors", "Masters", "PhD"];
    const requiredLevel = educationLevels.indexOf(this.requirements.requiredEducation);
    const candidateLevel = educationLevels.indexOf(education);

    if (candidateLevel < requiredLevel) {
        return { qualified: false, reason: 'Education requirements not met' };
    }

    return { qualified: true };
};

// Static Methods
designationSchema.statics.findByCompany = function (companyRef, includeInactive = false) {
    const query = { companyRef };
    // if (!includeInactive) query.isActive = true;
    return this.find(query).sort({ level: 1, designationName: 1 });
};

designationSchema.statics.findByLevel = function (companyRef, level) {
    return this.find({
        companyRef,
        level,
        // isActive: true
    }).sort({ designationName: 1 });
};

designationSchema.statics.findByCategory = function (companyRef, category) {
    return this.find({
        companyRef,
        category,
        // isActive: true
    }).sort({ level: 1, designationName: 1 });
};

designationSchema.statics.getLeadershipRoles = function (companyRef) {
    return this.find({
        companyRef,
        isLeadershipRole: true,
        // isActive: true
    }).sort({ level: -1 });
};

designationSchema.statics.findByDepartment = function (companyRef, departmentRef) {
    return this.find({
        companyRef,
        applicableDepartments: departmentRef,
        // isActive: true
    }).sort({ level: 1 });
};

// Pre-save middleware
designationSchema.pre('save', async function (next) {
    try {
        // Validate experience range
        if (this.requirements.maximumExperience &&
            this.requirements.minimumExperience > this.requirements.maximumExperience) {
            return next(new Error('Minimum experience cannot be greater than maximum experience'));
        }

        // Auto-set leadership role based on category
        if (this.isModified('category')) {
            const leadershipCategories = ["C-Level", "VP", "Director", "Manager"];
            this.isLeadershipRole = leadershipCategories.includes(this.category);
        }

        // Auto-set team management privilege for leadership roles
        if (this.isLeadershipRole) {
            this.systemPrivileges.canManageTeam = true;
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Error handling for duplicates
designationSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern && error.keyPattern.designationCode) {
            next(new Error('Designation code already exists in this company'));
        } else {
            next(new Error('Duplicate designation entry found'));
        }
    } else {
        next(error);
    }
});

export const Designation = mongoose.model("Designation", designationSchema, "designations");