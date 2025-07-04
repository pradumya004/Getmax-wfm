// frontend/src/components/layout/Header.jsx

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Maximize,
  Minimize,
  HelpCircle,
  MessageSquare,
  X,
  Menu,
  Command,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { Button } from "../ui/Button.jsx";

// Custom hook for click outside
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
};

// Custom hook for keyboard navigation
const useKeyboardNavigation = (isOpen, onClose, onAction) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && onAction) {
        onAction();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onAction]);
};

// Notification component for better reusability
const NotificationItem = ({ notification, theme, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer ${
      notification.unread ? "bg-white/5" : ""
    }`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">
          {notification.title}
        </h4>
        <p className={`text-${theme.textSecondary} text-sm mt-1 line-clamp-2`}>
          {notification.message}
        </p>
        <p className={`text-${theme.textSecondary} text-xs mt-2`}>
          {notification.time}
        </p>
      </div>
      {notification.unread && (
        <div
          className={`w-2 h-2 bg-${theme.accent} rounded-full flex-shrink-0 mt-1`}
          aria-label="Unread notification"
        />
      )}
    </div>
  </div>
);

// User avatar component
const UserAvatar = ({ user, userType, theme, size = "w-8 h-8" }) => {
  const displayName = user?.companyName || user?.firstName || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`${size} bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center font-bold text-white`}
      aria-label={`${displayName} avatar`}
    >
      {initials}
    </div>
  );
};

// Search component with debouncing
const SearchBar = ({ theme, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new timeout for debounced search
      debounceRef.current = setTimeout(() => {
        onSearch?.(value);
      }, 300);
    },
    [onSearch]
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(searchQuery);
    } else if (e.key === "/" && e.metaKey) {
      e.preventDefault();
      searchRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="relative group">
      <div
        className={`flex items-center transition-all duration-200 ${
          isSearchFocused ? "transform scale-105" : ""
        }`}
      >
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${
            theme.textSecondary
          } transition-colors ${isSearchFocused ? "text-white" : ""}`}
        />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search employees, roles, departments..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className={`w-full pl-10 pr-12 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50 focus:border-${theme.accent}/50 transition-all duration-200`}
          aria-label="Search"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <kbd
            className={`hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-black/30 text-${theme.textSecondary} border border-white/20 rounded`}
          >
            <Command className="w-3 h-3 mr-1" />K
          </kbd>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, user, logout } = useAuth();
  const theme = getTheme(userType);

  // State management
  const [dropdownStates, setDropdownStates] = useState({
    userMenu: false,
    notifications: false,
    mobileMenu: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Refs for click outside
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown helper
  const closeDropdown = useCallback((dropdown) => {
    setDropdownStates((prev) => ({ ...prev, [dropdown]: false }));
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setDropdownStates({
      userMenu: false,
      notifications: false,
      mobileMenu: false,
    });
  }, []);

  // Click outside handlers
  useClickOutside(userMenuRef, () => closeDropdown("userMenu"));
  useClickOutside(notificationsRef, () => closeDropdown("notifications"));
  useClickOutside(mobileMenuRef, () => closeDropdown("mobileMenu"));

  // Keyboard navigation
  useKeyboardNavigation(dropdownStates.userMenu, () =>
    closeDropdown("userMenu")
  );
  useKeyboardNavigation(dropdownStates.notifications, () =>
    closeDropdown("notifications")
  );

  // Memoized values
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length >= 2) {
      const section = segments[1];
      return (
        section.charAt(0).toUpperCase() +
        section.slice(1).replace(/([A-Z])/g, " $1")
      );
    }
    return "Dashboard";
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    return segments.map((segment, index) => ({
      label:
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/([A-Z])/g, " $1"),
      path: "/" + segments.slice(0, index + 1).join("/"),
      isLast: index === segments.length - 1,
    }));
  }, [location.pathname]);

  // Mock data with better structure
  const mockNotifications = useMemo(
    () => [
      {
        id: 1,
        title: "New employee added",
        message: "John Doe has been added to Engineering department",
        time: "5m ago",
        unread: true,
        type: "employee",
      },
      {
        id: 2,
        title: "Report ready",
        message: "Monthly performance report is ready for review",
        time: "1h ago",
        unread: true,
        type: "report",
      },
      {
        id: 3,
        title: "System update",
        message: "Maintenance completed successfully",
        time: "2h ago",
        unread: false,
        type: "system",
      },
    ],
    []
  );

  const unreadCount = useMemo(
    () => mockNotifications.filter((n) => n.unread).length,
    [mockNotifications]
  );

  // Handlers
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((query) => {
    // Implement search logic here
    console.log("Search query:", query);
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    // Handle notification click
    console.log("Notification clicked:", notification);
    // You might want to mark as read and navigate
  }, []);

  const navigateToProfile = useCallback(() => {
    closeDropdown("userMenu");
    const profilePath = {
      admin: "/admin/profile",
      company: "/company/profile",
      employee: "/employee/profile",
    }[userType];
    navigate(profilePath);
  }, [userType, navigate, closeDropdown]);

  const navigateToSettings = useCallback(() => {
    closeDropdown("userMenu");
    const settingsPath = {
      admin: "/admin/settings",
      company: "/company/settings",
      employee: "/employee/settings",
    }[userType];
    navigate(settingsPath);
  }, [userType, navigate, closeDropdown]);

  const userDisplayName =
    user?.companyName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  const userEmail =
    userType === "company"
      ? user?.contactEmail
      : user?.primaryEmail || "user@example.com";

  return (
    <header
      className={`${theme.glass} z-[10000] border-b border-white/10 px-4 sm:px-6 py-4 relative`}
      role="banner"
    >
      {/* Background Elements */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-${theme.accent}/5 rounded-full blur-2xl pointer-events-none`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section - Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setDropdownStates((prev) => ({
                  ...prev,
                  mobileMenu: !prev.mobileMenu,
                }))
              }
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {dropdownStates.mobileMenu ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                {pageTitle}
              </h1>
              <nav
                className="hidden sm:flex items-center space-x-2 text-sm"
                aria-label="Breadcrumb"
              >
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span
                        className={`text-${theme.textSecondary}`}
                        aria-hidden="true"
                      >
                        /
                      </span>
                    )}
                    <button
                      onClick={() => !crumb.isLast && navigate(crumb.path)}
                      className={`transition-colors duration-200 truncate ${
                        crumb.isLast
                          ? `text-${theme.accent} font-medium`
                          : `text-${theme.textSecondary} hover:text-white`
                      }`}
                      disabled={crumb.isLast}
                      aria-current={crumb.isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <SearchBar theme={theme} onSearch={handleSearch} />
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search for mobile */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" aria-label="Search">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" aria-label="Help">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Messages">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() =>
                setDropdownStates((prev) => ({
                  ...prev,
                  notifications: !prev.notifications,
                }))
              }
              className={`p-2 rounded-lg transition-all duration-200 hover:bg-${theme.accent}/20 relative`}
              aria-label={`Notifications ${
                unreadCount > 0 ? `(${unreadCount} unread)` : ""
              }`}
              aria-expanded={dropdownStates.notifications}
              aria-haspopup="true"
            >
              <Bell
                className={`w-5 h-5 text-${theme.textSecondary} hover:text-white`}
              />
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-5 h-5 bg-${theme.accent} rounded-full border border-white flex items-center justify-center text-xs font-bold text-white`}
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {dropdownStates.notifications && (
              <div
                className={`absolute right-0 top-full mt-2 w-80 ${theme.glass} rounded-lg border border-white/20 shadow-xl z-[99999] `}
                role="menu"
                aria-label="Notifications"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        theme={theme}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className={`text-${theme.textSecondary}`}>
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-white/10">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() =>
                setDropdownStates((prev) => ({
                  ...prev,
                  userMenu: !prev.userMenu,
                }))
              }
              className={`flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-${theme.accent}`}
              aria-label="User menu"
              aria-expanded={dropdownStates.userMenu}
              aria-haspopup="true"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <UserAvatar user={user} userType={userType} theme={theme} />
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {userDisplayName}
                  </p>
                  <p className={`text-${theme.textSecondary} text-xs truncate`}>
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-${
                  theme.textSecondary
                } transition-transform duration-200 ${
                  dropdownStates.userMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Dropdown */}
            {dropdownStates.userMenu && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 ${theme.glass} rounded-lg border border-white/20 shadow-xl z-[9999]`}
                role="menu"
                aria-label="User menu"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      user={user}
                      userType={userType}
                      theme={theme}
                      size="w-12 h-12"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {userDisplayName}
                      </p>
                      <p
                        className={`text-${theme.textSecondary} text-sm truncate`}
                      >
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={navigateToProfile}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-${theme.textSecondary} hover:bg-white/5 hover:text-white transition-all duration-200`}
                    role="menuitem"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={navigateToSettings}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-${theme.textSecondary} hover:bg-white/5 hover:text-white transition-all duration-200`}
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <hr className="my-2 border-white/10" />

                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {dropdownStates.mobileMenu && (
        <div
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full left-0 right-0 ${theme.glass} border-b border-white/10 z-[9999]`}
        >
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <div className="lg:hidden">
              <SearchBar theme={theme} onSearch={handleSearch} />
            </div>

            {/* Mobile Breadcrumbs */}
            <nav
              className="flex flex-wrap items-center gap-2 text-sm"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span
                      className={`text-${theme.textSecondary}`}
                      aria-hidden="true"
                    >
                      /
                    </span>
                  )}
                  <button
                    onClick={() => !crumb.isLast && navigate(crumb.path)}
                    className={`transition-colors duration-200 ${
                      crumb.isLast
                        ? `text-${theme.accent} font-medium`
                        : `text-${theme.textSecondary} hover:text-white`
                    }`}
                    disabled={crumb.isLast}
                    aria-current={crumb.isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Mobile Quick Actions */}
            <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <Button variant="ghost" size="sm" aria-label="Help">
                <HelpCircle className="w-4 h-4" />
                <span className="ml-2">Help</span>
              </Button>
              <Button variant="ghost" size="sm" aria-label="Messages">
                <MessageSquare className="w-4 h-4" />
                <span className="ml-2">Messages</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
