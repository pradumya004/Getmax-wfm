// frontend/src/components/company/CompanySettingsForm.jsx

import React, { useState } from "react";
import { Save, Settings } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

export const CompanySettingsForm = ({ settings, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    timezone: settings?.timezone || "UTC",
    dateFormat: settings?.dateFormat || "MM/DD/YYYY",
    currency: settings?.currency || "USD",
    workingHours: settings?.workingHours || "9",
    weekends: settings?.weekends || "saturday,sunday",
    ...settings,
  });

  const timezoneOptions = [
    { value: "UTC", label: "UTC" },
    { value: "EST", label: "Eastern Time" },
    { value: "PST", label: "Pacific Time" },
    { value: "CST", label: "Central Time" },
  ];

  const currencyOptions = [
    { value: "USD", label: "US Dollar" },
    { value: "EUR", label: "Euro" },
    { value: "GBP", label: "British Pound" },
    { value: "INR", label: "Indian Rupee" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card theme="company" className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Company Settings</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Timezone"
            value={formData.timezone}
            onChange={(e) =>
              setFormData({ ...formData, timezone: e.target.value })
            }
            options={timezoneOptions}
          />

          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            options={currencyOptions}
          />

          <Input
            label="Working Hours per Day"
            type="number"
            value={formData.workingHours}
            onChange={(e) =>
              setFormData({ ...formData, workingHours: e.target.value })
            }
            theme="company"
            min="1"
            max="24"
          />

          <Input
            label="Company Website"
            value={formData.website || ""}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            theme="company"
            placeholder="https://example.com"
          />
        </div>

        <Button
          type="submit"
          theme="company"
          loading={loading}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </Button>
      </form>
    </Card>
  );
};
