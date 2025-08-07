// backend/src/models/organization/role.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const roleSchema = new mongoose.Schema({
    roleId: {
        type: String,
        unique: true,
        default: () => `ROLE-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // Role Info
    roleName: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true,
        maxlength: [50, 'Role name cannot exceed 50 characters']
    },
    roleDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Role description cannot exceed 500 characters']
    },

    // Role Level - Dropdown
    roleLevel: {
        type: Number,
        min: [1, 'Role level must be at least 1'],
        max: [10, 'Role level cannot exceed 10'],
        default: 1,
        required: [true, 'Role level is required']
    },

    // Access Permissions - Dropdown
    permissions: {
        employeePermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            required: true,
            default: "None"
        },
        clientPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            required: true,
            default: "None"
        },
        sowPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            required: true,
            default: "None"
        },
        claimPermissions: {
            type: String,
            enum: ["None", "ViewOwn", "ViewTeam", "ViewAll", "Assign", "Manage", "Full"],
            required: true,
            default: "ViewOwn"
        },
        reportPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Export", "Full"],
            required: true,
            default: "None"
        },
        patientPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Export", "Full"],
            required: true,
            default: "None"
        },
        payerPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Export", "Full"],
            required: true,
            default: "None"
        },

    },

    // Data Access Restrictions
    dataAccess: {
        clientRestriction: {
            type: String,
            enum: ["All", "Assigned", "None"],
            required: true,
            default: "Assigned"
        },
        claimRestriction: {
            type: String,
            enum: ["All", "Assigned", "Team", "None"],
            required: true,
            default: "Assigned"
        },
        sowRestriction: {
            type: String,
            enum: ["All", "Assigned", "None"],
            required: true,
            default: "Assigned"
        },
        reportScope: {
            type: String,
            enum: ["Company", "Team", "Self"],
            required: true,
            default: "Self"
        },
        financialDataAccess: {
            type: Boolean,
            required: true,
            default: false
        }
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

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// roleSchema.index({ roleId: 1 }, { unique: true });
roleSchema.index({ companyRef: 1, roleName: 1 }, { unique: true });
roleSchema.index({ companyRef: 1, roleLevel: 1 });
roleSchema.index({ companyRef: 1, isActive: 1 });
roleSchema.index({ "permissions.employeePermissions": 1 });

roleSchema.virtual('accessLevel').get(function () {
    const perms = this.permissions;
    const hasFullAccess = Object.values(perms).some(perm => perm === 'Full');
    const hasManageAccess = Object.values(perms).some(perm => ['Manage', 'Full'].includes(perm));
    const hasCreateAccess = Object.values(perms).some(perm => ['Create', 'Manage', 'Full'].includes(perm));

    if (hasFullAccess) return 'Full';
    if (hasManageAccess) return 'Manager';
    if (hasCreateAccess) return 'Creator';
    return 'Viewer';
});

// Instance Methods
roleSchema.methods.hasPermission = function (permissionType) {
    const permission = this.permissions[permissionType];
    return permission && permission !== "None";
};

roleSchema.methods.canPerform = function (resource, action) {
    const permission = this.permissions[`${resource}Permissions`];

    if (!permission || permission === "None") return false;

    const actionHierarchy = {
        "None": [],
        "View": ["View"],
        "ViewOwn": ["ViewOwn"],
        "ViewTeam": ["ViewOwn", "ViewTeam"],
        "ViewAll": ["ViewOwn", "ViewTeam", "ViewAll"],
        "Create": ["View", "Create"],
        "Assign": ["ViewOwn", "ViewTeam", "ViewAll", "Assign"],
        "Manage": ["View", "Create", "Manage"],
        "Export": ["View", "Create", "Export"],
        "Full": ["View", "Create", "Manage", "Export", "Delete", "Full"]
    };

    return actionHierarchy[permission]?.includes(action) || false;
};

roleSchema.methods.canAccessData = function (dataType, scope) {
    const access = this.dataAccess;
    const restriction = access[`${dataType}Restriction`];

    if (restriction === "All") return true;
    if (restriction === "None") return false;
    if (restriction === "Assigned" && scope === "assigned") return true;
    if (restriction === "Team" && ["assigned", "team"].includes(scope)) return true;

    return false;
}

roleSchema.methods.getEffectivePermissions = function () {
    return {
        level: this.roleLevel,
        permissions: this.permissions,
        dataAccess: this.dataAccess,
        accessLevel: this.accessLevel
    };
};

// Static Methods
roleSchema.statics.findByCompany = function (companyRef) {
    return this.find({ companyRef }).sort({ roleLevel: 1, roleName: 1 });
}

roleSchema.statics.findByPermissionLevel = function (companyRef, permissionType, level) {
    const query = { companyRef };
    query[`permissions.${permissionType}`] = level;
    return this.find(query);
}

roleSchema.statics.findByDataAccess = function (companyRef, accessType, accessLevel) {
    const query = { companyRef };
    query[`dataAccess.${accessType}`] = accessLevel;
    return this.find(query);
}

roleSchema.statics.findByRoleLevel = function (companyRef, minLevel, maxLevel = null) {
    const query = {
        companyRef,
        isActive: true,
        roleLevel: { $gte: minLevel }
    };

    if (maxLevel) {
        query.roleLevel.$lte = maxLevel;
    }

    return this.find(query).sort({ roleLevel: 1 });
};

roleSchema.statics.getSystemRoles = function (companyRef) {
    return this.find({
        companyRef,
        isSystemDefault: true,
        isActive: true
    }).sort({ roleLevel: 1 });
};

// Pre-save middleware
roleSchema.pre('save', function (next) {
    try {
        // Validate permission combinations
        if (this.permissions.claimPermissions === "Full" && this.roleLevel < 7) {
            return next(new Error('Full claim permissions require role level 7 or higher'));
        }

        if (this.dataAccess.financialDataAccess && this.roleLevel < 5) {
            return next(new Error('Financial data access requires role level 5 or higher'));
        }

        next();
    } catch (error) {

    }
});

// Error handling for duplicates
roleSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern && error.keyPattern.roleName) {
            next(new Error('Role name already exists in this company'));
        } else {
            next(new Error('Duplicate role entry found'));
        }
    } else {
        next(error);
    }
});

export const Role = mongoose.model("Role", roleSchema, "roles");