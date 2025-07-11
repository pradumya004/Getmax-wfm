// frontend/src/components/common/ExcelPreview.jsx

import React, { useState } from "react";
import { Eye, EyeOff, Download, FileSpreadsheet } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ExcelPreview = ({
  headers,
  data,
  filename,
  maxRows = 10,
  onDownload,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const displayData = showFullPreview ? data : data.slice(0, maxRows);

  return (
    <Card className={`${theme.card} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className={`w-5 h-5 text-${theme.accent}`} />
          <div>
            <h3 className="text-white font-medium">{filename}</h3>
            <p className={`text-${theme.textSecondary} text-sm`}>
              {data.length} rows, {headers.length} columns
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullPreview(!showFullPreview)}
            className="flex items-center space-x-2"
          >
            {showFullPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showFullPreview ? "Show Less" : "Show More"}</span>
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b border-${theme.accent}/20`}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left p-3 text-white font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-white/10 hover:bg-${theme.accent}/5`}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-3 text-white text-sm">
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > maxRows && (
        <div className="mt-4 text-center">
          <p className={`text-${theme.textSecondary} text-sm`}>
            Showing {displayData.length} of {data.length} rows
          </p>
        </div>
      )}
    </Card>
  );
};