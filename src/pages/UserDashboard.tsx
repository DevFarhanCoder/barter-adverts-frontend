// src/pages/UserDashboard.tsx
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* back to home bar */}
        <div className="px-4 lg:px-6 pt-4">
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <main className="px-4 lg:px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
