import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const UserDashboard = () => {
  return (
    <div className="flex">
      {/* Fixed left nav */}
      <Sidebar />

      {/* Right side area */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sticky top bar with dark-mode toggle */}
        <Topbar />

        {/* Push content below the 64px (h-16) topbar */}
        <main className="px-4 lg:px-6 pt-4 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
