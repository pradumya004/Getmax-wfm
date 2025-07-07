// frontend/src/pages/auth/SignupModal.jsx

import React from "react";
import CompanySignup from "./signup/CompanySignup.jsx";

export default function SignupModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl mx-4 sm:mx-6 md:mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-300/20 rounded-3xl shadow-[0_0_40px_#00FFFF20] overflow-y-auto max-h-[95vh] p-6 md:p-10 text-white transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-red-400 transition-transform hover:scale-110"
        >
          ✕
        </button>

        {/* Header (optional for fuller look) */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-cyan-300 tracking-wide">
            Company Signup
          </h2>
          <p className="text-white/70 mt-2 text-sm">
            Start managing your workforce like a pro.
          </p>
        </div>

        {/* Signup Form */}
        <div className="mt-2">
          <CompanySignup />
        </div>
      </div>
    </div>
  );
}
