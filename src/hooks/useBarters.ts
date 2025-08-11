// src/hooks/useBarters.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const CLICKS_KEY = 'barter_clicks_v1';
const UNREAD_KEY = 'unreadMessages';

type ClickBucket = { d: string; c: number };
type ClickStore = Record<string, { total: number; buckets: ClickBucket[] }>;

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function readClicks(): ClickStore {
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeClicks(store: ClickStore) {
  localStorage.setItem(CLICKS_KEY, JSON.stringify(store));
}

/** Call this anywhere (e.g., when a user opens a listing) */
export function recordListingClick(id: string | number) {
  const k = String(id);
  const store = readClicks();
  const item = store[k] ?? { total: 0, buckets: [] };

  // increment total
  item.total += 1;

  // increment today's bucket
  const key = todayKey();
  const idx = item.buckets.findIndex(b => b.d === key);
  if (idx >= 0) item.buckets[idx].c += 1;
  else item.buckets.push({ d: key, c: 1 });

  // keep only last 30 days of buckets
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  item.buckets = item.buckets.filter(b => new Date(b.d) >= cutoff);

  store[k] = item;
  writeClicks(store);
}

function sumClicks7d(store: ClickStore) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6); // include today + 6 previous days
  let total = 0;
  for (const id in store) {
    for (const bucket of store[id].buckets) {
      const d = new Date(bucket.d);
      if (d >= cutoff) total += bucket.c;
    }
  }
  return total;
}

/** Helper to sum total clicks across all listings */
function sumTotalClicks(store: ClickStore) {
  return Object.values(store).reduce((acc, v) => acc + (v.total || 0), 0);
}

type Barter = {
  _id?: string;
  id?: string | number;
  status?: string;
  // any other fields you have…
};

type Metrics = {
  totalListings: number;
  activeListings: number;
  archivedListings: number;
  totalClicks: number;
  clicks7d: number;
  unreadMessages: number;
};

async function fetchBarters(token?: string) {
  const base = import.meta.env.VITE_API_BASE_URL;
  const url = token ? `${base}/api/barters/me` : `${base}/api/barters`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Fetch barters failed (${res.status})`);
  return res.json();
}

export function useBarters(_unused?: unknown, token?: string) {
  const bartersQ = useQuery({
    queryKey: ['barters', token ? 'me' : 'public'],
    queryFn: () => fetchBarters(token ?? undefined),
  });

  const metrics: Metrics = useMemo(() => {
    const items: Barter[] = Array.isArray(bartersQ.data) ? bartersQ.data : [];

    const totalListings = items.length;
    const activeListings = items.filter(
      (b) => String(b.status || '').toLowerCase() === 'active'
    ).length;
    const archivedListings = items.filter(
      (b) => String(b.status || '').toLowerCase() === 'archived'
    ).length;

    const clicksStore = readClicks();
    const totalClicks = sumTotalClicks(clicksStore);
    const clicks7d = sumClicks7d(clicksStore);
    const unreadMessages = Number(localStorage.getItem(UNREAD_KEY) ?? 0);

    return {
      totalListings,
      activeListings,
      archivedListings,
      totalClicks,
      clicks7d,
      unreadMessages,
    };
  }, [bartersQ.data]);

  return { bartersQ, metrics };
}
``