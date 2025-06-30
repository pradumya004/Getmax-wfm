import React from 'react';
import { Bell, UserCircle, ChevronDown } from 'lucide-react';

const Header = () => {
  const handleNotImplemented = () => {
    // Mock toast notification
    console.log("🚧 Feature Not Implemented - This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
  };

  return (
    <header className="bg-gradient-to-r from-blue-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-6 justify-between flex-shrink-0 shadow-xl relative overflow-hidden">
      {/* Subtle overlay for extra depth */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-60"></div>
      
      <div className="relative z-10">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Welcome, Admin
        </h1>
        <div className="flex items-center space-x-1 mt-0.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-purple-200/80">Online</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 relative z-10">
        {/* Notification Bell */}
        <button 
          onClick={handleNotImplemented}
          className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group backdrop-blur-sm"
        >
          <Bell className="h-5 w-5 text-purple-200 group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full border border-white/20"></span>
        </button>
        
        {/* User Profile Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 backdrop-blur-sm group"
          onClick={handleNotImplemented}
        >
          <div className="relative">
            <UserCircle className="h-8 w-8 text-purple-200 group-hover:text-white transition-colors" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-blue-950"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm">Admin</span>
            <span className="text-purple-300/70 text-xs">Administrator</span>
          </div>
          <ChevronDown className="h-4 w-4 text-purple-300 group-hover:text-white transition-all duration-200 group-hover:rotate-180" />
        </div>
      </div>
      
      {/* Subtle light effect */}
      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </header>
  );
};

export default Header;