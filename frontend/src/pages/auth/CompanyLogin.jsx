// frontend/src/pages/auth/CompanyLogin.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Users,
  BarChart3,
  Settings,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../api/auth.api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = getTheme("company");
  console.log("Checking Theme At Company Login: ", theme);

  const [formData, setFormData] = useState({
    companyEmail: "",
    companyPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.companyPassword) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.companyLogin(formData);
      console.log("API Response:", response);

      if (response.success) {
        const data =
          response.data && response.data.data ? response.data.data : {};
        const { company, employee, companyToken, employeeToken } = data;
        console.log("Company data:", company);
        console.log("Employee data:", employee);
        console.log("Company token:", companyToken);
        console.log("Employee token:", employeeToken);

        await login(company, companyToken, employeeToken, "company");
        toast.success(response.message || "Login successful!");
        navigate("/company/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Company login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} flex flex-col relative overflow-hidden`}
    >
      <Helmet>
        <title>Company Login - GetMax WFM</title>
      </Helmet>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-0 left-0 w-96 h-96 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-80 h-80 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/3 w-64 h-64 bg-${theme.accent}/10 rounded-full blur-2xl animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* HEADER */}
      <div className="relative z-10 mt-14 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-xl mb-4`}
        >
          <Building className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Company Portal</h1>
        <p className={`text-${theme.textSecondary}`}>
          Manage your workforce with GetMax WFM
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* LEFT COLUMN - Login Form */}
            <div className="flex">
              <Card
                variant="elevated"
                theme="company"
                className="p-8 w-full flex flex-col justify-center"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                    >
                      Company Email
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${theme.textSecondary}`}
                      />
                      <input
                        type="email"
                        id="email"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-black/20 border rounded-lg text-white placeholder-${
                          theme.textSecondary
                        } focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500/50"
                            : `border-white/20 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50`
                        }`}
                        placeholder="Enter your company email"
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center mt-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-red-400 text-sm">
                          {errors.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="companyPassword"
                        value={formData.companyPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 bg-black/20 border rounded-lg text-white placeholder-${
                          theme.textSecondary
                        } focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500/50"
                            : `border-white/20 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50`
                        }`}
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${theme.textSecondary} hover:text-white transition-colors`}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-800" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-800" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center mt-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-red-400 text-sm">
                          {errors.password}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className={`w-4 h-4 rounded border-white/20 text-${theme.accent} focus:ring-${theme.accent}/50 focus:ring-2`}
                      />
                      <span
                        className={`ml-2 text-sm text-${theme.textSecondary}`}
                      >
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className={`text-sm text-${theme.accent} hover:text-white transition-colors`}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3 text-lg font-semibold"
                    theme="company"
                  >
                    {loading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Access Company Portal
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 text-center">
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Don't have a company account?{" "}
                    <Link
                      to="/company/signup"
                      className={`text-${theme.accent} hover:text-white transition-colors font-medium`}
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN - Features */}
            <div className="flex flex-col space-y-6">
              {/* Features Overview */}
              <Card className="p-6 flex-1" theme="company">
                <h3 className="text-white font-medium mb-4 text-center">
                  Company Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Employee Management
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Performance Analytics
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Organization Setup
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Bulk Onboarding
                    </p>
                  </div>
                </div>
              </Card>

              {/* Testimonial */}
              <Card className="p-6" theme="company">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-5 h-5 text-${theme.accent}`}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                  <p className={`text-${theme.textSecondary} text-sm mb-3`}>
                    "GetMax WFM has transformed how we manage our workforce. The
                    analytics and automation features have saved us countless
                    hours."
                  </p>
                  <p className="text-white text-sm font-medium">
                    — Sarah Johnson, TechCorp Solutions
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 py-8">
        {/* Alternative Login Options */}
        <div className="text-center mb-6">
          <p className={`text-${theme.textSecondary} text-sm mb-3`}>
            Need different access?
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/master-admin/login"
              className={`text-blue-500 hover:text-white transition-colors text-sm font-medium`}
            >
              Admin Login
            </Link>
            <span className={`text-${theme.textSecondary}`}>•</span>
            <Link
              to="/employee/login"
              className={`text-blue-500 hover:text-white transition-colors text-sm font-medium`}
            >
              Employee Login
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className={`text-${theme.textSecondary} text-xs`}>
            © 2024 GetMax WFM. Empowering businesses worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
