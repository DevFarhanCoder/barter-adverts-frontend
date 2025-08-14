// src/pages/RecentMessages.tsx
import { useEffect, useState } from "react";

type Message = {
  _id: string;
  fromName: string;
  subject?: string;
  preview?: string;
  createdAt?: string;
};

export default function RecentMessages() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Message[]>([]);
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
        // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/mine?limit=5`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data?.message || "Failed to load messages");
        // if (alive) setRows(Array.isArray(data) ? data : data.items || []);

        if (alive) setRows([]); // no mock, default to empty
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load messages");
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
      <div className="mb-3 text-sm font-medium text-slate-700">Recent Messages</div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : error ? (
        <div className="text-sm text-rose-600">{error}</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No messages yet.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((m) => (
            <li key={m._id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {m.fromName || "Unknown sender"}
                  </div>
                  {m.subject && (
                    <div className="text-xs text-gray-600 truncate">{m.subject}</div>
                  )}
                  {m.preview && (
                    <div className="text-xs text-gray-500 truncate">{m.preview}</div>
                  )}
                </div>
                {m.createdAt && (
                  <div className="text-[11px] text-gray-400 shrink-0">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
