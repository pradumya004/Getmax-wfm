// frontend/src/components/ui/LoadingSpinner.jsx

import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "w-6 h-6", text = "" }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${size} animate-spin text-blue-400`} />
      {text && <span className="text-gray-400">{text}</span>}
    </div>
  );
};
