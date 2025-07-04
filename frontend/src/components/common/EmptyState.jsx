// frontend/src/components/common/EmptyState.jsx

import React from "react";
import { getTheme } from "../../lib/theme.js";

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  theme = "company",
}) => {
  const themeColors = getTheme(theme);

  return (
    <div className="text-center py-12">
      <div
        className={`mx-auto w-16 h-16 bg-gradient-to-r ${themeColors.card} rounded-full flex items-center justify-center mb-4`}
      >
        <Icon className={`w-8 h-8 ${themeColors.text}`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
};