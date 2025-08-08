import { listings } from "./data/mock";

export default function TopCategories() {
  const counts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] ?? 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Top Categories</div>
      <div className="space-y-2">
        {data.map(([cat, n]) => (
          <div key={cat}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{cat}</span>
              <span className="font-medium">{n}</span>
            </div>
            <div className="h-2 w-full rounded bg-slate-100">
              <div className="h-2 rounded bg-slate-400" style={{ width: `${(n / data[0][1]) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
