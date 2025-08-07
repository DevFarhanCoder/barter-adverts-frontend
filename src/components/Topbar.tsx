import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBell, FaUserCircle } from 'react-icons/fa';

const Topbar = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-blue-600">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-yellow-400 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <FaBell className="text-gray-600 dark:text-gray-300 text-xl cursor-pointer hover:text-blue-500 transition" />
        <FaUserCircle className="text-gray-600 dark:text-gray-300 text-2xl cursor-pointer hover:text-blue-500 transition" />
      </div>
    </header>
  );
};

export default Topbar;
