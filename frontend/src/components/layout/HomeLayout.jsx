import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function HomeLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Simulated user data - in real use, this can be fetched from context or localStorage
  const user = {
    name: "John Doe",
    role: "admin", // Can be "admin", "company", or "employee"
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userRole={user.role}
        currentPath={location.pathname}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar user={user} theme={user.role} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
