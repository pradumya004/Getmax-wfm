import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Database,
  Server,
  Bell,
  Users,
  Building,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Upload,
  FileText,
  Code,
  Link,
  Smartphone,
  Monitor,
  Wifi,
  Activity,
  Target,
  Zap,
  Calendar,
  Clock,
  Flag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Checkbox } from "../../components/ui/Checkbox";
import { Button } from "../../components/ui/Button.jsx";
import { toast } from "react-hot-toast";
import { getTheme } from "../../lib/theme";
import { useAuth } from "../../hooks/useAuth";

const PlatformSettings = () => {
//   const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  console.log(theme);

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "GetMax WFM",
    platformDescription: "Workforce Management Platform",
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    defaultTimezone: "UTC",
    dateFormat: "MM/DD/YYYY",

    // Email Settings
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpSecure: true,
    fromEmail: "noreply@getmax.com",
    fromName: "GetMax WFM",

    // Security Settings
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    mfaRequired: false,
    sessionTimeout: 1440,
    maxLoginAttempts: 5,
    lockoutDuration: 30,

    // Subscription Settings
    trialPeriodDays: 14,
    gracePeriodDays: 7,
    allowPlanDowngrades: true,
    prorateBilling: true,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    webhookUrl: "",
    slackWebhook: "",

    // API Settings
    apiRateLimit: 1000,
    apiRateLimitWindow: 60,
    enableApiDocs: true,
    requireApiKey: true,

    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupLocation: "aws-s3",

    // Feature Flags
    enableAdvancedReporting: true,
    enableBulkOperations: true,
    enableDataExport: true,
    enableCustomFields: true,
    enableIntegrations: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Saving settings:", settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to defaults? This action cannot be undone."
      )
    ) {
      // Reset to default values
      console.log("Resetting to defaults");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "email", label: "Email", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
    { id: "subscriptions", label: "Subscriptions", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API", icon: Code },
    { id: "backup", label: "Backup", icon: Database },
    { id: "features", label: "Features", icon: Flag },
  ];

  const SettingRow = ({ label, description, children, warning = false }) => (
    <div
      className={`p-4 border border-${theme.border} rounded-lg ${
        warning ? "border-yellow-500/30 bg-yellow-500/10" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className={`text-${theme.text} font-medium`}>{label}</h4>
          {description && (
            <p className={`text-${theme.textSecondary} text-sm mt-1`}>
              {description}
            </p>
          )}
          {warning && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">
                This setting affects all platform users
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">{children}</div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      {/* Header */}
      <div
        className={`top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Platform Settings
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Configure global platform settings and preferences
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={handleResetToDefaults}
                className={`px-4 py-2 rounded-lg text-sm hover:${theme.button}`}
              >
                Reset to Defaults
              </Button>

              <Button
                variant="ghost"
                onClick={handleSaveSettings}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm hover:${theme.button}`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div
              className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-4`}
            >
              <h3 className={`text-${theme.text} font-semibold mb-4`}>
                Settings Categories
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant="outline"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? `${theme.button}`
                          : `text-${theme.textSecondary} hover:text-${theme.text}`
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div
              className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
            >
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    General Settings
                  </h3>

                  <SettingRow
                    label="Platform Name"
                    description="The name displayed across the platform"
                  >
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) =>
                        handleSettingChange("platformName", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Platform Description"
                    description="Brief description of the platform"
                  >
                    <input
                      type="text"
                      value={settings.platformDescription}
                      onChange={(e) =>
                        handleSettingChange(
                          "platformDescription",
                          e.target.value
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Maintenance Mode"
                    description="Temporarily disable platform access for maintenance"
                    warning={true}
                  >
                    <Checkbox
                      checked={settings.maintenanceMode}
                      theme={theme}
                      onChange={(value) =>
                        handleSettingChange("maintenanceMode", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Allow New Registrations"
                    description="Allow new companies to register on the platform"
                  >
                    <Checkbox
                      checked={settings.allowRegistrations}
                      theme={theme}
                      onChange={(value) =>
                        handleSettingChange("allowRegistrations", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require Email Verification"
                    description="Require email verification for new accounts"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.requireEmailVerification}
                      onChange={(value) =>
                        handleSettingChange("requireEmailVerification", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Default Timezone"
                    description="Default timezone for new accounts"
                  >
                    <select
                      value={settings.defaultTimezone}
                      onChange={(e) =>
                        handleSettingChange("defaultTimezone", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </SettingRow>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    Email Configuration
                  </h3>

                  <SettingRow
                    label="SMTP Host"
                    description="SMTP server hostname"
                  >
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) =>
                        handleSettingChange("smtpHost", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="SMTP Port"
                    description="SMTP server port (usually 587 or 465)"
                  >
                    <input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) =>
                        handleSettingChange("smtpPort", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="SMTP Username"
                    description="SMTP authentication username"
                  >
                    <input
                      type="text"
                      value={settings.smtpUsername}
                      onChange={(e) =>
                        handleSettingChange("smtpUsername", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="SMTP Password"
                    description="SMTP authentication password"
                  >
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) =>
                        handleSettingChange("smtpPassword", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="From Email"
                    description="Default sender email address"
                  >
                    <input
                      type="email"
                      value={settings.fromEmail}
                      onChange={(e) =>
                        handleSettingChange("fromEmail", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="From Name"
                    description="Default sender name"
                  >
                    <input
                      type="text"
                      value={settings.fromName}
                      onChange={(e) =>
                        handleSettingChange("fromName", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    Security Configuration
                  </h3>

                  <SettingRow
                    label="Minimum Password Length"
                    description="Minimum number of characters required for passwords"
                  >
                    <input
                      type="number"
                      min="6"
                      max="128"
                      value={settings.passwordMinLength}
                      onChange={(e) =>
                        handleSettingChange(
                          "passwordMinLength",
                          parseInt(e.target.value)
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require Uppercase Letters"
                    description="Passwords must contain at least one uppercase letter"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.passwordRequireUppercase}
                      onChange={(value) =>
                        handleSettingChange("passwordRequireUppercase", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require Numbers"
                    description="Passwords must contain at least one number"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.passwordRequireNumbers}
                      onChange={(value) =>
                        handleSettingChange("passwordRequireNumbers", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require Special Characters"
                    description="Passwords must contain at least one special character"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.passwordRequireSpecialChars}
                      onChange={(value) =>
                        handleSettingChange(
                          "passwordRequireSpecialChars",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require Multi-Factor Authentication"
                    description="Force all users to enable MFA"
                    warning={true}
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.mfaRequired}
                      onChange={(value) =>
                        handleSettingChange("mfaRequired", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Session Timeout (minutes)"
                    description="Automatically log out inactive users"
                  >
                    <input
                      type="number"
                      min="5"
                      max="10080"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange(
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Max Login Attempts"
                    description="Number of failed attempts before account lockout"
                  >
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) =>
                        handleSettingChange(
                          "maxLoginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>
                </div>
              )}

              {/* Feature Flags */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    Feature Management
                  </h3>

                  <SettingRow
                    label="Advanced Reporting"
                    description="Enable advanced reporting features for all companies"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableAdvancedReporting}
                      onChange={(value) =>
                        handleSettingChange("enableAdvancedReporting", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Bulk Operations"
                    description="Allow bulk operations on employees and data"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableBulkOperations}
                      onChange={(value) =>
                        handleSettingChange("enableBulkOperations", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Data Export"
                    description="Allow companies to export their data"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableDataExport}
                      onChange={(value) =>
                        handleSettingChange("enableDataExport", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Custom Fields"
                    description="Allow companies to create custom fields"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableCustomFields}
                      onChange={(value) =>
                        handleSettingChange("enableCustomFields", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Third-Party Integrations"
                    description="Enable integrations with external services"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableIntegrations}
                      onChange={(value) =>
                        handleSettingChange("enableIntegrations", value)
                      }
                    />
                  </SettingRow>
                </div>
              )}

              {/* API Settings */}
              {activeTab === "api" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    API Configuration
                  </h3>

                  <SettingRow
                    label="API Rate Limit"
                    description="Maximum requests per minute per API key"
                  >
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      value={settings.apiRateLimit}
                      onChange={(e) =>
                        handleSettingChange(
                          "apiRateLimit",
                          parseInt(e.target.value)
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Enable API Documentation"
                    description="Make API documentation publicly available"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.enableApiDocs}
                      onChange={(value) =>
                        handleSettingChange("enableApiDocs", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Require API Keys"
                    description="All API requests must include a valid API key"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.requireApiKey}
                      onChange={(value) =>
                        handleSettingChange("requireApiKey", value)
                      }
                    />
                  </SettingRow>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === "backup" && (
                <div className="space-y-6">
                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-4`}
                  >
                    Backup Configuration
                  </h3>

                  <SettingRow
                    label="Automatic Backups"
                    description="Automatically backup platform data"
                  >
                    <Checkbox
                      theme={theme}
                      checked={settings.autoBackup}
                      onChange={(value) =>
                        handleSettingChange("autoBackup", value)
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    label="Backup Frequency"
                    description="How often to perform automatic backups"
                  >
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) =>
                        handleSettingChange("backupFrequency", e.target.value)
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </SettingRow>

                  <SettingRow
                    label="Backup Retention (days)"
                    description="How long to keep backup files"
                  >
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.backupRetention}
                      onChange={(e) =>
                        handleSettingChange(
                          "backupRetention",
                          parseInt(e.target.value)
                        )
                      }
                      className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    />
                  </SettingRow>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
