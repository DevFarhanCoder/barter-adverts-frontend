import { useEffect, useState } from "react";
import { api } from "../../utils/api";

type Listing = {
  _id: string;
  title: string;
  status: string;
  verified?: boolean;
  ownerType?: "media_owner" | "advertiser" | null;
};

type Tab = "all" | "media_owner" | "advertiser";

export default function AdminListings() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(false);

  async function load(t: Tab) {
    setLoading(true);
    try {
      const q = t === "all" ? "" : `?ownerType=${t}`;
      const r = await api.get<{ listings: Listing[] }>(`/api/admin/barters${q ? q : ""}`);
      setRows(r.listings);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tab); }, [tab]);

  const toggleVerify = async (id: string, verified: boolean) => {
    await api.patch(`/api/admin/barters/${id}/verify`, { verified });
    setRows(prev => prev.map(x => x._id === id ? { ...x, verified } : x));
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold">Listings</h1>

        {/* Tabs */}
        <div className="rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 flex">
          {(["all", "media_owner", "advertiser"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-4 py-1.5 rounded-full text-sm md:text-base transition " +
                (tab === t
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800")
              }
            >
              {t === "all" ? "All" : t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-50 dark:bg-neutral-900/60 border-b border-gray-200 dark:border-neutral-800">
            <tr className="[&>th]:py-3 [&>th]:px-4 [&>th]:text-left [&>th]:font-semibold text-gray-600 dark:text-neutral-300 uppercase tracking-wide text-xs md:text-sm">
              <th>Title</th>
              <th>Status</th>
              <th>Owner Type</th>
              <th>Verified</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="[&>tr:nth-child(even)]:bg-gray-50/60 dark:[&>tr:nth-child(even)]:bg-neutral-900/50">
            {rows.map((x) => (
              <tr
                key={x._id}
                className="hover:bg-gray-100/80 dark:hover:bg-neutral-800/70 transition-colors border-b border-gray-100 dark:border-neutral-800"
              >
                <td className="px-4 py-3 font-medium">{x.title}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs md:text-sm bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white">
                    {x.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs md:text-sm bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white capitalize">
                    {x.ownerType ? x.ownerType.replace("_", " ") : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs md:text-sm " +
                      (x.verified ? "bg-emerald-600 text-white" : "bg-gray-300 dark:bg-neutral-700 text-gray-800 dark:text-white")
                    }
                  >
                    {x.verified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleVerify(x._id, !x.verified)}
                      className={
                        "rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium shadow-sm " +
                        (x.verified ? "bg-rose-600 text-white hover:bg-rose-500" : "bg-emerald-600 text-white hover:bg-emerald-500")
                      }
                      disabled={loading}
                    >
                      {x.verified ? "Unverify" : "Verify"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500 dark:text-neutral-400">
                  {loading ? "Loading…" : "No listings found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
