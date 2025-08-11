// src/pages/AuthPage.tsx
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { API } from "../utils/api";
import { AuthMode, UserRole, AuthUser } from "../types";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [params] = useSearchParams();
  const mode = (params.get("mode") as AuthMode) || "signup";
  const role = (params.get("role") as UserRole) || "advertiser";
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const path = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup
        ? { email, password, name, role }
        : { email, password, role };

      const data = await jsonFetch<AuthUser>(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // 🔹 Persist role and user info locally
      localStorage.setItem("role", role);
      localStorage.setItem("ba_user", JSON.stringify({ ...data, role }));

      // 🔹 Trigger update for any role-dependent components
      window.dispatchEvent(new Event("auth:changed"));

      login({ ...data, role });

      navigate("/"); // go to main page
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-6">
        <div className="text-sm opacity-70 mb-1">You’re signing as</div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
          <span className="font-medium capitalize">{role.replace("_", " ")}</span>
          <Link
            to={`/auth/select?mode=${mode}`}
            className="underline opacity-70 hover:opacity-100"
          >
            change
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignup && (
          <input
            className="w-full rounded-xl border p-3 outline-none"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full rounded-xl border p-3 outline-none"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border p-3 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-black text-white py-3 hover:opacity-90"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link className="underline" to={`/auth?mode=login&role=${role}`}>
              Login
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link className="underline" to={`/auth?mode=signup&role=${role}`}>
              Create an account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Utility fetch wrapper
async function jsonFetch<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return res.json();
}
