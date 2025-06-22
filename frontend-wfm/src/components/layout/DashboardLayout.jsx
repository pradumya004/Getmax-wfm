import React from 'react';
    import { Outlet } from 'react-router-dom';
    import Sidebar from '@/components/layout/Sidebar';
    import Header from '@/components/layout/Header';

    const DashboardLayout = () => {
      return (
        <div className="min-h-screen flex bg-brand-black text-brand-gray">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      );
    };

    export default DashboardLayout;