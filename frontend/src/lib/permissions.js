// frontend/src/lib/permissions.js

export const PERMISSIONS = {
    // Employee permissions
    VIEW_OWN_PROFILE: "view_own_profile",
    EDIT_OWN_PROFILE: "edit_own_profile",
    VIEW_OWN_PERFORMANCE: "view_own_performance",

    // Company Admin permissions
    MANAGE_EMPLOYEES: "manage_employees",
    VIEW_ALL_EMPLOYEES: "view_all_employees",
    CREATE_EMPLOYEE: "create_employee",
    EDIT_EMPLOYEE: "edit_employee",
    DELETE_EMPLOYEE: "delete_employee",

    // Organization permissions
    MANAGE_ROLES: "manage_roles",
    MANAGE_DEPARTMENTS: "manage_departments",
    MANAGE_DESIGNATIONS: "manage_designations",

    // Super Admin permissions
    MANAGE_COMPANIES: "manage_companies",
    VIEW_PLATFORM_STATS: "view_platform_stats",
    SUSPEND_COMPANY: "suspend_company",
};

export const ROLE_PERMISSIONS = {
    employee: [
        PERMISSIONS.VIEW_OWN_PROFILE,
        PERMISSIONS.EDIT_OWN_PROFILE,
        PERMISSIONS.VIEW_OWN_PERFORMANCE,
    ],
    company: [
        PERMISSIONS.VIEW_OWN_PROFILE,
        PERMISSIONS.EDIT_OWN_PROFILE,
        PERMISSIONS.MANAGE_EMPLOYEES,
        PERMISSIONS.VIEW_ALL_EMPLOYEES,
        PERMISSIONS.CREATE_EMPLOYEE,
        PERMISSIONS.EDIT_EMPLOYEE,
        PERMISSIONS.DELETE_EMPLOYEE,
        PERMISSIONS.MANAGE_ROLES,
        PERMISSIONS.MANAGE_DEPARTMENTS,
        PERMISSIONS.MANAGE_DESIGNATIONS,
    ],
    admin: [
        PERMISSIONS.MANAGE_COMPANIES,
        PERMISSIONS.VIEW_PLATFORM_STATS,
        PERMISSIONS.SUSPEND_COMPANY,
        PERMISSIONS.VIEW_ALL_EMPLOYEES,
    ],
};

export const hasPermission = (userType, permission) => {
    const userPermissions = ROLE_PERMISSIONS[userType] || [];
    return userPermissions.includes(permission);
};

export const canAccessRoute = (userType, routePermissions) => {
    if (!routePermissions || routePermissions.length === 0) return true;
    return routePermissions.some((permission) =>
        hasPermission(userType, permission)
    );
};