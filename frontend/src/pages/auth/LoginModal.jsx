// components/LoginModal.jsx
import React from 'react';
import CompanyLogin from './CompanyLogin.jsx';

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 sm:mx-6 md:mx-auto bg-slate-900 border border-blue-400/20 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-6 md:p-6 text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400 transition"
        >
          ✕
        </button>

        {/* Login Form */}
        <div className="mt-4">
          <CompanyLogin isModal />
        </div>
      </div>
    </div>
  );
}