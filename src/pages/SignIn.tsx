import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, bounce to dashboard/admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (token && role) {
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* ignore parse error */
      }

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Login failed (HTTP ${res.status})`;
        setError(msg);
        setLoading(false);
        return;
      }

      const token: string | undefined = data?.token;
      const user = data?.user;

      if (!token || !user) {
        setError("Unexpected response from server. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("ba_user", JSON.stringify(user));
      const role = (user.role as string) ?? "user";
      localStorage.setItem("role", role);

      window.dispatchEvent(new Event("auth:changed"));
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <LogIn className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Sign in to continue to Barter Adverts
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Mail className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Lock className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-10 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-11 rounded-xl border-0 bg-blue-600 text-white font-medium shadow-sm
                       hover:bg-blue-500 disabled:opacity-50
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       dark:focus:ring-offset-neutral-900"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs md:text-sm">
          <a
            className="text-blue-600 hover:underline dark:text-blue-400"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </a>
          <a
            className="text-gray-600 hover:underline dark:text-neutral-300"
            href="/signup"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
