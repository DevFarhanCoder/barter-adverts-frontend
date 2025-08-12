// src/components/Topbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  ArrowLeft,
  ArrowLeftRight,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

type Role = 'media_owner' | 'advertiser';
type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: Role;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

function readStoredUser(): StoredUser | null {
  try {
    const rawBA = localStorage.getItem('ba_user');
    if (rawBA) return JSON.parse(rawBA);
    const rawLegacy = localStorage.getItem('user'); // legacy key
    return rawLegacy ? JSON.parse(rawLegacy) : null;
  } catch {
    return null;
  }
}

function useStoredUser() {
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());

  useEffect(() => {
    const handle = () => setUser(readStoredUser());
    window.addEventListener('auth:changed', handle);
    window.addEventListener('storage', handle);
    return () => {
      window.removeEventListener('auth:changed', handle);
      window.removeEventListener('storage', handle);
    };
  }, []);

  return { user, setUser };
}

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStoredUser();

  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
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

  // allow external close
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('close-profile-menu', close);
    return () => window.removeEventListener('close-profile-menu', close);
  }, []);

  const role: Role = user?.userType === 'media_owner' ? 'media_owner' : 'advertiser';
  const nextRole: Role = role === 'advertiser' ? 'media_owner' : 'advertiser';
  const nextRoleLabel = nextRole === 'media_owner' ? 'Media Owner' : 'Advertiser';

  const initials =
    user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  const fullName = user?.firstName
    ? `${user.firstName} ${user?.lastName ?? ''}`.trim()
    : 'User';

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ba_user');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('auth:changed'));
    navigate('/login');
  };

  const switchRole = async () => {
    try {
      setSwitching(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE}/api/auth/switch-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to switch role');

      localStorage.setItem('ba_user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.userType);
      setUser(data.user);
      window.dispatchEvent(new Event('auth:changed'));

      setOpen(false);
      navigate(0); // hard refresh current route so UI reacts immediately
    } catch (e: any) {
      console.error('switchRole error:', e);
      alert(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSwitching(false);
    }
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
            aria-haspopup="true"
            aria-expanded={open}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
              aria-label={`User avatar: ${fullName}`}
            >
              {initials}
            </div>
            <div className="hidden sm:block">
              <div className="font-medium text-gray-900 dark:text-gray-100">{fullName}</div>
              <div className="text-xs text-gray-500">{user?.email ?? '—'}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 z-50"
              data-topbar="role-switch-menu"
            >
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {fullName}
                </div>
                <div className="truncate text-xs text-gray-500">{user?.email ?? '—'}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-purple-600">
                  Current role: {role.replace('_', ' ')}
                </div>
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
                disabled={switching}
                onClick={switchRole}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                title={switching ? 'Switching…' : ''}
              >
                {switching ? (
                  <span className="h-4 w-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full" />
                ) : (
                  <ArrowLeftRight className="h-4 w-4" />
                )}
                {switching ? 'Switching…' : `Switch to ${nextRoleLabel}`}
              </button>

              <div className="border-t dark:border-gray-700" />
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
