// frontend/src/components/common/ProtectedRoute.jsx

// Route protection based on authentication and user type

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { LoadingSpinner } from "../ui/LoadingSpinner.jsx";
import { isMasterAdmin, getLoginUrl, getDashboardUrl } from "../../lib/auth.js";

const ProtectedRoute = ({ children, userType = null }) => {
  const { user, userType: currentUserType, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    const loginPath = getLoginUrl(userType);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Master admin (Sriram) can access everything
  if (isMasterAdmin()) {
    return children;
  }

  if (userType && currentUserType !== userType) {
    const redirectPath = getDashboardUrl();
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct permissions
  return children;
};

export default ProtectedRoute;
