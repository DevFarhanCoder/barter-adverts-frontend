// src/pages/RecentTrades.tsx
import { useEffect, useState } from "react";

type Trade = {
  _id: string;
  title: string;
  counterparty?: string;
  status?: "pending" | "completed" | "rejected";
  createdAt?: string;
};

function StatusBadge({ status }: { status?: Trade["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };
  const cls = map[status || "pending"] || "bg-gray-100 text-gray-700";
  const label = status ? status[0].toUpperCase() + status.slice(1) : "Pending";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {label}
    </span>
  );
}

export default function RecentTrades() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: replace with your real endpoint when ready.
        // Example:
        // const token = localStorage.getItem("token");
        // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trades/mine?limit=5`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data?.message || "Failed to load trades");
        // if (alive) setRows(Array.isArray(data) ? data : data.items || []);

        if (alive) setRows([]); // no mock, default to empty
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load trades");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Recent Trades</div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : error ? (
        <div className="text-sm text-rose-600">{error}</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No trades yet.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((t) => (
            <li key={t._id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {t.title || "Untitled trade"}
                  </div>
                  {t.counterparty && (
                    <div className="text-xs text-gray-600 truncate">
                      With {t.counterparty}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={t.status} />
                  {t.createdAt && (
                    <div className="text-[11px] text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
