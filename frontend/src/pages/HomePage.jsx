// frontend/src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  Star,
  Lock,
  Eye,
  Award,
  Database,
  Key,
  FileCheck,
  Menu,
  X,
  Users,
  Shield,
  TrendingUp,
  BarChart3,
  Settings,
  Zap,
  Clock,
  Play,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SignupModal from "./auth/SignupModal.jsx";

const Button = ({ children, size, variant, className, onClick }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl";
  const sizeClasses =
    size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base";
  const variantClasses = variant === "outline" ? "border-2 bg-transparent" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Homepage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    console.log("login clicked");
    navigate("/company/login");
  };

  const handleSignup = () => {
    console.log("Signup Clicked");
  };

  const navItems = [
    { name: "Features", href: "#features", hasDropdown: false },
    { name: "Solutions", href: "#solutions", hasDropdown: true },
    { name: "Testimonials", href: "#testimonials", hasDropdown: false },
    { name: "Compliance", href: "#compliance", hasDropdown: false },
    { name: "Resources", href: "#resources", hasDropdown: true },
  ];

  const solutionsDropdown = [
    "Workforce Management",
    "Quality Assurance",
    "Revenue Optimization",
    "Process Automation",
  ];

  const resourcesDropdown = [
    "Documentation",
    "Case Studies",
    "ROI Calculator",
    "Support Center",
  ];

  const modules = [
    {
      title: "Workforce Management",
      description:
        "Optimize team productivity with intelligent scheduling, performance tracking, and resource allocation across all departments.",
      icon: Users,
      color: "from-cyan-400 to-blue-500",
      gradient: "from-cyan-500/20 to-blue-600/20",
      hoverGradient: "from-cyan-400/30 to-blue-500/30",
      features: [
        "Smart Scheduling",
        "Performance Analytics",
        "Resource Optimization",
      ],
    },
    {
      title: "Quality Assurance",
      description:
        "Ensure compliance and accuracy with automated quality checks, audit trails, and comprehensive reporting systems.",
      icon: Shield,
      color: "from-purple-400 to-indigo-500",
      gradient: "from-purple-500/20 to-indigo-600/20",
      hoverGradient: "from-purple-400/30 to-indigo-500/30",
      features: ["Automated QA", "Audit Trails", "Compliance Reports"],
    },
    {
      title: "Revenue Optimization",
      description:
        "Maximize revenue potential through intelligent claim processing, denial management, and payment optimization.",
      icon: TrendingUp,
      color: "from-blue-400 to-purple-500",
      gradient: "from-blue-500/20 to-purple-600/20",
      hoverGradient: "from-blue-400/30 to-purple-500/30",
      features: ["Claim Processing", "Denial Management", "Payment Tracking"],
    },
    {
      title: "Analytics & Reporting",
      description:
        "Get deep insights with real-time dashboards, predictive analytics, and customizable reporting tools.",
      icon: BarChart3,
      color: "from-indigo-400 to-cyan-500",
      gradient: "from-indigo-500/20 to-cyan-600/20",
      hoverGradient: "from-indigo-400/30 to-cyan-500/30",
      features: [
        "Real-time Dashboards",
        "Predictive Analytics",
        "Custom Reports",
      ],
    },
    {
      title: "Process Automation",
      description:
        "Streamline operations with intelligent automation, workflow optimization, and seamless system integrations.",
      icon: Settings,
      color: "from-cyan-400 to-indigo-500",
      gradient: "from-cyan-500/20 to-indigo-600/20",
      hoverGradient: "from-cyan-400/30 to-indigo-500/30",
      features: [
        "Workflow Automation",
        "System Integration",
        "Process Optimization",
      ],
    },
    {
      title: "Performance Boost",
      description:
        "Accelerate your operations with lightning-fast processing, optimized workflows, and intelligent prioritization.",
      icon: Zap,
      color: "from-purple-400 to-blue-500",
      gradient: "from-purple-500/20 to-blue-600/20",
      hoverGradient: "from-purple-400/30 to-blue-500/30",
      features: [
        "Fast Processing",
        "Smart Prioritization",
        "Optimized Workflows",
      ],
    },
  ];

  const handleDemo = () => {
    console.log("Book a Demo clicked");
  };

  const handleTrial = () => {
    console.log("Start Free Trial clicked");
  };
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Financial Officer",
      company: "Metropolitan Health System",
      content:
        "GetMax RCM increased our revenue by 35% in just 6 months. The AI-powered denial management is revolutionary.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Revenue Cycle Director",
      company: "Sunrise Medical Group",
      content:
        "The automation features saved us 20 hours per week on manual tasks. Our staff can now focus on patient care.",
      rating: 5,
    },
    {
      name: "Jennifer Martinez",
      role: "Practice Administrator",
      company: "Coastal Healthcare Partners",
      content:
        "Outstanding support team and intuitive interface. Our claim approval rate improved from 78% to 94%.",
      rating: 5,
    },
  ];

  const Card = ({ children, className }) => (
    <div className={className}>{children}</div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`p-6 pb-4 ${className}`}>{children}</div>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`px-6 pb-6 pt-0 ${className}`}>{children}</div>
  );

  const CardDescription = ({ children, className = "" }) => (
    <div className={className}>{children}</div>
  );
  const complianceBadges = [
    { name: "HIPAA", icon: Shield },
    { name: "SOC 2", icon: Lock },
    { name: "GDPR", icon: Eye },
    { name: "ISO 27001", icon: Award },
    { name: "PCI DSS", icon: CheckCircle },
    { name: "HITECH", icon: Database },
    { name: "SSL/TLS", icon: Key },
    { name: "FDA CFR", icon: FileCheck },
  ];

  const Badge = ({ children, variant, className }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}
    >
      {children}
    </span>
  );

  const benefits = [
    "35% Average Revenue Increase",
    "20+ Hours Saved Weekly",
    "94% Claim Approval Rate",
    "24/7 Expert Support",
  ];

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Integrations", href: "#integrations" },
      { name: "API Documentation", href: "#api" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Press Kit", href: "#press" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Support", href: "#contact" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Privacy Policy", href: "#privacy" },
    ],
  };
  const socialLinks = [
    { icon: FaTwitter, href: "#", name: "Twitter" },
    { icon: FaLinkedin, href: "#", name: "LinkedIn" },
    { icon: FaFacebook, href: "#", name: "Facebook" },
    { icon: FaYoutube, href: "#", name: "YouTube" },
  ];

  return (
    <div>
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-slate-900/95 backdrop-blur-xl border-b border-cyan-400/30 shadow-lg shadow-cyan-500/10"
              : "bg-slate-900/70 backdrop-blur-lg border-b border-cyan-400/20"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Enhanced Logo */}
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg">GM</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block">
                    GetMax RCM
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">
                    Revenue Cycle Management
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() =>
                      item.hasDropdown && setActiveDropdown(item.name)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-cyan-400 transition-all duration-300 flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-cyan-400/10 font-medium relative group"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`h-4 w-4 transition-all duration-300 ${
                            activeDropdown === item.name
                              ? "rotate-180 text-cyan-400"
                              : ""
                          }`}
                        />
                      )}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                    </a>

                    {/* Enhanced Dropdown Menu */}
                    {item.hasDropdown && activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/20 py-3 shadow-cyan-500/10">
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-900/95 border-l border-t border-cyan-400/20 rotate-45"></div>
                        {(item.name === "Solutions"
                          ? solutionsDropdown
                          : resourcesDropdown
                        ).map((dropdownItem, index) => (
                          <a
                            key={dropdownItem}
                            href="#"
                            className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 border-l-2 border-transparent hover:border-cyan-400 mx-2 rounded"
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            {dropdownItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleLogin}
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-cyan-400/10 font-medium border border-transparent hover:border-cyan-400/30"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 overflow-hidden group"
                >
                  <a
                    className="relative z-10"
                    onClick={() => setShowSignup(true)}
                  >
                    Get Started
                  </a>
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                </button>
              </div>

              {/* Enhanced Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-300 p-2 rounded-lg hover:bg-cyan-400/10"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-400/20 rounded-xl shadow-xl shadow-cyan-500/10">
                <div className="px-4 py-6 space-y-4">
                  {navItems.map((item, index) => (
                    <div
                      key={item.name}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-cyan-400 block py-3 px-4 rounded-lg transition-all duration-300 hover:bg-cyan-400/10 border-l-2 border-transparent hover:border-cyan-400 font-medium"
                      >
                        {item.name}
                      </a>
                      {item.hasDropdown && (
                        <div className="ml-6 mt-2 space-y-2">
                          {(item.name === "Solutions"
                            ? solutionsDropdown
                            : resourcesDropdown
                          ).map((dropdownItem) => (
                            <a
                              key={dropdownItem}
                              href="#"
                              className="text-gray-400 hover:text-cyan-400 block py-2 px-4 text-sm transition-all duration-200 rounded-lg hover:bg-cyan-400/5"
                            >
                              {dropdownItem}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-6 border-t border-cyan-400/20 space-y-4">
                    <button
                      onClick={handleLogin}
                      className="text-gray-300 hover:text-cyan-400 block py-3 px-4 w-full text-left rounded-lg transition-all duration-300 hover:bg-cyan-400/10 font-medium border border-transparent hover:border-cyan-400/30"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignup}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold w-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="opacity-100">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  Automate Your RCM Ops
                </span>
                <br />
                <span className="text-white drop-shadow-2xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  with Confidence
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto drop-shadow-lg font-medium">
                Workforce, Quality & Revenue Management, All in One Platform.
                <br />
                <span className="text-blue-200">
                  Built for RCM vendors, billing companies, and healthcare
                  providers.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 border-2 border-cyan-300"
                  onClick={handleDemo}
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
                <button
                  className="border-2 border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 backdrop-blur-sm"
                  onClick={handleTrial}
                >
                  Start Free Trial
                </button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { label: "SLA Compliance", value: "99.2%" },
                  { label: "Productivity Boost", value: "40%" },
                  { label: "Processing Speed", value: "60%" },
                  { label: "Client Satisfaction", value: "98%" },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center group hover:transform hover:scale-110 transition-all duration-300"
                  >
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)]">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-sm font-medium mt-1 group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional visual enhancement - floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-80 animate-ping delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-70 animate-ping delay-500"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-60 animate-ping delay-700"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-16 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-80 animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-70 animate-ping delay-500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-60 animate-ping delay-700"></div>
        </div>
        <section id="features" className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  Powerful Modules
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto drop-shadow-lg font-medium">
                Comprehensive suite of tools designed to optimize every aspect
                of your
                <span className="text-cyan-300"> revenue cycle management</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <div
                  key={module.title}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Card glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${module.hoverGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110`}
                  ></div>

                  {/* Main card */}
                  <div
                    className={`relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 group-hover:border-cyan-400/50 rounded-2xl p-8 h-full transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-xl group-hover:shadow-2xl`}
                  >
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {module.title}
                      </h3>

                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Feature list */}
                      <ul className="space-y-2 pt-2">
                        {module.features.map((feature, featureIndex) => (
                          <li
                            key={feature}
                            className="flex items-center text-sm text-gray-400 group-hover:text-cyan-300 transition-all duration-300"
                            style={{
                              transitionDelay: `${featureIndex * 100}ms`,
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <span className="group-hover:translate-x-2 transition-transform duration-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Learn more button */}
                      <div className="pt-4">
                        <button className="flex items-center text-cyan-400 hover:text-cyan-300 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <span>Learn More</span>
                          <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center px-8 py-4 bg-slate-900/50 backdrop-blur-xl rounded-full border border-cyan-400/30 shadow-lg">
                <Clock className="h-5 w-5 text-cyan-400 mr-3" />
                <span className="text-gray-300 mr-4">
                  Ready to transform your RCM operations?
                </span>
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="max-w-7xl mx-auto relative z-10">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-ping"></div>
            <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50 animate-pulse"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-blue-200 border border-white/20">
                Client Success Stories
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
              See how GetMax RCM is transforming revenue cycle operations across
              healthcare organizations worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="group cursor-pointer"
              >
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full overflow-hidden shadow-2xl hover:shadow-blue-500/20 rounded-2xl">
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"></div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">"</span>
                      </div>
                    </div>
                    <CardDescription className="text-blue-50/90 text-base leading-relaxed font-medium italic relative">
                      <span className="text-2xl text-blue-300/60 absolute -top-2 -left-2">
                        "
                      </span>
                      <span className="pl-4">{testimonial.content}</span>
                      <span className="text-2xl text-blue-300/60"> "</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-blue-300 font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-blue-200/70 text-sm">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-blue-100/80 mb-6 text-lg">
              Ready to join these success stories?
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              Start Your Success Story
            </button>
          </motion.div>
        </section>

        <section id="compliance" className="relative py-24 px-6 ">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-32 right-16 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-1/3 right-1/4 w-32 h-32 bg-indigo-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "0.8s" }}
            ></div>
          </div>

          {/* Security pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Floating security elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-16 animate-float">
              <Shield className="h-8 w-8 text-blue-300/30" />
            </div>
            <div
              className="absolute top-32 right-24 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Lock className="h-6 w-6 text-purple-300/30" />
            </div>
            <div
              className="absolute bottom-24 left-32 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <Key className="h-7 w-7 text-indigo-300/30" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <div className="inline-block mb-6">
                <span className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-blue-200 border border-white/20 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Compliance
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Enterprise-Grade
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  Security
                </span>
              </h2>

              <p className="text-xl text-blue-100/80 mb-16 max-w-4xl mx-auto leading-relaxed">
                Your data is protected with industry-leading security standards
                and compliance certifications, ensuring the highest level of
                protection for your healthcare information
              </p>

              {/* Security stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    99.9%
                  </div>
                  <div className="text-blue-200">Uptime Guarantee</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    256-bit
                  </div>
                  <div className="text-blue-200">SSL Encryption</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-blue-200">Security Monitoring</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Compliance badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-12">
              {complianceBadges.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  className="group flex flex-col items-center space-y-4 cursor-pointer"
                >
                  {/* Icon container */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 group-hover:border-white/40 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-50 animate-spin-slow"></div>

                    <badge.icon className="h-12 w-12 text-white group-hover:text-blue-200 transition-colors duration-300 relative z-10" />

                    {/* Success checkmark */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Badge label */}
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white bg-white/5 backdrop-blur-sm group-hover:border-white/50 group-hover:bg-white/10 transition-all duration-300 px-4 py-2 font-semibold"
                  >
                    {badge.name}
                  </Badge>

                  {/* Compliance status */}
                  <div className="text-xs text-blue-200/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✓ Certified
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </section>

        <section id="CTA" className="relative py-24 px-6 ">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 animate-float">
              <Sparkles className="h-8 w-8 text-blue-300/40" />
            </div>
            <div
              className="absolute top-40 right-1/3 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="h-6 w-6 text-purple-300/40" />
            </div>
            <div
              className="absolute bottom-32 left-1/3 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <TrendingUp className="h-7 w-7 text-indigo-300/40" />
            </div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              {/* Main headline */}
              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  Your RCM?
                </span>
              </h2>

              <p className="text-xl text-blue-100/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                Join hundreds of healthcare organizations already using GetMax
                RCM to optimize their revenue cycle and maximize their financial
                performance
              </p>

              {/* Benefits grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-blue-100 font-medium">
                      {benefit}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-blue-500/30"
                onClick={handleDemo}
              >
                <Play className="mr-2 h-5 w-5" />
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50 shadow-xl"
                onClick={handleTrial}
              >
                Start Free Trial
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <style jsx>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-15px) rotate(5deg);
              }
            }

            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
          `}</style>
        </section>

        <footer className="relative py-16 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden text-white">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-32 right-32 w-80 h-80 bg-purple-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "0.8s" }}
            />
          </div>

          {/* Floating sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-1/4 animate-float">
              <Sparkles className="h-6 w-6 text-blue-300/30" />
            </div>
            <div
              className="absolute top-32 right-1/4 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <Sparkles className="h-4 w-4 text-purple-300/30" />
            </div>
            <div
              className="absolute bottom-24 left-1/3 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="h-5 w-5 text-indigo-300/30" />
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-16 border border-white/20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Stay Updated with{" "}
                    <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                      GetMax RCM
                    </span>
                  </h3>
                  <p className="text-blue-100/80 text-lg">
                    Get the latest updates on RCM trends, product features, and
                    industry insights delivered to your inbox.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-blue-200/60 focus:outline-none focus:border-white/40"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center gap-2">
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-lg">GM</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    GetMax RCM
                  </span>
                </div>

                <p className="text-blue-100/80 text-lg mb-6">
                  AI-powered revenue cycle management platform transforming
                  healthcare organizations worldwide with intelligent automation
                  and analytics.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-blue-200/80">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200/80">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">hello@getmaxrcm.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">San Francisco, CA</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-300"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {Object.entries(footerLinks).map(
                ([category, links], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + categoryIndex * 0.1,
                    }}
                  >
                    <h4 className="text-white font-bold text-lg mb-6 capitalize">
                      {category}
                    </h4>
                    <div className="space-y-3">
                      {links.map((link, linkIndex) => (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          className="group flex items-center gap-2 text-blue-200/80 hover:text-white transition-all duration-300"
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.3 + linkIndex * 0.05,
                          }}
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.name}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* Bottom Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border-t border-white/20 pt-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-blue-200/80 text-sm">
                  © 2024 GetMax RCM. All rights reserved.
                </p>
                <div className="flex gap-6">
                  <a
                    href="#"
                    className="text-blue-200/80 hover:text-white text-sm"
                  >
                    🔒 Security
                  </a>
                  <a
                    href="#"
                    className="text-blue-200/80 hover:text-white text-sm"
                  >
                    📊 Status
                  </a>
                  <a
                    href="#"
                    className="text-blue-200/80 hover:text-white text-sm"
                  >
                    🗺️ Sitemap
                  </a>
                </div>
                <div className="text-right text-blue-200/60 text-xs">
                  <p>Made with ❤️ for Healthcare</p>
                  <p>Trusted by 500+ Organizations</p>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
