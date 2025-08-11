import React, { useEffect, useState } from 'react';
import { Save, Moon, Sun, Bell } from 'lucide-react';

const Settings: React.FC = () => {
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const [name, setName] = useState(storedUser?.name || '');
  const [email, setEmail] = useState(storedUser?.email || '');
  const [password, setPassword] = useState('');
  const [notifTrade, setNotifTrade] = useState(true);
  const [notifMsgs, setNotifMsgs] = useState(true);
  const [dark, setDark] = useState(
    (localStorage.getItem('theme') ?? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const saveProfile = async () => {
    // TODO: call your backend profile endpoint here
    localStorage.setItem('user', JSON.stringify({ ...storedUser, name, email }));
    alert('Profile saved');
  };

  const changePassword = async () => {
    if (!password.trim()) return alert('Enter a new password');
    // TODO: call your backend change-password endpoint here
    setPassword('');
    alert('Password updated');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>

      {/* Appearance */}
      <section className="rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Appearance</h2>
        <button
          onClick={() => setDark((d) => !d)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </section>

      {/* Profile */}
      <section className="rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={saveProfile}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </section>

      {/* Password */}
      <section className="rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Password</h2>
        <div className="max-w-sm flex gap-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="New password"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <button
            onClick={changePassword}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
          >
            Update
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={notifTrade} onChange={(e) => setNotifTrade(e.target.checked)} />
            <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center gap-2">
              <Bell className="w-4 h-4" /> Updates about trades
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={notifMsgs} onChange={(e) => setNotifMsgs(e.target.checked)} />
            <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center gap-2">
              <Bell className="w-4 h-4" /> New messages
            </span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default Settings;
