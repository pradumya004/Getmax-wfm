// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

// Auth Pages
import CompanySignup from "./pages/auth/signup/CompanySignup.jsx";
import CompanyLogin from "./pages/auth/CompanyLogin.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import EmployeeLogin from "./pages/auth/EmployeeLogin.jsx";
import TestingSignup from "./pages/auth/SignupModal.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CompanyManagement from "./pages/admin/CompanyManagement.jsx";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";

// Employee Pages
import EmployeeDashboard from "./pages/company/EmployeeDashboard.jsx";

// Misc
import HomePage from "./pages/HomePage.jsx";
//claim intake 
import ClaimIntake from "./pages/ClaimIntake.jsx";

function App() {
  return (
    <>
      <Toaster  containerStyle={{zIndex: 99999}}  position=" top-right" toastOptions={{ duration: 3000 }} />
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/signup" element={<CompanySignup />} />
          <Route path="/login" element={<CompanyLogin />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/testing/signup" element={<TestingSignup />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/companies" element={<CompanyManagement />} />

          {/* Company Routes inside DashboardLayout */}
          <Route path="/company" element={<DashboardLayout />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
          </Route>

          {/* Employee Routes inside DashboardLayout */}
          <Route path="/employee" element={<DashboardLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
          </Route>

          {/* Homepage */}
          <Route path="/" element={<HomePage />} />
          <Route path="/claimintake" element={<ClaimIntake />} />

          
        </Routes>
      </Router>
    </>
  );
}

export default App;
