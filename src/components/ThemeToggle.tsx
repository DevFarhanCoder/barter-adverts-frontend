// src/admin/components/ThemeToggle.tsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState<boolean>(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(d => !d)}
            className="px-3 h-9 rounded-lg border border-gray-300 dark:border-neutral-700
             bg-white dark:bg-neutral-800 text-sm
             hover:bg-gray-50 dark:hover:bg-neutral-700
             outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
             dark:focus:ring-offset-neutral-900"
            title={dark ? "Switch to Light" : "Switch to Dark"}
        >
            {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
