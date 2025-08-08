import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBell, FaUserCircle } from 'react-icons/fa';

const Topbar = () => {
  // prefer saved theme, else system preference
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState<boolean>(
    (localStorage.getItem('theme') ?? (prefersDark ? 'dark' : 'light')) === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-yellow-400 transition"
          aria-label="Toggle theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="text-gray-600 dark:text-gray-300 text-xl hover:text-blue-500 transition" aria-label="Notifications">
          <FaBell />
        </button>

        <button className="text-gray-600 dark:text-gray-300 text-2xl hover:text-blue-500 transition" aria-label="Profile">
          <FaUserCircle />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
