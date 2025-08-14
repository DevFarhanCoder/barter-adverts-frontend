// src/admin/components/ProfileMenu.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

type BAUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;       // "admin" | "user"
  userType?: "advertiser" | "media_owner";
};

function readUser(): {
  user: BAUser | null;
  role: string | null;
  userType: "advertiser" | "media_owner" | null;
} {
  let u: BAUser | null = null;
  try {
    u =
      JSON.parse(localStorage.getItem("ba_user") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    u = null;
  }
  const role =
    (localStorage.getItem("role") || u?.role || "").toString().toLowerCase() ||
    null;

  const ut = (u?.userType as any) || null;
  const userType =
    ut === "advertiser" || ut === "media_owner" ? ut : null;

  return { user: u, role, userType };
}

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<BAUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userType, setUserType] = useState<"advertiser" | "media_owner" | null>(
    null
  );
  const [switching, setSwitching] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Keep component in sync with localStorage/auth changes
  useEffect(() => {
    const sync = () => {
      const { user, role, userType } = readUser();
      setUser(user);
      setRole(role);
      setUserType(userType);
    };
    sync();

    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

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

  const isAdmin = role === "admin";
  const displayName = (() => {
    if (isAdmin) return "Admin";
    const name =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    return name || "User";
  })();

  const initials = (() => {
    const parts = displayName.split(" ");
    const a = parts[0]?.[0] || "A";
    const b = parts[1]?.[0] || "";
    return a.toUpperCase() + b.toUpperCase();
  })();

  async function switchRole() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      if (!userType) {
        alert("Could not detect your current profile type.");
        return;
      }

      const next: "media_owner" | "advertiser" =
        userType === "advertiser" ? "media_owner" : "advertiser";

      setSwitching(true);

      // Call your backend: PATCH /api/auth/switch-role  { role: "media_owner" | "advertiser" }
      // This endpoint already exists and updates user.userType server-side:contentReference[oaicite:8]{index=8}.
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
        console.error("Switch role failed", data);
        alert(data?.message || "Failed to switch role.");
        return;
      }

      // Persist returned user, keep localStorage in sync
      if (data?.user) {
        localStorage.setItem("ba_user", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Keep existing admin/user (auth) role intact
      // userType changes are inside user object
      window.dispatchEvent(new Event("auth:changed"));

      // Redirect to marketplace by new type
      navigate(`/marketplace?view=${next}`, { replace: true });
      setOpen(false);
    } catch (err) {
      console.error("switchRole error:", err);
      alert("Network error. Please try again.");
    } finally {
      setSwitching(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("ba_user");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/login", { replace: true });
  }

  const canSwitch = userType === "advertiser" || userType === "media_owner";
  const switchLabel =
    userType === "advertiser"
      ? "Become Media Owner"
      : userType === "media_owner"
      ? "Become an Advertiser"
      : "Switch Profile Type";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 w-9 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center font-semibold"
        title="Account"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2 text-sm">
            <div className="font-medium">{displayName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isAdmin ? "Admin" : role ? role : "User"}{" "}
              {userType ? `• ${userType.replace("_", " ")}` : ""}
            </div>
            {user?.email && (
              <div className="text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-700" />

          {/* Switch profile type button */}
          {canSwitch && (
            <button
              onClick={switchRole}
              disabled={switching}
              className="w-full text-left px-3 py-2 text-sm transition hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-60"
            >
              {switching ? "Switching…" : switchLabel}
            </button>
          )}

          <div className="border-t border-gray-200 dark:border-neutral-700" />

          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm transition
                       hover:bg-white hover:text-red-600
                       dark:hover:bg-white dark:hover:text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
