import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setLoading(false);
      toast({
        title: "OTP sent successfully!",
        description: "Check your email for the verification code."
      });
    }, 1500);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Please enter the OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login successful!",
        description: "Welcome to GetMax RCM Dashboard"
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignup = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Login - GetMax RCM</title>
        <meta name="description" content="Secure login to GetMax RCM platform. Access your revenue cycle management dashboard with enterprise-grade security." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">GM</span>
              </div>
              <span className="text-2xl font-bold gradient-text">GetMax RCM</span>
            </Link>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-glass-dark border-[#39ff14]/20 glow-green">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">
                  {isOtpSent ? 'Verify OTP' : 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isOtpSent 
                    ? 'Enter the verification code sent to your email'
                    : 'Sign in to your GetMax RCM account'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="admin@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-black/20 border-[#39ff14]/30 text-white placeholder:text-gray-400 focus:border-[#39ff14]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green-intense"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Verification Code
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="pl-10 bg-black/20 border-[#39ff14]/30 text-white placeholder:text-gray-400 focus:border-[#39ff14] text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Code sent to {email}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green-intense"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <>
                          Verify & Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-[#39ff14] hover:bg-[#39ff14]/10"
                      onClick={() => setIsOtpSent(false)}
                    >
                      Back to Email
                    </Button>
                  </form>
                )}

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-black/20 rounded-lg border border-[#39ff14]/20">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Shield className="h-4 w-4 text-[#39ff14]" />
                    <span>Enterprise domain whitelist enabled</span>
                  </div>
                </div>

                {/* Signup Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Need an account?{' '}
                    <button
                      onClick={handleSignup}
                      className="text-[#39ff14] hover:underline font-medium"
                    >
                      Contact Admin
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 p-4 bg-black/20 rounded-lg border border-[#39ff14]/20"
          >
            <p className="text-xs text-gray-400 text-center">
              Demo: Use any email address to receive OTP
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}