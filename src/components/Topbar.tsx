// src/components/Topbar.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

type AuthRole = "admin" | "user" | string;
type BizRole = "advertiser" | "media_owner";

type AppUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: AuthRole;     // auth role: "admin" | "user"
  userType?: BizRole;  // business role used in marketplace
  [k: string]: any;
};

function coerceBizRole(v: any): BizRole | null {
  if (!v) return null;
  const s = String(v).toLowerCase().trim();
  if (s === "advertiser" || s === "media_owner") return s;
  if (s === "media_owners" || s === "mediaowners") return "media_owner";
  if (s === "advertisers") return "advertiser";
  return null;
}

function readLocal(): { user: AppUser | null; authRole: AuthRole | null; bizRole: BizRole } {
  let u: AppUser | null = null;
  try {
    u =
      JSON.parse(localStorage.getItem("ba_user") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    u = null;
  }

  const authRole = (localStorage.getItem("role") || u?.role || "")
    .toString()
    .toLowerCase()
    .trim();

  const userTypeFromUser = coerceBizRole(u?.userType);
  const userTypeFromRole = coerceBizRole(authRole);

  // Default to advertiser for non-admin users if missing
  const bizRole: BizRole = userTypeFromUser || userTypeFromRole || "advertiser";

  return { user: u, authRole: authRole || null, bizRole };
}

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [bizRole, setBizRole] = useState<BizRole>("advertiser");
  const [switching, setSwitching] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => {
      const { user, authRole, bizRole } = readLocal();
      setUser(user);
      setAuthRole(authRole);
      setBizRole(bizRole);
    };
    sync();

    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    window.addEventListener("auth:changed", sync);
    window.addEventListener("storage", sync);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("auth:changed", sync);
      window.removeEventListener("storage", sync);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const isAdmin = (authRole || "").toLowerCase() === "admin";

  const displayName = (() => {
    if (isAdmin) return "Admin";
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    return name || "User";
  })();

  const initials = (() => {
    const [a = "U", b = ""] = displayName.split(" ");
    return (a[0] || "U").toUpperCase() + (b[0] || "").toUpperCase();
  })();

  async function switchProfileType() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      const next: BizRole = bizRole === "advertiser" ? "media_owner" : "advertiser";
      setSwitching(true);

      const res = await fetch(`${API_BASE}/api/auth/switch-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: next }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("switch-role failed", data);
        alert(data?.message || "Failed to switch profile type.");
        return;
      }

      if (data?.user) {
        localStorage.setItem("ba_user", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event("auth:changed"));

      navigate(`/marketplace?view=${next}`, { replace: true });
      setOpen(false);
    } catch (err) {
      console.error("switchProfileType error:", err);
      alert("Network error. Please try again.");
    } finally {
      setSwitching(false);
    }
  }

  function goDashboard() {
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
    setOpen(false);
  }

  function goSettings() {
    // Standalone settings page you created for Topbar
    navigate("/settings");
    setOpen(false);
  }

  function logout() {
    // Clear all auth/session data
    localStorage.removeItem("token");
    localStorage.removeItem("ba_user");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Notify listeners and close the menu
    window.dispatchEvent(new Event("auth:changed"));
    setOpen(false);

    // Redirect to home (NOT login)
    navigate("/", { replace: true });
  }

  // Show switch for everyone except admins
  const canSwitch = !isAdmin;
  const switchLabel =
    bizRole === "advertiser" ? "Become Media Owner" : "Become an Advertiser";

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              BA
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">Barter Adverts</div>
              <div className="text-[11px] text-gray-500 -mt-0.5">
                Media Marketplace
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm">
            <Link to="/marketplace" className="text-gray-700 hover:text-gray-900">
              Marketplace
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-gray-900">
              How It Works
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>

        {/* Right: Profile Dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="h-9 px-2 rounded-full bg-white border border-gray-300 flex items-center gap-2 hover:shadow-sm"
            title="Account"
          >
            <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm leading-4 font-medium text-gray-900">
                {displayName}
              </div>
              <div className="text-[11px] text-gray-500">
                {(isAdmin ? "admin" : (authRole || "user"))}
                {bizRole ? ` • ${bizRole.replace("_", " ")}` : ""}
              </div>
            </div>
            <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-500" aria-hidden="true">
              <path
                d="M5.25 7.5l4.5 4.5 4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
              {/* Header */}
              <div className="px-3 py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{displayName}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  <div className="text-[11px] text-gray-400">
                    {(isAdmin ? "admin" : (authRole || "user"))}
                    {bizRole ? ` • ${bizRole.replace("_", " ")}` : ""}
                  </div>
                </div>
              </div>

              <div className="border-t" />

              <button onClick={goDashboard} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                My Dashboard
              </button>

              <button onClick={goSettings} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                Settings
              </button>

              {canSwitch && (
                <button
                  onClick={switchProfileType}
                  disabled={switching}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                >
                  {switching ? "Switching…" : switchLabel}
                </button>
              )}

              <div className="border-t" />

              <button onClick={logout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
