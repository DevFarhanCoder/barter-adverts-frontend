// src/utils/api.ts
// src/utils/api.ts
export const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

if (!API) {
  // Fail fast if env is missing
  // (Vite will inline this at build time)
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set");
}

type ApiError = Error & { status?: number; body?: unknown };

function makeError(status: number, body: unknown, fallback: string): ApiError {
  const e = new Error(
    typeof body === "object" && body && "message" in (body as any)
      ? String((body as any).message)
      : fallback
  ) as ApiError;
  e.status = status;
  e.body = body;
  return e;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {},
  { timeoutMs = 15000 }: { timeoutMs?: number } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ? Object.fromEntries(Object.entries(options.headers).map(([k, v]) => [k, String(v)])) : {}),
    ...getAuthHeaders(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw new Error(err?.message || "Network error");
  } finally {
    clearTimeout(timer);
  }

  // Try to parse JSON safely
  let body: unknown = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      body = await res.json();
    } catch {
      body = null;
    }
  } else {
    // For non-JSON (204, text, etc.)
    body = await res.text().catch(() => null);
  }

  if (!res.ok) {
    // Auto-handle auth errors
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("ba_user");
      localStorage.removeItem("role");
      // Optional: navigate to login if you're in a component
      // Here we just throw; caller can route on 401.
    }
    throw makeError(res.status, body, `API error: ${res.status}`);
  }

  // If server returned no content
  if (res.status === 204) return undefined as T;

  return body as T;
}

// Convenience helpers
export const api = {
  get: <T = any>(url: string, init?: RequestInit) =>
    apiFetch<T>(url, { ...init, method: "GET" }),
  post: <T = any>(url: string, data?: unknown, init?: RequestInit) =>
    apiFetch<T>(url, {
      ...init,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T = any>(url: string, data?: unknown, init?: RequestInit) =>
    apiFetch<T>(url, {
      ...init,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  del: <T = any>(url: string, init?: RequestInit) =>
    apiFetch<T>(url, { ...init, method: "DELETE" }),
};
