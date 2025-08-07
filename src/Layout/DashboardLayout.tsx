import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar with fixed position */}
      <Sidebar />

      {/* Content Wrapper shifted right with margin to account for sidebar */}
      <div className="ml-64 flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
        <Topbar />

        <main className="flex-1 px-6 py-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
