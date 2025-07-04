// frontend/src/components/forms/FileUpload.jsx

import React, { useRef, useState } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";

export const FileUpload = ({
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  onFileSelect,
  theme = "company",
  className = "",
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const validateFile = (file) => {
    const errors = [];

    if (file.size > maxSize) {
      errors.push(
        `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
      );
    }

    return errors;
  };

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = [];
    const fileErrors = [];

    fileArray.forEach((file, index) => {
      const validation = validateFile(file);
      if (validation.length > 0) {
        fileErrors.push(`${file.name}: ${validation.join(", ")}`);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(fileErrors);
    setFiles(multiple ? validFiles : validFiles.slice(0, 1));

    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileSelect(multiple ? newFiles : null);
  };

  return (
    <div className={className}>
      <Card
        theme={theme}
        className={`p-6 border-2 border-dashed transition-colors ${
          dragOver ? "border-blue-400 bg-blue-500/10" : "border-slate-600"
        }`}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <h3 className="text-white font-medium mb-2">
            Drop files here or click to browse
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            {accept !== "*/*" && `Accepted formats: ${accept}`}
            {maxSize &&
              ` • Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`}
          </p>

          <Button
            variant="outline"
            theme={theme}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
        </div>
      </Card>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-white font-medium">Selected Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
