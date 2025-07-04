// frontend/src/pages/auth/EmployeeLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.jsx";
import { authAPI } from "../../api/auth.api.js";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting login form with data:", formData);

      // Use new authAPI instead of hardcoded fetch
      const response = await authAPI.employeeLogin(formData);
      console.log("Login response:", response);

      if (response.success) {
        const { employee, token } = response.data.data;

        console.log("Employee data:", employee);
        console.log("Token:", token);

        // Use the auth context login method
        login(employee, token, "employee");

        toast.success(response.message || "Login successful!");
        navigate("/employee/dashboard");
      } else {
        toast.error(response.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.employeeId && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Employee Portal
            </h2>
            <p className="text-white/70">
              Access your work dashboard and profile
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) =>
                  handleInputChange("employeeId", e.target.value.toUpperCase())
                }
                className="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                placeholder="Employee ID (e.g., EMP001)"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                placeholder="Password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/20 text-white/60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Clock In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                Forgot your password?
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-white/10 border border-white/20 rounded-xl">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Shield className="w-4 h-4 text-green-400" />
                <span>
                  Your attendance and work data is secure and private.
                </span>
              </div>
            </div>
          </form>

          {/* Company Login Link */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Company admin?{" "}
              <button
                onClick={() => navigate("/company/login")}
                className="text-green-400 hover:text-green-300 transition-colors font-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
