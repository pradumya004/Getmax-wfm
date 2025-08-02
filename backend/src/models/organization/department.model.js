// backend/src/models/organization/department.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        unique: true,
        default: () => `DEPT-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // Department Information
    departmentName: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },
    departmentCode: {
        type: String,
        required: [true, 'Department code is required'],
        trim: true,
        uppercase: true,
        maxlength: [10, 'Department code cannot exceed 10 characters']
    },
    departmentDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Hierarchy
    parentDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null,
    },
    departmentLevel: {
        type: Number,
        default: 1,
        min: [1, 'Department level must be at least 1'],
        max: [10, 'Department level cannot exceed 10']
    },
    departmentPath: {
        type: String,
        trim: true,
        // Will store path like "Engineering/Software/Backend"
    },

    // Management Details
    departmentHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },
    assistantHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },

    // Operational Settings
    functionType: {
        type: String,
        enum: ["Core", "Support", "Administrative", "Technical", "Quality", "Training", "Sales", "Marketing", "Finance", "HR"],
        default: "Core"
    },
    costCenter: {
        type: String,
        trim: true,
        maxlength: [20, 'Cost center cannot exceed 20 characters']
    },
    budget: {
        allocated: {
            type: Number,
            min: [0, 'Budget allocation cannot be negative'],
            default: 0
        },
        currency: {
            type: String,
            default: "INR",
            enum: ["USD", "INR", "EUR", "GBP", "CAD"]
        }
    },

    // Capacity and Metrics
    currentEmployeeCount: {
        type: Number,
        default: 0
    },

    // Business Rules
    allowSubdepartments: {
        type: Boolean,
        default: true
    },
    requiresApproval: {
        type: Boolean,
        default: false
    },

    // Status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isSystemDefault: {
        type: Boolean,
        default: false
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
    archivedAt: {
        type: Date,
        default: null
    },
    archivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index
// departmentSchema.index({ departmentId: 1 }, { unique: true });
departmentSchema.index({ companyRef: 1, departmentCode: 1 }, { unique: true });
departmentSchema.index({ companyRef: 1, isActive: 1 });
departmentSchema.index({ parentDepartment: 1 });
departmentSchema.index({ departmentHead: 1 });

// Virtuals
departmentSchema.virtual('subdepartments', {
    ref: 'SubDepartment',
    localField: '_id',
    foreignField: 'departmentRef'
});

departmentSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'departmentRef'
});

departmentSchema.virtual('childDepartments', {
    ref: 'Department',
    localField: '_id',
    foreignField: 'parentDepartment'
});

// Instance Methods
departmentSchema.methods.updateEmployeeCount = async function () {
    try {
        const Employee = mongoose.model('Employee');
        const count = await Employee.countDocuments({
            departmentRef: this._id,
        });
        this.currentEmployeeCount = count;
        return this.save();
    } catch (error) {
        console.error(`Error updating employee count: ${error}`);
        throw error;
    }
};

departmentSchema.methods.getHierarchyPath = async function () {
    let path = [this.departmentName];
    let current = this;

    const visited = new Set();
    visited.add(current._id.toString());

    while (current.parentDepartment && !visited.has(current.parentDepartment.toString())) {
        visited.add(current.parentDepartment.toString());
        current = await this.constructor.findById(current.parentDepartment);

        if (current) {
            path.unshift(current.departmentName);
        } else {
            break;
        }
    }

    return path.join(' / ');
};

departmentSchema.methods.canBeDeleted = async function () {
    try {
        // Check if Employee model exists before using it
        if (mongoose.models.Employee) {
            const Employee = mongoose.model('Employee');
            const hasEmployees = await Employee.exists({
                departmentRef: this._id
            });

            if (hasEmployees) return false;
        }

        // Check if SubDepartment model exists before using it
        if (mongoose.models.SubDepartment) {
            const SubDepartment = mongoose.model('SubDepartment');
            const hasSubDepartments = await SubDepartment.exists({
                departmentRef: this._id
            });

            if (hasSubDepartments) return false;
        }

        const hasChildDepartments = await this.constructor.exists({
            parentDepartment: this._id
        });

        return !hasChildDepartments;
    } catch (error) {
        console.error(`Error checking if department can be deleted: ${error}`);
        return false;
    }
};

// Static Methods
departmentSchema.statics.findByCompany = function (companyRef) {
    const query = { companyRef };
    return this.find(query).sort({ departmentLevel: 1, departmentName: 1 });
};

departmentSchema.statics.getHierarchy = function (companyRef) {
    return this.find({ companyRef })
        .populate('parentDepartment', 'departmentName')
        .populate('departmentHead', 'firstName lastName')
        .sort({ departmentLevel: 1, departmentName: 1 });
};

departmentSchema.statics.getRootDepartments = function (companyRef) {
    return this.find({
        companyRef,
        parentDepartment: null
    }).sort({ departmentName: 1 });
};

// Pre-save middleware
departmentSchema.pre('save', async function (next) {
    try {
        // Auto-generate department path
        if (this.isModified('parentDepartment') || this.isModified('departmentName')) {
            this.departmentPath = await this.getHierarchyPath();
        }

        // Set department level based on parent
        if (this.parentDepartment && this.isModified('parentDepartment')) {
            const parent = await this.constructor.findById(this.parentDepartment);
            if (parent) {
                this.departmentLevel = parent.departmentLevel + 1;

                // Validate hierarchy depth
                if (this.departmentLevel > 10) {
                    return next(new Error('Department hierarchy cannot exceed 10 levels'));
                }
            } else {
                return next(new Error('Parent department not found'));
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-remove middleware
departmentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const canDelete = await this.canBeDeleted();
    if (!canDelete) {
        return next(new Error('Cannot delete department with active employees or subdepartments'));
    }
    next();
});

export const Department = mongoose.model("Department", departmentSchema, "departments");