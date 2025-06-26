import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Shield } from "lucide-react";

export default function EmployeeLogin() {
  const navigate = useNavigate();
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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle employee login success/failure here
      console.log("Employee login attempt:", formData);

      // Navigate to employee dashboard on successful login
      navigate("/employee/dashboard");
    }, 2000);
  };

  const isFormValid = formData.employeeId && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/10 p-8 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Employee Login
                </h1>
                <p className="text-white/80">Access your work dashboard</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee ID */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className="w-full px-4 py-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  placeholder="Employee ID"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
    </div>
  );
}
