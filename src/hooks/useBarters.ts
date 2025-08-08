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

const API = 'https://barter-adverts-backend.onrender.com';

export function useBarters(userId?: string, token?: string | null) {
  const qc = useQueryClient();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // READ (only current user's barters)
  const bartersQ = useQuery<Barter[]>({
    queryKey: ['barters', userId ?? 'me'],
    queryFn: async () => {
      const url = userId ? `${API}/api/barters?ownerId=${encodeURIComponent(userId)}` : `${API}/api/barters/me`;
      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error('Failed to load barters');
      return r.json();
    },
  });

  // CREATE
  const createBarter = useMutation({
    mutationFn: async (payload: Partial<Barter>) =>
      fetch(`${API}/api/barters`, { method: 'POST', headers, body: JSON.stringify(payload) }).then(r => {
        if (!r.ok) throw new Error('Create failed');
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  // UPDATE
  const updateBarter = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Barter> }) =>
      fetch(`${API}/api/barters/${id}`, { method: 'PUT', headers, body: JSON.stringify(patch) }).then(r => {
        if (!r.ok) throw new Error('Update failed');
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  // DELETE
  const deleteBarter = useMutation({
    mutationFn: async (id: string) =>
      fetch(`${API}/api/barters/${id}`, { method: 'DELETE', headers }).then(r => {
        if (!r.ok) throw new Error('Delete failed');
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barters', userId ?? 'me'] }),
  });

  return { bartersQ, createBarter, updateBarter, deleteBarter };
}
