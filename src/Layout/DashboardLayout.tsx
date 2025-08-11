import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Left sidebar (fixed) */}
      <Sidebar />

      {/* Right side content */}
      <div className="ml-64 flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
        {/* Sticky top bar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 px-6 py-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
