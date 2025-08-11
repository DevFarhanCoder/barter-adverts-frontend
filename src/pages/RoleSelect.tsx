// src/pages/RoleSelect.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthMode, UserRole } from "../types";

const roles: { key: UserRole; title: string; desc: string }[] = [
  { key: "advertiser",  title: "Advertiser",  desc: "Find media owners to barter placements." },
  { key: "media_owner", title: "Media Owner", desc: "List your inventory and receive offers." },
];

export default function RoleSelect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = (params.get("mode") as AuthMode) || "signup";

  const choose = (role: UserRole) => {
    // persist selection so Marketplace sees it without re-login
    localStorage.setItem("role", role);
    // optional: update in ba_user if you use it
    try {
      const u = JSON.parse(localStorage.getItem("ba_user") || "{}");
      u.role = role;
      localStorage.setItem("ba_user", JSON.stringify(u));
    } catch {}
    // trigger update for any components using useRole()
    window.dispatchEvent(new Event("auth:changed"));

    navigate(`/auth?mode=${mode}&role=${role}`);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Continue as</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map(r => (
          <button
            key={r.key}
            onClick={() => choose(r.key)}
            className="rounded-2xl border p-6 text-left shadow hover:shadow-md transition"
          >
            <div className="text-lg font-semibold">{r.title}</div>
            <p className="text-sm mt-1 opacity-80">{r.desc}</p>
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm opacity-70">
        You can change this later in Settings (optional).
      </p>
    </div>
  );
}
