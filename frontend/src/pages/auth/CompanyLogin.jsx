// frontend/src/pages/auth/CompanyLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.jsx";
import { authAPI } from "../../api/auth.api.js";

export default function CompanyLogin({ isModal = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    companyEmail: "",
    companyPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use new authAPI instead of hardcoded fetch
      const response = await authAPI.companyLogin(formData);
      console.log("API Response:", response);

      if (response.success) {  
        const { company, token } = response.data.data;

        console.log("company:", company);
        console.log("token:", token);

        // Use the auth context login method
        login(company, token, "company");

        toast.success(response.message || "Login successful!");
        navigate("/company/dashboard");
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

  const isFormValid = formData.companyEmail && formData.companyPassword;

  return (
    <div
      className={`${
        isModal ? "" : "min-h-screen"
      } flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900`}
    >
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Company Portal
            </h2>
            <p className="text-white/70">
              Access your workforce management dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) =>
                  handleInputChange("companyEmail", e.target.value)
                }
                className="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                placeholder="Company Email"
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
                value={formData.companyPassword}
                onChange={(e) =>
                  handleInputChange("companyPassword", e.target.value)
                }
                className="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                placeholder="Password"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-white/80 text-sm"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
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
                    <span>Sign In</span>
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
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Forgot your password?
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-white/10 border border-white/20 rounded-xl">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>
                  Your login is secured with enterprise-grade encryption.
                </span>
              </div>
            </div>
          </form>

          {/* Alternative Login Links */}
          {!isModal && (
            <div className="mt-8 text-center space-y-2">
              <p className="text-white/70">
                Employee?{" "}
                <button
                  onClick={() => navigate("/employee/login")}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Employee Login
                </button>
              </p>
              <p className="text-white/70">
                System Admin?{" "}
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Admin Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
