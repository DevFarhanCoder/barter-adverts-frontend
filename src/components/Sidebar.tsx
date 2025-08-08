import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBullhorn,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
  { name: 'My Listings', path: '/dashboard/listings', icon: <FaBullhorn /> },
  { name: 'Messages', path: '/dashboard/messages', icon: <FaEnvelope /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
];

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-800 shadow-md p-6 fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center justify-center mb-10">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {navLinks.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            end={path === '/dashboard'} // ✅ Only Dashboard link uses exact match
            className={({ isActive }) =>
              `flex items-center w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className="text-lg mr-3">{icon}</span>
            {name}
          </NavLink>

        ))}

        {/* Logout Button */}
        <button
          className="flex items-center w-full px-4 py-3 mt-6 text-sm font-medium text-white-500 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-800"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          <span className="text-lg mr-3">
            <FaSignOutAlt />
          </span>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
