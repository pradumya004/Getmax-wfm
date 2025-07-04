// frontend/src/pages/auth/signup/SignupSuccess.jsx

// UPDATED - Enhanced success page with better integration

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  CheckCircle,
  Mail,
  ArrowRight,
  Building,
  Users,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";

const SignupSuccess = ({ companyData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);

  // Get company data from props or location state
  const company = companyData || location.state?.companyData || user;

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/company/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <Helmet>
        <title>Welcome to GetMax - Registration Complete</title>
      </Helmet>

      <div className="max-w-4xl w-full">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">
              🎉 Welcome to GetMax WFM!
            </h1>
            <p className="text-xl text-blue-200 mb-2">
              Your company account has been successfully created
            </p>
            <p className="text-blue-300">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>

          {/* Company Info Card */}
          {company && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Building className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold text-white">
                  {company.companyName}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Company ID</p>
                  <p className="text-white font-mono text-lg">
                    {company.companyId || "Generating..."}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Subscription Plan</p>
                  <p className="text-white text-lg">
                    {company.subscriptionPlan || "Professional"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Status</p>
                  <p className="text-green-400 text-lg font-medium">
                    ✅ Active
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              What's Next?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h4 className="text-white font-semibold mb-3">
                  Setup Organization
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Configure departments, roles, and your organizational
                  structure
                </p>
                <div className="flex items-center justify-center text-blue-400">
                  <Settings className="w-4 h-4 mr-1" />
                  <span className="text-xs">Ready to configure</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="text-white font-semibold mb-3">Add Your Team</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Invite employees and start managing your workforce
                </p>
                <div className="flex items-center justify-center text-purple-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-xs">Add employees</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="text-white font-semibold mb-3">
                  Start Managing
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Track performance, manage tasks, and boost productivity
                </p>
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Ready to go!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Configuration Summary */}
          {company?.contractSettings && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium mb-2">
                    Contract Configuration Complete
                  </h4>
                  <p className="text-yellow-200 text-sm">
                    Your service contracts have been configured based on your
                    selections. You can modify these settings anytime in your
                    company settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Verification Notice */}
          <div className="flex items-start space-x-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8">
            <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-left">
              <p className="text-blue-300 font-medium mb-1">
                📧 Check Your Email
              </p>
              <p className="text-blue-200 text-sm">
                We've sent a welcome email with important account information to{" "}
                <span className="font-mono text-blue-100">
                  {company?.contactEmail || company?.companyEmail}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              theme="company"
              onClick={() => {
                setCountdown(0);
                navigate("/company/dashboard");
              }}
              className="inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Go to Dashboard Now</span>
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              theme="company"
              onClick={() => navigate("/")}
              className="px-8 py-4"
            >
              Back to Home
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-gray-400 text-sm">
              Need help getting started? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2">
              <a
                href="mailto:support@getmax.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                📧 support@getmax.com
              </a>
              <span className="hidden sm:block text-gray-500">•</span>
              <a
                href="tel:+1-800-GETMAX"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                📞 1-800-GETMAX
              </a>
              <span className="hidden sm:block text-gray-500">•</span>
              <a
                href="https://docs.getmax.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                📖 Documentation
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupSuccess;
