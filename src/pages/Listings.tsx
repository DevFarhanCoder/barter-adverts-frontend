// src/pages/Listings.tsx
import React, { useMemo, useState } from "react";
import { Edit3, Trash2, Search, Filter } from "lucide-react";
import { useBarters, Barter } from "../hooks/useBarters";

const Listings: React.FC = () => {
  const { bartersQ, updateBarter, deleteBarter } = useBarters();

  // UI state
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | NonNullable<Barter["status"]>>(
    "all"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Barter>>({});
  const [err, setErr] = useState("");

  const items = bartersQ.data ?? [];

  const filtered = useMemo(() => {
    const s = status === "all" ? undefined : status;
    return items.filter((b) => {
      const matchQ =
        !q ||
        (b.title || "").toLowerCase().includes(q.toLowerCase()) ||
        (b.description || "").toLowerCase().includes(q.toLowerCase());
      const matchStatus = !s || (b.status || "active") === s;
      return matchQ && matchStatus;
    });
  }, [items, q, status]);

  const startEdit = (b: Barter) => {
    setEditingId(b._id); // ✅ use Mongo _id
    setDraft({ title: b.title, description: b.description });
    setErr("");
  };

  const save = async (id: string) => {
    try {
      const patch: Partial<Barter> = {};
      if (typeof draft.title === "string") patch.title = draft.title.trim();
      if (typeof draft.description === "string")
        patch.description = draft.description.trim();

      if (!patch.title && !patch.description) {
        setEditingId(null);
        return;
      }
      await updateBarter.mutateAsync({ id, patch }); // ✅ PUT /api/barters/:id
      setEditingId(null);
    } catch (e: any) {
      setErr(e.message || "Update failed");
    }
  };

  const remove = async (id: string) => {
    setErr("");
    if (!id) return setErr("Missing barter ID.");
    if (!confirm("Delete this listing?")) return;
    try {
      await deleteBarter.mutateAsync(id); // ✅ DELETE /api/barters/:id
    } catch (e: any) {
      setErr(e.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Listings
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search listings…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="inline-flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
              <option value="proposed">Proposed</option>
              <option value="countered">Countered</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {err && <div className="text-sm text-rose-500">{err}</div>}

      {/* Table */}
      <div className="rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-300">
          {bartersQ.isLoading ? "Loading…" : `${filtered.length} item(s)`}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-300">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-6">Title</th>
                <th className="text-left py-3 px-6">Description</th>
                <th className="text-left py-3 px-6">Status</th>
                <th className="text-right py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const isEdit = editingId === b._id;
                return (
                  <tr key={b._id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-6">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.title ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, title: e.target.value }))
                          }
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">
                          {b.title}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.description ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              description: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                          {b.description || "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                        {b.status || "active"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {isEdit ? (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => save(b._id)}
                            disabled={updateBarter.isPending}
                            className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded bg-gray-600 text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => startEdit(b)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white"
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => remove(b._id)}
                            disabled={deleteBarter.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-rose-600 text-white disabled:opacity-60"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!bartersQ.isLoading && filtered.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-gray-500 dark:text-gray-400" colSpan={4}>
                    No listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listings;
