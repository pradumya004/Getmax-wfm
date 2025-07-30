// frontend/src/pages/auth/EmployeeLogin.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  Trophy,
  Target,
  BarChart3,
  Star,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../api/auth.api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Checkbox } from './../../components/ui/Checkbox';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = getTheme("employee");

  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await authAPI.employeeLogin(formData);
      if (response.success) {
        const {company, employee, companyToken, employeeToken } = response.data.data;
        await login(employee, companyToken, employeeToken, "employee");
        toast.success(response.message || "Login successful!");
        console.log("Login successful:.....", employeeToken);
        navigate("/employee/dashboard");
      } else {
        toast.error(response.message || "Invalid login credentials");
      }
    } catch (error) {
      toast.error(error.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} flex flex-col relative overflow-hidden`}
    >
      <Helmet>
        <title>Employee Login - GetMax WFM</title>
      </Helmet>

      {/* Background Visuals */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-0 left-0 w-96 h-96 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-0 right-0 w-80 h-80 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute top-1/2 left-1/3 w-64 h-64 bg-${theme.accent}/10 rounded-full blur-2xl animate-pulse`}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10 mt-6 mb-6 text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-xl mb-4`}
        >
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Employee Portal</h1>
        <p className={`text-${theme.textSecondary}`}>
          Access your work dashboard and profile
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* LEFT: Form */}
            <div className="flex">
              <Card
                variant="elevated"
                theme="employee"
                className="p-8 w-full flex flex-col justify-center"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="employeeId"
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                    >
                      Employee ID
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${theme.textSecondary}`}
                      />
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-black/20 border rounded-lg text-white placeholder-${
                          theme.textSecondary
                        } focus:outline-none focus:ring-2 ${
                          errors.employeeId
                            ? "border-red-500 focus:ring-red-500/50"
                            : `border-white/20 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50`
                        }`}
                        placeholder="EMP001"
                        disabled={loading}
                      />
                    </div>
                    {errors.employeeId && (
                      <div className="flex items-center mt-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-red-400 text-sm">
                          {errors.employeeId}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${theme.textSecondary}`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 bg-black/20 border rounded-lg text-white placeholder-${
                          theme.textSecondary
                        } focus:outline-none focus:ring-2 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500/50"
                            : `border-white/20 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50`
                        }`}
                        placeholder="Your password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${theme.textSecondary} hover:text-white`}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
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
                      <Checkbox
                        type="checkbox"
                        theme="employee"
                        className={`w-4 h-4 rounded border-white/20 text-${theme.accent} focus:ring-${theme.accent}/50 focus:ring-2`}
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <span
                        className={`ml-2 text-sm text-${theme.textSecondary}`}
                      >
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className={`text-sm text-[#1de9b6] hover:text-white`}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3 text-lg font-semibold"
                    theme="employee"
                  >
                    {loading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Clock In <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* RIGHT: Features */}
            <div className="flex flex-col space-y-6">
              <Card className="p-6 flex-1" theme="employee">
                <h3 className="text-white font-medium mb-4 text-center">
                  Employee Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[Trophy, Calendar, Target, BarChart3].map((Icon, i) => (
                    <div key={i} className="text-center">
                      <div
                        className={`w-12 h-12 mx-auto bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center mb-2`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Feature {i + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6" theme="employee">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-5 h-5 text-${theme.accent}`}>
                        ⭐
                      </div>
                    ))}
                  </div>
                  <p className={`text-${theme.textSecondary} text-sm mb-3`}>
                    "Logging in daily keeps me updated and ensures I'm always
                    connected with the team!"
                  </p>
                  <p className="text-white text-sm font-medium">
                    — John Doe, Senior Analyst
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 py-8">
        <div className="text-center mb-6">
          <p className={`text-${theme.textSecondary} text-sm mb-3`}>
            Need different access?
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/master-admin/login"
              className="text-[#1de9b6] hover:text-white text-sm font-medium"
            >
              Admin Login
            </Link>
            <span className={`text-${theme.textSecondary}`}>•</span>
            <Link
              to="/company/login"
              className="text-[#1de9b6] hover:text-white text-sm font-medium"
            >
              Company Login
            </Link>
          </div>
        </div>
        <div className="text-center">
          <p className={`text-${theme.textSecondary} text-xs`}>
            © 2024 GetMax WFM. Empowering workforces worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
