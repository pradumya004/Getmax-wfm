// frontend/src/components/ui/Tabs.jsx

// src/components/ui/Tabs.jsx
import React, { useState, createContext, useContext } from "react";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

const TabsContext = createContext();

export const Tabs = ({
  children,
  value,
  onValueChange,
  defaultValue,
  className = "",
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [activeTab, setActiveTab] = useState(value || defaultValue || "");

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    if (onValueChange) {
      onValueChange(tabValue);
    }
  };

  return (
    <TabsContext.Provider
      value={{ activeTab: value || activeTab, onTabChange: handleTabChange }}
    >
      <div className={`${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  return (
    <div
      className={`${theme.glass} p-1 rounded-lg border border-white/10 mb-6 ${className}`}
    >
      <div className="flex space-x-1">{children}</div>
    </div>
  );
};

export const TabsTrigger = ({
  children,
  value,
  className = "",
  disabled = false,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { activeTab, onTabChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && onTabChange(value)}
      disabled={disabled}
      className={`
        flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${
          isActive
            ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
            : `text-${theme.textSecondary} hover:text-white hover:bg-white/5`
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className = "" }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return <div className={`${className}`}>{children}</div>;
};
