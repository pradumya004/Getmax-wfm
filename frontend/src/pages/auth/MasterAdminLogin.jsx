// frontend/src/pages/auth/MasterAdminLogin.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Monitor,
  Settings,
  BarChart3,
  Network,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../api/auth.api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

const MasterAdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "sriram@getmaxsolutions.com",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = getTheme("master_admin");
  console.log("Checking Theme At Master Admin Login: ", theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
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

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.masterAdminLogin(credentials);
      console.log("API Response:", response);

      if (response.success) {
        const data =
          response.data && response.data.data && response.data.data.data
            ? response.data.data.data
            : {};
        console.log("Master Admin data:", data);
        const { master, token1, token2 } = data;
        console.log("Master Admin Info:", master);
        console.log("Token1:", token1);
        console.log("Token2:", token2);

        // Using fake master-admin-token for master admin
        await login(master, token1, token2, "master_admin");
        toast.success(response.message || "Master Admin Login successful!");
        navigate("/master-admin/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("❌ Master admin login failed:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
      setErrors("Login failed. Please check your master password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} flex flex-col items-center justify-center p-6 relative overflow-hidden`}
    >
      <Helmet>
        <title>{`Master Admin Login - GetMax WFM Platform`}</title>
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
      <div className="relative z-10 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-xl mb-2`}
        >
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Master Admin Portal
        </h1>
        <p className={`text-${theme.textSecondary}`}>
          GetMax WFM Administrative Panel
        </p>

        {/* Security Warning */}
        <div className="mt-2 mb-6 pt-2 pb-2 pr-4 pl-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center space-x-2 text-sm text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Restricted access - Admin credentials required</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* LEFT COLUMN - Login Form */}
            <div className="flex">
              <Card
                variant="elevated"
                theme="master_admin"
                className="p-8 w-full flex flex-col justify-center"
              >
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                    >
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${theme.textSecondary}`}
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-black/20 border rounded-lg text-white placeholder-${
                          theme.textSecondary
                        } focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500/50"
                            : `border-white/20 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50`
                        }`}
                        placeholder="Enter your admin email"
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
                        name="password"
                        value={credentials.password}
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

                  {/* Login Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    theme="master_admin"
                    className="w-full py-3 text-lg font-semibold"
                    onClick={handleLogin}
                  >
                    {loading ? (
                      "Authenticating..."
                    ) : (
                      <>
                        Access Admin Portal
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Security Notice */}
                <div
                  className={`mt-6 p-4 rounded-lg bg-${theme.accent}/10 border border-${theme.accent}/20`}
                >
                  <div className="flex items-start space-x-3">
                    <Shield
                      className={`w-5 h-5 text-${theme.accent} flex-shrink-0 mt-0.5`}
                    />
                    <div>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        <strong className="text-white">Security Notice:</strong>{" "}
                        All admin access attempts are logged and monitored.
                        Unauthorized access attempts will be reported.
                      </p>
                    </div>
                  </div>
                </div>

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
              <Card className="p-6 flex-1" theme="master_admin">
                <h3 className="text-white font-medium mb-4 text-center">
                  Admin Capabilities
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Platform Management
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Analytics & Reports
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      System Monitoring
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Network className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Network Configuration
                    </p>
                  </div>
                </div>
              </Card>

              {/* Alternative Login Options */}
              <Card className="p-4" theme="master_admin">
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <p className={`text-${theme.textSecondary} text-sm mb-3`}>
                      Not an admin?
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <Link
                        to="/company/login"
                        className={`text-${theme.accent} hover:text-white transition-colors text-sm font-medium`}
                      >
                        Company Login
                      </Link>
                      <span className={`text-${theme.textSecondary}`}>•</span>
                      <Link
                        to="/employee/login"
                        className={`text-${theme.accent} hover:text-white transition-colors text-sm font-medium`}
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminLogin;
