// components/ui/Label.jsx

import React from "react";

export const Label = ({ htmlFor, children, className = "", theme = "employee" }) => {
  const themeColor =
    {
      master_admin: "text-white/80",
      company: "text-white/80",
      employee: "text-white/80",
    }[theme] || "text-white/80";

  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium mb-1 ${themeColor} ${className}`}
    >
      {children}
    </label>
  );
};