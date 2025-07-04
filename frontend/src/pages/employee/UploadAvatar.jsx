// frontend/src/pages/employee/UploadAvatar.jsx

import React from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { AvatarUpload } from "../../components/employee/AvatarUpload.jsx";

const UploadAvatar = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/employee/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-6">
      <Helmet>
        <title>Upload Avatar - GetMax</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/employee/profile")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Upload Profile Picture
            </h1>
            <p className="text-emerald-200">
              Update your avatar to personalize your profile
            </p>
          </div>
        </div>

        {/* Upload Component */}
        <AvatarUpload onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default UploadAvatar;
