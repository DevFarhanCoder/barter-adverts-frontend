import { trades, listings } from "../data/mock";

export default function RecentTrades() {
  const rows = trades
    .slice(0, 6)
    .map((t: { listingId: any; }) => ({ ...t, listing: listings.find((l: { id: any; }) => l.id === t.listingId)?.title || "—" }));

  const badge = (s: string) => {
    const map: Record<string,string> = {
      proposed: "bg-amber-100 text-amber-700",
      countered: "bg-blue-100 text-blue-700",
      accepted: "bg-emerald-100 text-emerald-700",
      declined: "bg-rose-100 text-rose-700",
      completed: "bg-slate-200 text-slate-700",
    };
    return map[s] ?? "bg-slate-100 text-slate-700";
  };

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Recent Trades</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr><th className="py-2">Listing</th><th>With</th><th>Status</th><th>Created</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.listing}</td>
                <td>{r.withUser}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge(r.status)}`}>{r.status}</span></td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
