const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('swetzs_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data as T;
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  auth: {
    register: (body: { username: string; email: string; password: string }) =>
      request<{ user: import('@/types/pokemon').User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ user: import('@/types/pokemon').User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () => request<{ user: import('@/types/pokemon').User }>('/auth/me'),
  },

  pokemon: {
    list: (params: Record<string, string | number | undefined> = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== 'all') qs.set(k, String(v));
      });
      return request<import('@/types/pokemon').PokemonListResponse>(`/pokemon?${qs}`);
    },
    get: (id: number) =>
      request<import('@/types/pokemon').PokemonDetailResponse>(`/pokemon/${id}`),
    filters: () => request<import('@/types/pokemon').FilterMeta>('/pokemon/meta/filters'),
    evolution: (id: number) =>
      request<{ evolutionChain: import('@/types/pokemon').Pokemon[] }>(`/pokemon/${id}/evolution`),
  },

  favorites: {
    list: () => request<{ data: import('@/types/pokemon').Pokemon[]; total: number }>('/favorites'),
    add: (dexNumber: number) =>
      request<{ favorites: number[] }>(`/favorites/${dexNumber}`, { method: 'POST' }),
    remove: (dexNumber: number) =>
      request<{ favorites: number[] }>(`/favorites/${dexNumber}`, { method: 'DELETE' }),
  },

  compare: {
    list: () =>
      request<{
        data: import('@/types/pokemon').Pokemon[];
        total: number;
        max: number;
      }>('/compare'),
    add: (dexNumber: number) =>
      request<{ compareList: number[] }>(`/compare/${dexNumber}`, { method: 'POST' }),
    remove: (dexNumber: number) =>
      request<{ compareList: number[] }>(`/compare/${dexNumber}`, { method: 'DELETE' }),
    clear: () => request<{ compareList: number[] }>('/compare', { method: 'DELETE' }),
  },
};

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('swetzs_token', token);
  else localStorage.removeItem('swetzs_token');
}
