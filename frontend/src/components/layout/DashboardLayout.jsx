// frontend/src/components/layout/DashboardLayout.jsx

import React from "react";
import Sidebar from "../../components/layout/Sidebar.jsx";
import Header from "../../components/layout/Header.jsx";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

const DashboardLayout = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  return (
    <div
      className={`h-screen flex bg-gradient-to-br ${theme.primary} text-${theme.text} relative`}
    >
      {/* Background elements - lowest z-index */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Animated background elements */}
      <div
        className={`absolute top-0 left-0 w-96 h-96 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse z-0`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-80 h-80 bg-${theme.accent}/10 rounded-full blur-3xl animate-pulse z-0`}
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className={`absolute top-1/2 left-1/3 w-64 h-64 bg-${theme.accent}/10 rounded-full blur-2xl animate-pulse z-0`}
        style={{ animationDelay: "0.5s" }}
      ></div>

      {/* Grid Pattern - lowest z-index */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Main layout container - medium z-index */}
      <div className="relative flex w-full overflow-auto">
        {/* Sidebar - medium z-index */}
        <div className="relative z-20">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          {/* Main content with content glass and lower z-index */}
          <main className="flex-1 p-2 lg:p-4 overflow-x-auto overflow-y-auto scrollbar-hide relative z-10">
            <div className="relative z-10">
              <div className="absolute inset-0 p-2 z-[-1]">
                <div
                  className={`w-full h-full ${theme.glass} rounded-2xl`}
                ></div>
              </div>
              <Outlet />
            </div>

            {/* Decorative Ping Elements */}
            <div
              className={`absolute top-8 right-8 w-2 h-2 bg-${theme.accent} rounded-full animate-ping opacity-60 z-0`}
            ></div>
            <div
              className={`absolute bottom-12 left-12 w-1.5 h-1.5 bg-${theme.accent} rounded-full animate-ping opacity-40 z-0`}
              style={{ animationDelay: "0.7s" }}
            ></div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
