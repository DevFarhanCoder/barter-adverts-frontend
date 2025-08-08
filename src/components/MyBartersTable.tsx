import React, { useState } from 'react';
import { useBarters, Barter } from '../hooks/useBarters';

type Props = {
  userId?: string;
  authToken?: string | null;
};

const MyBartersTable: React.FC<Props> = ({ userId, authToken }) => {
  const { bartersQ, updateBarter, deleteBarter } = useBarters(userId, authToken);
  const rows = bartersQ.data ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Barter>>({});

  const startEdit = (b: Barter) => {
    setEditingId(b._id);
    setDraft({ title: b.title, description: b.description, category: b.category, location: b.location });
  };

  const saveEdit = (id: string) => {
    updateBarter.mutate({ id, patch: draft as Partial<Barter> }, { onSuccess: () => setEditingId(null) });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this barter?')) return;
    deleteBarter.mutate(id);
  };

  return (
    <div className="rounded-2xl border shadow-sm mt-6 bg-white/90 border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white p-6 pb-0">My Barters</h2>

      <div className="p-6 overflow-x-auto">
        {bartersQ.isLoading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading…</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-300">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 text-left">Title</th>
                <th className="py-3 text-left">Description</th>
                <th className="py-3 text-left">Category</th>
                <th className="py-3 text-left">Location</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const isEdit = editingId === b._id;
                return (
                  <tr key={b._id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 pr-4">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.title ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">{b.title}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.description ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                        />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{b.description || '—'}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.category ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                        />
                      ) : (
                        b.category || '—'
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                      {isEdit ? (
                        <input
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1"
                          value={draft.location ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                        />
                      ) : (
                        b.location || '—'
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      {isEdit ? (
                        <div className="inline-flex gap-2">
                          <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => saveEdit(b._id)}>
                            Save
                          </button>
                          <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-2">
                          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => startEdit(b)}>
                            Edit
                          </button>
                          <button className="px-3 py-1 rounded bg-rose-600 text-white" onClick={() => remove(b._id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
                    No barters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBartersTable;
