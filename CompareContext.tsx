'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Pokemon } from '@/types/pokemon';
import { useAuth } from './AuthContext';

interface CompareContextValue {
  compareList: Pokemon[];
  loading: boolean;
  addToCompare: (dexNumber: number) => Promise<void>;
  removeFromCompare: (dexNumber: number) => Promise<void>;
  clearCompare: () => Promise<void>;
  isInCompare: (dexNumber: number) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [compareList, setCompareList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCompare = useCallback(async () => {
    if (!user) {
      setCompareList([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.compare.list();
      setCompareList(data);
    } catch {
      setCompareList([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCompare();
  }, [loadCompare]);

  const addToCompare = async (dexNumber: number) => {
    await api.compare.add(dexNumber);
    await loadCompare();
  };

  const removeFromCompare = async (dexNumber: number) => {
    await api.compare.remove(dexNumber);
    await loadCompare();
  };

  const clearCompare = async () => {
    await api.compare.clear();
    setCompareList([]);
  };

  const isInCompare = (dexNumber: number) =>
    compareList.some((p) => p.dexNumber === dexNumber);

  return (
    <CompareContext.Provider
      value={{ compareList, loading, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
