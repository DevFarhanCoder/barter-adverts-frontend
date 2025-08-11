// src/hooks/useBarters.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Barter = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  status?: 'active' | 'archived' | 'pending' | 'proposed' | 'countered' | 'completed';
  createdAt?: string;
  ownerId?: string;
};

const API = (import.meta.env.VITE_API_BASE_URL || 'https://barter-adverts-backend.onrender.com').replace(/\/+$/,'');

function makeHeaders(): HeadersInit {
  const token = localStorage.getItem('token'); // Always get token from localStorage
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function http<T = any>(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, opts);

  if (res.status === 204) return {} as T;

  const ct = res.headers.get('content-type') || '';
  // Prefer JSON if the server says it's JSON
  if (ct.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data as T;
  }

  // Fallback: read as text (likely HTML error page)
  const text = await res.text();
  if (!res.ok) {
    // Trim noisy HTML; show first bytes as hint
    const snippet = text?.slice(0, 200) || res.statusText;
    throw new Error(snippet);
  }
  // If a non‑JSON success ever happens, return an empty object
  return {} as T;
}


export function useBarters(userId?: string) {
  const qc = useQueryClient();
  const headers = makeHeaders();

  // READ (current user or specific owner)
  const bartersQ = useQuery<Barter[]>({
    queryKey: ['barters', userId ?? 'me'],
    queryFn: () =>
      userId
        ? http<Barter[]>(`/api/barters?ownerId=${encodeURIComponent(userId)}`, { headers })
        : http<Barter[]>('/api/barters/me', { headers }),
  });

  // CREATE
  const createBarter = useMutation({
    mutationFn: (payload: Partial<Barter>) =>
      http<Barter>('/api/barters', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  // UPDATE
  const updateBarter = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Barter> }) =>
      http<Barter>(`/api/barters/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  // DELETE
  const deleteBarter = useMutation({
    mutationFn: (id: string) =>
      http(`/api/barters/${id}`, {
        method: 'DELETE',
        headers,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  return { bartersQ, createBarter, updateBarter, deleteBarter, API_BASE: API };
}