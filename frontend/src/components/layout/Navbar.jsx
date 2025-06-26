import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, Menu, X } from "lucide-react";

export default function Navbar({
  user = { name: "John Doe", role: "Admin" },
  theme = "default", // "default", "admin", "company", "employee"
  onLogout,
}) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getThemeClasses = () => {
    switch (theme) {
      case "admin":
        return {
          bg: "bg-gradient-to-r from-red-600/90 to-orange-600/90 backdrop-blur-xl border-b border-white/10",
          text: "text-white",
          accent: "text-red-300",
        };
      case "company":
        return {
          bg: "bg-white/10 backdrop-blur-xl border-b border-white/20",
          text: "text-white",
          accent: "text-blue-300",
        };
      case "employee":
        return {
          bg: "bg-white/10 backdrop-blur-xl border-b border-white/20",
          text: "text-white",
          accent: "text-green-300",
        };
      default:
        return {
          bg: "bg-white/10 backdrop-blur-xl border-b border-white/20",
          text: "text-white",
          accent: "text-blue-300",
        };
    }
  };

  const classes = getThemeClasses();

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Call onLogout callback if provided
    if (onLogout) {
      onLogout();
    }

    // Navigate to login page based on user role
    switch (user.role?.toLowerCase()) {
      case "admin":
        navigate("/admin/login");
        break;
      case "employee":
        navigate("/employee/login");
        break;
      default:
        navigate("/company/login");
    }
  };

  const getProfilePath = () => {
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "/admin/profile";
      case "employee":
        return "/employee/profile";
      default:
        return "/company/profile";
    }
  };

  const getSettingsPath = () => {
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "/admin/settings";
      case "employee":
        return "/employee/settings";
      default:
        return "/company/settings";
    }
  };

  return (
    <nav className={classes.bg}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold text-white hover:text-white/80 transition-colors"
            >
              GetMax WFM
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/60">{user.role}</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate(getProfilePath());
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors w-full text-left"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate(getSettingsPath());
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors w-full text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="border-white/20 my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-300 hover:bg-white/20 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
