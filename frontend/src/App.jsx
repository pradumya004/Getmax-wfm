import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Pages
import CompanySignup from "./pages/auth/CompanySignup.jsx";
import CompanyLogin from "./pages/auth/CompanyLogin.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import EmployeeLogin from "./pages/auth/EmployeeLogin.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CompanyManagement from "./pages/admin/CompanyManagement.jsx";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";

// Employee Pages
import EmployeeDashboard from "./pages/company/EmployeeDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<CompanySignup />} />
        <Route path="/login" element={<CompanyLogin />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/companies" element={<CompanyManagement />} />

        {/* Company Routes */}
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

        {/* Default redirect */}
        <Route path="/" element={<CompanyLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
