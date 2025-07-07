// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth.jsx";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

// Auth Pages
import CompanySignup from "./pages/auth/signup/CompanySignup.jsx";
import CompanyLogin from "./pages/auth/CompanyLogin.jsx";
import MasterAdminLogin from "./pages/auth/MasterAdminLogin.jsx";
import EmployeeLogin from "./pages/auth/EmployeeLogin.jsx";

// Master Admin Pages
import MasterAdminDashboard from "./pages/admin/MasterAdminDashboard.jsx";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";
import CompanyProfile from "./pages/company/CompanyProfile.jsx";
import CompanySettings from "./pages/company/CompanySettings.jsx";

// Company Employee Management
import EmployeeManagement from "./pages/company/employees/EmployeeManagement.jsx";
import EmployeeDetails from "./pages/company/employees/EmployeeDetails.jsx";
import AddEmployee from "./pages/company/employees/AddEmployee.jsx";
import EditEmployee from "./pages/company/employees/EditEmployee.jsx";
import BulkEmployeeUpload from "./pages/company/employees/BulkEmployeeUpload.jsx";
import PerformanceLeaderboard from "./pages/company/employees/PerformanceLeaderboard.jsx";

// Organization Management Pages
import OrganizationOverview from "./pages/company/organization/OrganizationOverview.jsx";
import RoleManagement from "./pages/company/organization/RoleManagement.jsx";
import DepartmentManagement from "./pages/company/organization/DepartmentManagement.jsx";
import DesignationManagement from "./pages/company/organization/DesignationManagement.jsx";
import SubDepartmentManagement from "./pages/company/organization/SubDepartmentManagement.jsx";
import OrgHierarchyView from "./pages/company/organization/OrgHierarchyView.jsx";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";
import EditProfile from "./pages/employee/EditProfile.jsx";
import UploadAvatar from "./pages/employee/UploadAvatar.jsx";
import MyPerformance from "./pages/employee/MyPerformance.jsx";

// Public Pages
import HomePage from "./pages/HomePage.jsx";
import ClaimIntake from "./pages/ClaimIntake.jsx";

// Protected Route
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Testing
import IntegrationTest from "./components/testing/IntegrationTest.jsx";
import { getAuthDebugInfo } from "./lib/auth.js";

function App() {
  console.log("DEBUG:", getAuthDebugInfo());
  return (
    <AuthProvider>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        position="top-right"
        toastOptions={{ duration: 3000 }}
      />
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/claimintake" element={<ClaimIntake />} />
          <Route path="/test" element={<IntegrationTest />} />

          {/* AUTH ROUTES */}
          <Route path="/signup" element={<CompanySignup />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/master-admin/login" element={<MasterAdminLogin />} />

          {/* MASTER ADMIN ROUTES */}
          <Route
            path="/master-admin"
            element={
              <ProtectedRoute userType="master_admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MasterAdminDashboard />} />
            <Route path="dashboard" element={<MasterAdminDashboard />} />
          </Route>

          {/* COMPANY ROUTES */}
          <Route
            path="/company"
            element={
              <ProtectedRoute userType="company">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="settings" element={<CompanySettings />} />

            {/* EMPLOYEE MGMT */}
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/bulk" element={<BulkEmployeeUpload />} />
            <Route
              path="employees/leaderboard"
              element={<PerformanceLeaderboard />}
            />
            <Route path="employees/:employeeId" element={<EmployeeDetails />} />
            <Route
              path="employees/:employeeId/edit"
              element={<EditEmployee />}
            />

            {/* ORG MGMT */}
            <Route path="org-data/overview" element={<OrganizationOverview />} />
            <Route
              path="org-data/hierarchy"
              element={<OrgHierarchyView />}
            />
            <Route path="org-data/roles" element={<RoleManagement />} />
            <Route
              path="org-data/departments"
              element={<DepartmentManagement />}
            />
            <Route
              path="org-data/designations"
              element={<DesignationManagement />}
            />
            <Route
              path="org-data/subdepartments"
              element={<SubDepartmentManagement />}
            />
          </Route>

          {/* EMPLOYEE ROUTES */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute userType="employee">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="profile/avatar" element={<UploadAvatar />} />
            <Route path="performance" element={<MyPerformance />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page Not Found</p>
                  <a
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Return Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
