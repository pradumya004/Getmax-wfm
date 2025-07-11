// frontend/src/components/ui/FileUpload.jsx

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, AlertCircle } from "lucide-react";

export const FileUpload = ({
  onFileUpload,
  acceptedTypes = {},
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  label = "Upload Files",
  description = "Drag and drop files here or click to browse",
  error,
  className = "",
  disabled = false,
  uploadedFiles = [],
  onRemoveFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        console.error("Rejected files:", rejectedFiles);
        return;
      }

      if (onFileUpload) {
        onFileUpload(acceptedFiles);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles,
    maxSize,
    multiple,
    disabled,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : error
            ? "border-red-500 bg-red-500/10"
            : "border-gray-600 hover:border-gray-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">{description}</p>
        <p className="text-sm text-gray-500">
          {Object.keys(acceptedTypes).length > 0
            ? `Accepted formats: ${Object.keys(acceptedTypes).join(", ")}`
            : "All file types accepted"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: {formatFileSize(maxSize)}
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-white">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              {onRemoveFile && (
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};