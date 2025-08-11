// src/pages/Listings.tsx
import React from 'react';
import { useBarters } from '../hooks/useBarters';

type Barter = {
  _id: string;
  title?: string;
  category?: string;
  location?: string;
  status?: string;   // "active" | "archived" | etc.
  description?: string;
  createdAt?: string;
};

export default function Listings() {
  // if your hook accepts a token, pass it; otherwise just call useBarters()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { bartersQ } = useBarters(undefined, token || undefined);

  const loading = !!bartersQ?.isLoading;
  const error   = bartersQ?.isError ? (bartersQ.error as any) : null;
  const items: Barter[] = Array.isArray(bartersQ?.data) ? (bartersQ!.data as Barter[]) : [];

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
        <div className="mt-2 h-10 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
        <div className="mt-2 h-10 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-6 text-red-600 dark:bg-gray-800 dark:border-gray-700">
        Failed to load your listings. {error?.message || 'Please try again.'}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Listings</div>
        <p className="mt-2 text-sm text-gray-500">You haven’t created any listings yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">My Listings</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 dark:text-gray-400">
            <tr>
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Location</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const created = it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '—';
              return (
                <tr key={it._id} className="border-t dark:border-gray-700">
                  <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{it.title || 'Untitled'}</td>
                  <td className="py-2 pr-3">{it.category || '—'}</td>
                  <td className="py-2 pr-3">{it.location || '—'}</td>
                  <td className="py-2 pr-3 capitalize">{(it.status || '—').toString()}</td>
                  <td className="py-2 pr-3">{created}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
