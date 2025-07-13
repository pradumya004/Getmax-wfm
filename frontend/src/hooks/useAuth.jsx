// frontend/src/hooks/useAuth.jsx

// UPDATED useAuth hook with improved authentication handling

import { useState, useEffect, createContext, useContext } from "react";
import {
  getStoredUser,
  getStoredToken,
  clearAuthData,
  getUserType,
  setAuthData,
  isAuthenticated,
  getCurrentUser,
} from "../lib/auth.js";
import { authAPI } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = getStoredUser();
      console.log("Initializing auth with stored user:", storedUser);
      const token = getStoredToken();
      console.log("Stored token:", token);

      if (storedUser && token) {
        setUser(storedUser);
        setUserType(getUserType());
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, companyToken, employeeToken, userType) => {
    console.log("Logging in user:", userData);
    console.log("With Company Token:", companyToken);
    console.log("With Employee Token:", employeeToken);
    console.log("User type:", userType);

    const userWithType = {
      ...userData,
      userType: userType || getUserType(userData), // Determine user type if not provided
    };

    // Store auth data first
    setAuthData(companyToken, userWithType, employeeToken);

    // Update state
    setUser(userWithType);
    setUserType(userType); // This will now read from localStorage
  };

  const logout = async () => {
    try {
      // Call appropriate logout API based on user type
      const currentUserType = getUserType();

      if (currentUserType === "company") {
        await authAPI.companyLogout();
      } else if (currentUserType === "employee") {
        await authAPI.employeeLogout();
      } else if (currentUserType === "master_admin") {
        await authAPI.adminLogout();
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state
      setUser(null);
      setUserType(null);
      clearAuthData();
    }
  };

  // Helper method to refresh user data
  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser.user);
    setUserType(currentUser.userType);
  };

  // Helper method to check authentication status
  const checkAuth = () => {
    return isAuthenticated();
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    refreshUser,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
