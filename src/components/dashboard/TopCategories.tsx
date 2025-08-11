// src/components/dashboard/TopCategories.tsx
type Listing = { category?: string; type?: string };

export default function TopCategories({ listings = [] as Listing[] }) {
  // Build counts from category -> count
  const counts = listings.reduce<Record<string, number>>((acc, l) => {
    const cat =
      (l.category?.trim() || l.type?.trim() || '').trim() || 'Uncategorized';
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = data[0]?.[1] ?? 0;

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Top Categories</div>

      {data.length === 0 ? (
        <div className="text-sm text-slate-500">No listings yet.</div>
      ) : (
        <div className="space-y-2">
          {data.map(([cat, n]) => {
            const pct = max > 0 ? (n / max) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{cat}</span>
                  <span className="font-medium">{n}</span>
                </div>
                <div className="h-2 w-full rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-slate-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
