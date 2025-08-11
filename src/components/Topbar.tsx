import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, LayoutDashboard, ArrowLeft } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

function getUser() {
  useEffect(() => {
  const close = () => setOpen(false);
  window.addEventListener('close-profile-menu', close);
  return () => window.removeEventListener('close-profile-menu', close);
}, []);

  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Profile */}
        <div className="relative" ref={popRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full border px-3 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {user?.firstName ? `${user.firstName} ${user?.lastName ?? ''}`.trim() : 'User'}
              </div>
              <div className="text-xs text-gray-500">{user?.email ?? '—'}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Menu (simple, no fancy transitions) */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.firstName ? `${user.firstName} ${user?.lastName ?? ''}`.trim() : 'User'}
                </div>
                <div className="truncate text-xs text-gray-500">{user?.email ?? '—'}</div>
              </div>
              <div className="border-t dark:border-gray-700" />
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
function setOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}

