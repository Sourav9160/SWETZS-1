'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '@/lib/api';
import type { User } from '@/types/pokemon';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: u } = await api.auth.me();
      setUser(u);
    } catch {
      setUser(null);
      setAuthToken(null);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('swetzs_token') : null;
    if (token) refreshUser().finally(() => setLoading(false));
    else setLoading(false);
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { user: u, token } = await api.auth.login({ email, password });
    setAuthToken(token);
    setUser(u);
  };

  const register = async (username: string, email: string, password: string) => {
    const { user: u, token } = await api.auth.register({ username, email, password });
    setAuthToken(token);
    setUser(u);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
