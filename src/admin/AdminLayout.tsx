// src/admin/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import ProfileMenu from "../components/ProfileMenu";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={
          "fixed z-30 inset-y-0 left-0 w-64 transform bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-transform " +
          (open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
        }
      >
        <div className="p-4 font-semibold text-lg">Admin</div>
        <nav className="p-2 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              "block px-3 py-2 rounded-md transition " +
              (isActive
                ? "bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-white"
                : "hover:bg-gray-100 dark:hover:bg-neutral-800")
            }
            onClick={() => setOpen(false)}
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              "block px-3 py-2 rounded-md transition " +
              (isActive
                ? "bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-white"
                : "hover:bg-gray-100 dark:hover:bg-neutral-800")
            }
            onClick={() => setOpen(false)}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/listings"
            className={({ isActive }) =>
              "block px-3 py-2 rounded-md transition " +
              (isActive
                ? "bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-white"
                : "hover:bg-gray-100 dark:hover:bg-neutral-800")
            }
            onClick={() => setOpen(false)}
          >
            Listings
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 flex flex-col">
        {/* Top bar */}
        <div className="h-14 px-3 md:px-4 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur flex items-center justify-between">
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>

        <div className="p-3 md:p-6 flex-1 overflow-x-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
