import React from 'react';

// Mock components for demonstration
import Sidebar from "../../components/layout/Sidebar.jsx";
import Header from "../../components/layout/Header.jsx";
import { Outlet } from "react-router-dom";


const DashboardLayout = () => {
  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-purple-100 relative overflow-hidden">
      {/* Background overlay for subtle texture */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
            {/* Content area subtle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl backdrop-blur-sm border border-white/10 m-2"></div>
            
            {/* Main content */}
            <div className="relative z-10">
              <Outlet />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 delay-700"></div>
          </main>
        </div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
    </div>
  );
};

export default DashboardLayout;