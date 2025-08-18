// src/hooks/useBarters.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

type Barter = {
  _id: string;
  title: string;
  status?: "active" | "archived" | "pending" | "proposed" | "countered" | "completed";
  category?: string;
  type?: string;
  createdAt?: string;
  clicks7d?: number;    // optional: if/when you track it
  totalClicks?: number; // optional: if/when you track it
};

const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export function useBarters() {
  const [data, setData] = useState<Barter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/barters/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const ct = res.headers.get("content-type") || "";
        const body = ct.includes("application/json") ? await res.json() : await res.text();

        if (!res.ok) throw new Error(typeof body === "string" ? body : body?.message || `HTTP ${res.status}`);

        const rows = Array.isArray((body as any)?.barters)
          ? (body as any).barters
          : Array.isArray(body)
          ? (body as any)
          : [];
        if (alive) setData(rows);
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load listings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalListings = data.length;
    const activeListings = data.filter((b) => (b.status || "active") === "active").length;
    const archivedListings = data.filter((b) => b.status === "archived").length;

    const clicks7d = data.reduce((sum, b) => sum + (Number(b.clicks7d) || 0), 0);
    const totalClicks = data.reduce((sum, b) => sum + (Number(b.totalClicks) || 0), 0);

    const categoryCounts = data.reduce<Record<string, number>>((acc, b) => {
      const key = (b.category || b.type || "Uncategorized").trim();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return { totalListings, activeListings, archivedListings, clicks7d, totalClicks, categoryCounts };
  }, [data]);

  const bartersQ = { isLoading, error, data };
  return { bartersQ, metrics, listings: data };
}
