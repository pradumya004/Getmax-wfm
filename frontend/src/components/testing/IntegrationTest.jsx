// frontend/src/components/testing/IntegrationTest.jsx

// Test component to verify frontend-backend integration

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.jsx";
import { companyAPI } from "../../api/company.api.js";
import { employeeAPI } from "../../api/employee.api.js";
import { adminAPI } from "../../api/admin.api.js";
import { authAPI } from "../../api/auth.api.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

const IntegrationTest = () => {
  const { user, userType, login, logout } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Test data
  const testCredentials = {
    company: {
      companyEmail: "test@company.com",
      companyPassword: "password123",
    },
    employee: {
      employeeId: "EMP001",
      employeePassword: "password123",
    },
    admin: {
      adminEmail: "admin@system.com",
      adminPassword: "admin123",
    },
  };

  const updateTestResult = (testName, success, message = "", data = null) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: {
        success,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  // API Connection Test
  const testAPIConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      updateTestResult("apiConnection", true, "API is responding", data);
      toast.success("API Connection: Success");
    } catch (error) {
      updateTestResult("apiConnection", false, error.message);
      toast.error("API Connection: Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Test Company Login
  const testCompanyLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.companyLogin(testCredentials.company);
      updateTestResult(
        "companyLogin",
        response.success,
        response.message,
        response.data
      );

      if (response.success) {
        toast.success("Company Login: Success");
      } else {
        toast.error("Company Login: Failed");
      }
    } catch (error) {
      updateTestResult("companyLogin", false, error.message);
      toast.error("Company Login: Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Test Employee Login
  const testEmployeeLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.employeeLogin(testCredentials.employee);
      updateTestResult(
        "employeeLogin",
        response.success,
        response.message,
        response.data
      );

      if (response.success) {
        toast.success("Employee Login: Success");
      } else {
        toast.error("Employee Login: Failed");
      }
    } catch (error) {
      updateTestResult("employeeLogin", false, error.message);
      toast.error("Employee Login: Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Test Admin Login
  const testAdminLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.adminLogin(testCredentials.admin);
      updateTestResult(
        "adminLogin",
        response.success,
        response.message,
        response.data
      );

      if (response.success) {
        toast.success("Admin Login: Success");
      } else {
        toast.error("Admin Login: Failed");
      }
    } catch (error) {
      updateTestResult("adminLogin", false, error.message);
      toast.error("Admin Login: Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Test authenticated endpoints based on current user
  const testAuthenticatedEndpoints = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (userType === "company") {
        response = await companyAPI.getProfile();
        updateTestResult(
          "authenticatedAPI",
          response.success,
          "Company profile fetch",
          response.data
        );
      } else if (userType === "employee") {
        response = await employeeAPI.getProfile();
        updateTestResult(
          "authenticatedAPI",
          response.success,
          "Employee profile fetch",
          response.data
        );
      } else if (userType === "admin") {
        response = await adminAPI.getPlatformStats();
        updateTestResult(
          "authenticatedAPI",
          response.success,
          "Admin stats fetch",
          response.data
        );
      }

      if (response?.success) {
        toast.success("Authenticated API: Success");
      } else {
        toast.error("Authenticated API: Failed");
      }
    } catch (error) {
      updateTestResult("authenticatedAPI", false, error.message);
      toast.error("Authenticated API: Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    await testAPIConnection();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between tests

    await testCompanyLogin();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testEmployeeLogin();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testAdminLogin();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Frontend-Backend Integration Test
        </h1>
        <p className="text-gray-600">
          Test the connection and authentication flow between frontend and
          backend
        </p>
      </div>

      {/* Current Auth Status */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Current Authentication Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">User:</span>{" "}
              {user ? "Authenticated" : "Not logged in"}
            </div>
            <div>
              <span className="font-medium">Type:</span> {userType || "None"}
            </div>
            <div>
              <span className="font-medium">Name:</span>{" "}
              {user?.companyName || user?.personalInfo?.firstName || "N/A"}
            </div>
          </div>
        </div>
      </Card>

      {/* Test Controls */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={testAPIConnection}
              disabled={isLoading}
              variant="outline"
            >
              Test API Connection
            </Button>

            <Button
              onClick={testCompanyLogin}
              disabled={isLoading}
              variant="outline"
            >
              Test Company Login
            </Button>

            <Button
              onClick={testEmployeeLogin}
              disabled={isLoading}
              variant="outline"
            >
              Test Employee Login
            </Button>

            <Button
              onClick={testAdminLogin}
              disabled={isLoading}
              variant="outline"
            >
              Test Admin Login
            </Button>

            <Button
              onClick={testAuthenticatedEndpoints}
              disabled={isLoading || !user}
              variant="outline"
            >
              Test Auth Endpoints
            </Button>

            <Button
              onClick={runAllTests}
              disabled={isLoading}
              variant="primary"
            >
              Run All Tests
            </Button>

            {user && (
              <Button onClick={logout} variant="danger">
                Logout
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Test Results */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          {Object.keys(testResults).length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(testResults).map(([testName, result]) => (
                <div
                  key={testName}
                  className={`p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium capitalize">
                        {testName.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <span
                        className={`ml-2 ${
                          result.success ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.success ? "✅ Success" : "❌ Failed"}
                      </span>
                    </div>
                    <span className="text-xs opacity-70">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {result.message && (
                    <p className="text-sm mt-1">{result.message}</p>
                  )}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer">
                        Show Data
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-white/50 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Environment Info */}
      <Card className="bg-gray-50">
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Environment Info</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">API URL:</span>{" "}
              {import.meta.env.VITE_API_URL || "http://localhost:8000"}
            </div>
            <div>
              <span className="font-medium">Environment:</span>{" "}
              {import.meta.env.MODE}
            </div>
            <div>
              <span className="font-medium">Current URL:</span>{" "}
              {window.location.origin}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationTest;
