'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PokemonCard } from '@/components/PokemonCard';
import type { Pokemon } from '@/types/pokemon';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) return;
    setLoading(true);
    api.favorites
      .list()
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [user]);

  if (!user) {
    return (
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen max-w-container-max mx-auto text-center">
        <p className="font-data-mono text-primary/60 mb-4">AUTHENTICATION REQUIRED</p>
        <Link href="/auth/login" className="font-ui-header text-primary border border-primary/40 px-6 py-3">
          LOGIN TO VIEW INTEL
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen max-w-container-max mx-auto">
      <header className="mb-12">
        <p className="font-data-mono text-data-mono text-primary/60 mb-2">INTEL_MODE // FAVORITE_ARCHIVE</p>
        <h2 className="font-display-lg text-display-lg text-primary uppercase">Saved Targets</h2>
      </header>

      {loading ? (
        <p className="font-data-mono text-primary animate-pulse">LOADING FAVORITES...</p>
      ) : favorites.length === 0 ? (
        <motion.div className="glass-panel border border-primary/10 rounded-xl p-12 text-center">
          <p className="font-data-mono text-outline mb-4">NO FAVORITES LOGGED</p>
          <Link href="/dex" className="font-ui-header text-primary border border-primary/40 px-6 py-3 inline-block">
            BROWSE DEX
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {favorites.map((p) => (
            <PokemonCard key={p.dexNumber} pokemon={p} onFavoriteToggle={load} />
          ))}
        </div>
      )}
    </main>
  );
}
