// frontend/src/components/employee/AvatarUpload.jsx

import React, { useState } from "react";
import { Upload, User, X } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { employeeAPI } from "../../api/employee.api.js";
import { toast } from "react-hot-toast";

export const AvatarUpload = ({ currentAvatar, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      await employeeAPI.uploadAvatar(formData);
      toast.success("Avatar updated successfully");

      setPreview(null);
      setSelectedFile(null);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <Card theme="employee" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>

      <div className="flex items-center space-x-6">
        {/* Current/Preview Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Current"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-black" />
            )}
          </div>

          {preview && (
            <button
              onClick={handleCancel}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          {!preview ? (
            <div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  theme="employee"
                  className="inline-flex items-center space-x-2 cursor-pointer"
                  as="span"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </Button>
              </label>
              <p className="text-gray-400 text-sm mt-2">JPG, PNG up to 5MB</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white">Ready to upload new photo?</p>
              <div className="flex space-x-3">
                <Button
                  theme="employee"
                  onClick={handleUpload}
                  loading={uploading}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};