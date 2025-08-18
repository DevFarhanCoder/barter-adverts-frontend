// src/components/Header.tsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Handshake, MapPin, Menu, X, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthed = !!localStorage.getItem("token");
  const user = useMemo(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("ba_user") || "null") ||
        JSON.parse(localStorage.getItem("user") || "null")
      );
    } catch {
      return null;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ba_user");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/", { replace: true });
  };

  const NavLinkItem = ({ to, label }: { to: string; label: string }) => {
    const active =
      location.pathname === to || location.pathname.startsWith(`${to}/`);
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${
          active ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
            <Handshake className="h-5 w-5" />
          </div>
          {/* Text now always visible (not hidden on mobile) */}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">Barter Adverts</span>
            <span className="text-xs text-gray-500 -mt-0.5">
              Media Marketplace
            </span>
          </div>
        </Link>

        {/* Location (desktop only) */}
        <div className="hidden md:flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Mumbai, India</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinkItem to="/marketplace" label="Marketplace" />
          <NavLinkItem to="/how-it-works" label="How it Works" />
          <NavLinkItem to="/pricing" label="Pricing" />
          <NavLinkItem to="/about" label="About" />
        </nav>

        {/* Desktop auth / user */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                // ✅ reverted to old blue color
                className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                Create account
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white grid place-items-center">
                  {(user?.firstName?.[0] || "U").toUpperCase()}
                </div>
                <span className="max-w-[10rem] truncate">
                  {user?.firstName || user?.email || "Account"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg">
                  <Link
                    to="/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border hover:bg-gray-50"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden border-t bg-white transition-all duration-300 ease-out ${
          isMobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-2">
            <NavLinkItem to="/marketplace" label="Marketplace" />
            <NavLinkItem to="/how-it-works" label="How it Works" />
            <NavLinkItem to="/pricing" label="Pricing" />
            <NavLinkItem to="/about" label="About" />
          </nav>

          <div className="mt-3 border-t pt-3 flex flex-col gap-2">
            {!isAuthed ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  // ✅ also blue on mobile
                  className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm text-white hover:bg-blue-700"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 text-center text-sm hover:bg-gray-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="rounded-lg px-3 py-2 text-center text-sm hover:bg-gray-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  className="rounded-lg px-3 py-2 text-center text-sm text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
