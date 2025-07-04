// frontend/src/pages/auth/SignupModal.jsx

import React from 'react';
import CompanySignup from './signup/CompanySignup.jsx';

export default function SignupModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 sm:mx-6 md:mx-auto bg-slate-900 border border-cyan-400/20 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-6 md:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400 transition"
        >
          ✕
        </button>

        {/* Signup Form */}
        <div className="mt-4">
          <CompanySignup />
        </div>
      </div>
    </div>
  );
}