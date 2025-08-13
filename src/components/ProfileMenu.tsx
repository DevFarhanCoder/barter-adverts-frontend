// src/admin/components/ProfileMenu.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("ba_user") || "null");
        } catch {
            return null;
        }
    })();

    const initials =
        (user?.firstName?.[0] || "A").toUpperCase() +
        (user?.lastName?.[0] || "").toUpperCase();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("ba_user");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("auth:changed"));
        navigate("/login", { replace: true });
    }

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
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden">
                    <div className="px-3 py-2 text-sm">
                        <div className="font-medium">{user?.firstName || "Admin"}</div>
                        <div className="text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                    </div>
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
