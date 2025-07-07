// frontend/src/components/ui/Input.jsx

import React from "react";
import { getTheme } from "../../lib/theme.js";

export const Input = ({
  label,
  error,
  theme = "company",
  className = "",
  ...props
}) => {
  const themeColors = getTheme(theme);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg
          bg-slate-800/50 border border-slate-600/50
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          focus:border-transparent transition-all duration-200
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : `focus:ring-${
                  theme === "admin"
                    ? "red"
                    : theme === "employee"
                    ? "emerald"
                    : "blue"
                }-500`
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
