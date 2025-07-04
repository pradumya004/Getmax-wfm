// frontend/src/components/common/ImportButton.jsx

import React, { useState } from "react";
import { Upload, FileText, Database } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { FileUpload } from "../forms/FileUpload.jsx";
import { Modal } from "../ui/Modal.jsx";

export const ImportButton = ({
  onImport,
  acceptedFormats = [".csv", ".xlsx"],
  theme = "company",
  title = "Import Data",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await onImport(selectedFile);
      setShowModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        theme={theme}
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center space-x-2 ${className}`}
      >
        <Upload className="w-4 h-4" />
        <span>Import</span>
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        size="max-w-md"
      >
        <div className="space-y-4">
          <FileUpload
            accept={acceptedFormats.join(",")}
            onFileSelect={handleFileSelect}
            theme={theme}
          />

          <div className="flex space-x-3">
            <Button
              theme={theme}
              onClick={handleImport}
              loading={uploading}
              disabled={!selectedFile}
              className="flex-1"
            >
              Import
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
