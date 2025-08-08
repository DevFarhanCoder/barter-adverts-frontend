import { threads, listings } from "../data/mock";

export default function RecentMessages() {
  const rows = threads.slice(0, 5).map((t: { listingId: any; }) => ({
    ...t,
    listing: listings.find((l: { id: any; }) => l.id === t.listingId)?.title || "—",
  }));

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Recent Messages</div>
      <ul className="space-y-3">
        {rows.map(r => (
          <li key={r.id} className="flex items-start justify-between gap-3 border-t pt-3 first:border-0 first:pt-0">
            <div>
              <div className="text-sm font-medium">
                {r.otherUser} • <span className="text-slate-500">{r.listing}</span>
              </div>
              <div className="text-sm text-slate-600 line-clamp-1">{r.lastMessage}</div>
            </div>
            {r.unread > 0 && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">{r.unread}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
