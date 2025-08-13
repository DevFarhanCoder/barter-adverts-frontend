import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { Users, Layers, CheckCircle2, Clock } from "lucide-react";

type Metrics = {
  users: number;
  listings: number;
  verifiedListings: number;
  pendingListings: number;
  series?: {
    labels: string[];
    users: number[];
    listings: number[];
    verified: number[];
    pending: number[];
  };
};

type CountryItem = { country: string; count: number; pct: number };
type CountryResp = { total: number; items: CountryItem[] };

type Listing = {
  _id: string;
  title: string;
  status: string;
  verified?: boolean;
  ownerType?: "media_owner" | "advertiser" | null;
  createdAt?: string;
};

export default function AdminOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // New data
  const [countries, setCountries] = useState<CountryResp | null>(null);
  const [recent, setRecent] = useState<Listing[]>([]);

  useEffect(() => {
    api.get<Metrics>("/api/admin/metrics").then(setMetrics).catch((e) => setErr((e as Error).message));
    api.get<CountryResp>("/api/admin/users-by-country").then(setCountries).catch(() => setCountries({ total: 0, items: [] }));
    api.get<{ listings: Listing[] }>("/api/admin/barters?limit=8").then((r) => setRecent(r.listings)).catch(() => setRecent([]));
  }, []);

  if (err) return <div className="text-red-600">Error: {err}</div>;
  if (!metrics) return <div>Loading...</div>;

  const cards = [
    { title: "Users", value: metrics.users, icon: Users, series: metrics.series?.users || [] },
    { title: "Listings", value: metrics.listings, icon: Layers, series: metrics.series?.listings || [] },
    { title: "Verified", value: metrics.verifiedListings, icon: CheckCircle2, series: metrics.series?.verified || [] },
    { title: "Pending", value: metrics.pendingListings, icon: Clock, series: metrics.series?.pending || [] },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((it) => (
          <Card key={it.title} title={it.title} value={it.value} icon={it.icon as any} series={it.series} />
        ))}
      </div>

      {/* 2-column section: Countries (pie) + Recent postings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Users by country</h3>
            <span className="text-xs text-gray-500 dark:text-neutral-400">{countries?.total || 0} users</span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
            <DonutChart
              data={(countries?.items || []).map((i) => ({ label: i.country, value: i.count }))}
            />
            <Legend items={countries?.items || []} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent postings</h3>
            <a href="/admin/listings" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </a>
          </div>

          <ul className="mt-3 divide-y divide-gray-200 dark:divide-neutral-800">
            {recent.length === 0 && (
              <li className="py-8 text-center text-gray-500 dark:text-neutral-400">No recent listings.</li>
            )}
            {recent.slice(0, 8).map((x) => (
              <li key={x._id} className="py-3 flex items-center gap-3">
                <div className={
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs " +
                  (x.ownerType === "media_owner"
                    ? "bg-purple-600 text-white"
                    : x.ownerType === "advertiser"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-300 dark:bg-neutral-700 text-gray-900 dark:text-white")
                }>
                  {x.ownerType ? x.ownerType.replace("_", " ") : "—"}
                </div>
                <div className="flex-1">
                  <div className="font-medium truncate">{x.title}</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">
                    {x.status}{x.verified ? " • verified" : ""}{x.createdAt ? " • " + new Date(x.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
                <button
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-medium shadow-sm " +
                    (x.verified ? "bg-rose-600 text-white hover:bg-rose-500" : "bg-emerald-600 text-white hover:bg-emerald-500")
                  }
                  onClick={() => {/* quick link to details later */}}
                  disabled
                  title="Open listing (soon)"
                >
                  {x.verified ? "Unverify" : "Verify"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Cards (unchanged) --------------------------- */
function Card({
  title, value, icon: Icon, series,
}: { title: string; value: number; icon: React.ComponentType<any>; series: number[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-600 dark:text-neutral-300">{title}</div>
        <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
        </div>
      </div>
      <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</div>
      <div className="mt-3">
        <Sparkline data={series} />
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 300, h = 60, pad = 6;
  const N = Math.max(1, data.length);
  const max = Math.max(1, ...data);
  const pts = data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (N - 1 || 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} className="stroke-gray-200 dark:stroke-neutral-800" strokeWidth="1" />
      <polyline points={`${pad},${h - pad} ${pts} ${w - pad},${h - pad}`} className="fill-blue-500/15" />
      <polyline points={pts} className="stroke-blue-500" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------- Donut + Legend -------------------------------- */
function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = [
    "#2563eb","#16a34a","#f59e0b","#ec4899","#10b981",
    "#8b5cf6","#ef4444","#14b8a6","#f97316","#64748b"
  ];

  let acc = 0;
  const stops = data.map((d, i) => {
    const deg = total ? (d.value / total) * 360 : 0;
    const from = acc;
    const to = acc + deg;
    acc = to;
    return `${colors[i % colors.length]} ${from}deg ${to}deg`;
  }).join(", ");

  return (
    <div className="flex justify-center w-full">
      {/* responsive sizes: xs 10rem, sm 12rem, md 14rem */}
      <div
        className="relative rounded-full w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
        style={{ background: `conic-gradient(${stops || "#e5e7eb 0 360deg"})` }}
        aria-label="Users by country chart"
      >
        {/* hole scales too */}
        <div className="absolute inset-4 sm:inset-5 md:inset-6 rounded-full bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-semibold">{total}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400">users</div>
          </div>
        </div>
      </div>
    </div>
  );
}


function Legend({ items }: { items: CountryItem[] }) {
  const colors = ["#2563eb","#16a34a","#f59e0b","#ec4899","#10b981",
                  "#8b5cf6","#ef4444","#14b8a6","#f97316","#64748b"];
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 min-w-0">
      {items.slice(0, 10).map((it, i) => (
        <div key={it.country} className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }} />
          <div className="text-sm truncate">
            <span className="font-medium">{it.country}</span>{" "}
            <span className="text-gray-500 dark:text-neutral-400">({it.pct}%)</span>
          </div>
        </div>
      ))}
      {items.length > 10 && (
        <div className="text-xs text-gray-500 dark:text-neutral-400">+{items.length - 10} more…</div>
      )}
    </div>
  );
}
