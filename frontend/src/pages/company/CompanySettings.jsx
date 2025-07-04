// frontend/src/pages/company/CompanySettings.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Settings, Save, Shield, Bell, Database, Users } from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { companyAPI } from "../../api/company.api.js";
import { useApi } from "../../hooks/useApi.jsx";
import { toast } from "react-hot-toast";

const CompanySettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",

    // Notification Settings
    emailNotifications: true,
    performanceAlerts: true,
    systemUpdates: false,

    // Security Settings
    passwordPolicy: "medium",
    sessionTimeout: "8",
    twoFactorAuth: false,

    // Employee Settings
    allowSelfRegistration: false,
    requireEmailVerification: true,
    defaultWorkLocation: "Office",
  });

  const [loading, setLoading] = useState(false);

  const timezoneOptions = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "MST", label: "MST (Mountain Standard Time)" },
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US Format)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (European Format)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO Format)" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
  ];

  const passwordPolicyOptions = [
    { value: "low", label: "Low - Minimum 6 characters" },
    { value: "medium", label: "Medium - 8 chars with numbers" },
    { value: "high", label: "High - 12 chars with special chars" },
  ];

  const workLocationOptions = [
    { value: "Office", label: "Office" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // This would be a real API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingSections = [
    {
      title: "General Settings",
      icon: Settings,
      settings: [
        {
          key: "timezone",
          label: "Timezone",
          type: "select",
          options: timezoneOptions,
        },
        {
          key: "dateFormat",
          label: "Date Format",
          type: "select",
          options: dateFormatOptions,
        },
        {
          key: "currency",
          label: "Currency",
          type: "select",
          options: currencyOptions,
        },
      ],
    },
    {
      title: "Notification Settings",
      icon: Bell,
      settings: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          type: "toggle",
          description: "Receive email notifications for important events",
        },
        {
          key: "performanceAlerts",
          label: "Performance Alerts",
          type: "toggle",
          description: "Get notified about employee performance issues",
        },
        {
          key: "systemUpdates",
          label: "System Updates",
          type: "toggle",
          description: "Receive notifications about system updates",
        },
      ],
    },
    {
      title: "Security Settings",
      icon: Shield,
      settings: [
        {
          key: "passwordPolicy",
          label: "Password Policy",
          type: "select",
          options: passwordPolicyOptions,
        },
        {
          key: "sessionTimeout",
          label: "Session Timeout (hours)",
          type: "input",
          inputType: "number",
        },
        {
          key: "twoFactorAuth",
          label: "Two-Factor Authentication",
          type: "toggle",
          description: "Require 2FA for admin accounts",
        },
      ],
    },
    {
      title: "Employee Settings",
      icon: Users,
      settings: [
        {
          key: "allowSelfRegistration",
          label: "Allow Self Registration",
          type: "toggle",
          description: "Let employees register themselves",
        },
        {
          key: "requireEmailVerification",
          label: "Require Email Verification",
          type: "toggle",
          description: "Verify employee email addresses",
        },
        {
          key: "defaultWorkLocation",
          label: "Default Work Location",
          type: "select",
          options: workLocationOptions,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Company Settings - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Company Settings
            </h1>
            <p className="text-blue-200">
              Configure your company preferences and policies
            </p>
          </div>

          <Button
            theme="company"
            onClick={handleSave}
            loading={loading}
            className="inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section) => {
            const IconComponent = section.icon;

            return (
              <Card key={section.title} theme="company" className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <IconComponent className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <label className="text-white font-medium">
                          {setting.label}
                        </label>
                        {setting.description && (
                          <p className="text-gray-400 text-sm mt-1">
                            {setting.description}
                          </p>
                        )}
                      </div>

                      <div className="w-64">
                        {setting.type === "select" && (
                          <Select
                            value={settings[setting.key]}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                [setting.key]: e.target.value,
                              }))
                            }
                            options={setting.options}
                          />
                        )}

                        {setting.type === "input" && (
                          <Input
                            type={setting.inputType || "text"}
                            value={settings[setting.key]}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                [setting.key]: e.target.value,
                              }))
                            }
                            theme="company"
                          />
                        )}

                        {setting.type === "toggle" && (
                          <button
                            onClick={() => handleToggle(setting.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings[setting.key]
                                ? "bg-blue-600"
                                : "bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[setting.key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
