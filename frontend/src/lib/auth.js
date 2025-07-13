// frontend/src/lib/auth.js

export const getStoredUser = () => {
    try {
        const user = localStorage.getItem('user');
        console.log("Stored User:", user);

        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const getStoredToken = () => ({
    companyToken: localStorage.getItem('companyToken'),
    employeeToken: localStorage.getItem('employeeToken')
});

export const setAuthData = (companyToken, user, employeeToken = null) => {
    const userType = user?.userType || determineUserType(user);
    console.log(`Setting auth data: Company Token=${companyToken}, Employee Token=${employeeToken}, userType=${userType}`, user);
    localStorage.setItem('companyToken', companyToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);

    if (employeeToken) {
        localStorage.setItem('employeeToken', employeeToken);
    }
};

export const clearAuthData = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
};

// Improved user type detection based on backend response structure
const determineUserType = (user) => {
    console.log("Checking User:", user);

    if (!user) return null;

    // ✅ If backend provides userType directly, use it
    if (user.userType) return user.userType;

    // 🔥 NEW: Check for Master Admin (Sriram - hardcoded)
    if (user.role === 'MASTER_ADMIN' || user.email === 'sriram@getmaxsolutions.com') {
        return 'master_admin';
    }

    // Check for company-level admin/super admin (existing system)
    // if (user.isAdmin || user.role === 'admin' || user.roleLevel >= 8) {
    //     return 'admin';
    // }

    // Check for employee - has employeeId and companyRef
    if (user.employeeId && user.companyRef) {
        return 'employee';
    }

    // Check for company - has companyId/companyName but no employeeId
    if ((user.companyId || user._id) && !user.employeeId) {
        return 'company';
    }

    // Fallback: check for company-specific fields
    if (user.companyName || user.companyEmail || user.businessType) {
        return 'company';
    }

    return 'company'; // default fallback
};

export const getUserType = () => {
    // First check if userType is already stored
    const storedType = localStorage.getItem('userType');
    if (storedType) return storedType;

    // Otherwise determine from user object
    const user = getStoredUser();
    console.log("Retrieving User Type:", user);

    return determineUserType(user);
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
    const user = getStoredUser();
    const token = getStoredToken();
    return !!(user && token);
};

// Helper to get auth headers for API calls
export const getAuthHeaders = (tokenType = 'company') => {
    const token = tokenType === 'employee'
        ? localStorage.getItem('employeeToken')
        : localStorage.getItem('companyToken');

    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============= MASTER ADMIN SPECIFIC HELPERS =============

// Check if current user is Master Admin
export const isMasterAdmin = () => {
    const userType = getUserType();
    const user = getStoredUser();
    return userType === 'master_admin' || user?.email === 'sriram@getmaxsolutions.com';
};

// Get Master Admin permissions
export const getMasterAdminPermissions = () => {
    const user = getStoredUser();
    if (!isMasterAdmin()) return {};

    return user?.permissions || {
        canViewAllCompanies: true,
        canManageSubscriptions: true,
        canViewPlatformStats: true,
        canSuspendCompanies: true,
        canAccessFinancials: true
    };
};

// Check specific Master Admin permission
export const hasMasterAdminPermission = (permission) => {
    const permissions = getMasterAdminPermissions();
    return permissions[permission] || false;
};

// Check if current user is specifically Sriram
export const isSriram = () => {
    const user = getStoredUser();
    return user?.email === 'sriram@getmaxsolutions.com' && isMasterAdmin();
};

// ============= GENERAL PERMISSION HELPERS =============

// Enhanced permission checking with Master Admin override
export const hasPermission = (requiredUserType, specificPermission = null) => {
    const currentUserType = getUserType();
    const user = getStoredUser();

    if (!currentUserType) return false;

    // Master Admin (Sriram) has access to everything
    if (currentUserType === 'master_admin') {
        if (specificPermission) {
            return hasMasterAdminPermission(specificPermission);
        }
        return true;
    }

    // Company Super Admin has access to admin and below (existing system)
    if (currentUserType === 'admin') {
        return ['admin', 'company', 'employee'].includes(requiredUserType);
    }

    // Company has access to company and employee
    if (currentUserType === 'company') {
        return ['company', 'employee'].includes(requiredUserType);
    }

    // Exact match required for employee
    return currentUserType === requiredUserType;
};

// Route access helper
export const canAccessRoute = (routeUserType, requiredPermission = null) => {
    return hasPermission(routeUserType, requiredPermission);
};


// ============= USER INFO HELPERS =============

// Get current user with enhanced details
export const getCurrentUser = () => {
    const user = getStoredUser();
    const userType = getUserType();

    return {
        user,
        userType,
        isAuthenticated: isAuthenticated(),
        isMasterAdmin: isMasterAdmin(),
        permissions: isMasterAdmin() ? getMasterAdminPermissions() : (user?.permissions || {})
    };
};

// Get user display information
export const getUserDisplayInfo = () => {
    const user = getStoredUser();
    const userType = getUserType();

    if (isMasterAdmin()) {
        return {
            name: user?.name || 'Sriram',
            email: user?.email || 'sriram@getmaxsolutions.com',
            role: 'Master Admin',
            avatar: user?.avatar || null,
            displayTitle: 'Platform Owner'
        };
    }

    if (userType === 'company' || userType === 'admin') {
        return {
            name: user?.companyName || 'Company Admin',
            email: user?.companyEmail || user?.email,
            role: 'Company Admin',
            avatar: user?.avatar || null,
            displayTitle: 'Company Administrator'
        };
    }

    if (userType === 'employee') {
        return {
            name: `${user?.personalInfo?.firstName} ${user?.personalInfo?.lastName}`.trim(),
            email: user?.contactInfo?.primaryEmail || user?.email,
            role: user?.roleRef?.roleName || 'Employee',
            avatar: user?.personalInfo?.avatar || null,
            displayTitle: user?.roleRef?.roleName || 'Employee'
        };
    }

    return {
        name: 'User',
        email: user?.email || '',
        role: userType || 'Unknown',
        avatar: null,
        displayTitle: 'User'
    };
};

// ============= NAVIGATION HELPERS =============

// Get appropriate dashboard URL based on user type
export const getDashboardUrl = () => {
    const userType = getUserType();

    switch (userType) {
        case 'master_admin':
            return '/master-admin/dashboard';
        case 'admin':
            return '/admin/dashboard';
        case 'company':
            return '/company/dashboard';
        case 'employee':
            return '/employee/dashboard';
        default:
            return '/login';
    }
};

// Get appropriate login URL based on user type
export const getLoginUrl = (userType = null) => {
    if (!userType) {
        return '/login';
    }

    switch (userType) {
        case 'master_admin':
            return '/master-admin/login';
        case 'admin':
        case 'company':
            return '/company/login';
        case 'employee':
            return '/employee/login';
        default:
            return '/master-admin/login';
    }
};

// Get user type display name
export const getUserTypeDisplayName = (userType = null) => {
    const type = userType || getUserType();

    switch (type) {
        case 'master_admin':
            return 'Master Admin';
        case 'admin':
            return 'Company Admin';
        case 'company':
            return 'Company';
        case 'employee':
            return 'Employee';
        default:
            return 'User';
    }
};

// ============= DEBUG & UTILITIES =============

// Debug helper for development
export const getAuthDebugInfo = () => {
    return {
        user: getStoredUser(),
        token: getStoredToken() ? 'Present' : 'None',
        userType: getUserType(),
        isAuthenticated: isAuthenticated(),
        isMasterAdmin: isMasterAdmin(),
        isSriram: isSriram(),
        permissions: isMasterAdmin() ? getMasterAdminPermissions() : {},
        dashboardUrl: getDashboardUrl()
    };
};