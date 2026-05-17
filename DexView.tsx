'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { databaseLabel } from '@/lib/pokemonUtils';
import type { FilterMeta, Pokemon } from '@/types/pokemon';
import { FilterBar, type Filters } from './FilterBar';
import { PokemonCard } from './PokemonCard';

const REGIONS = ['all', 'kanto', 'johto', 'hoenn', 'sinnoh'];

const defaultFilters: Filters = {
  q: '',
  type: 'all',
  generation: null,
  region: 'all',
};

export function DexView() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [meta, setMeta] = useState<FilterMeta | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.pokemon.filters().then(setMeta).catch(() => {});
  }, []);

  const fetchPokemon = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      try {
        const res = await api.pokemon.list({
          q: filters.q || undefined,
          type: filters.type !== 'all' ? filters.type : undefined,
          generation: filters.generation ?? undefined,
          region: filters.region !== 'all' ? filters.region : undefined,
          page: pageNum,
          limit: 24,
        });
        setPokemon((prev) => (append ? [...prev, ...res.data] : res.data));
        setTotal(res.pagination.total);
        setHasMore(res.pagination.hasMore);
        setPage(pageNum);
      } catch {
        if (!append) setPokemon([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchPokemon(1, false), 300);
    return () => clearTimeout(timer);
  }, [filters, fetchPokemon, refreshKey]);

  const cycleRegion = () => {
    const idx = REGIONS.indexOf(filters.region);
    setFilters({ ...filters, region: REGIONS[(idx + 1) % REGIONS.length] });
  };

  return (
    <>
      <header className="mb-12 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-50" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-data-mono text-data-mono text-primary/60 mb-2">
              SYSTEM_STATUS: ONLINE // DATABASE: ACTIVE
            </p>
            <h2 className="font-display-lg text-display-lg text-primary uppercase">Neural Pokédex</h2>
          </div>
          <div className="glass-panel bg-surface-container-low/30 border border-primary/20 p-4 rounded-xl flex items-center gap-6">
            <div className="text-right">
              <p className="font-data-mono text-[10px] text-outline uppercase">Active Database</p>
              <p className="font-ui-header text-ui-header text-primary">
                {databaseLabel(filters.region)}
              </p>
            </div>
            <div className="h-10 w-[1px] bg-primary/20" />
            <div className="text-right">
              <p className="font-data-mono text-[10px] text-outline uppercase">Records</p>
              <p className="font-ui-header text-ui-header text-secondary">{total}</p>
            </div>
          </div>
        </div>
      </header>

      <FilterBar
        filters={filters}
        meta={meta}
        onChange={setFilters}
        onRegionCycle={cycleRegion}
      />

      {loading && pokemon.length === 0 ? (
        <div className="flex justify-center py-24">
          <p className="font-data-mono text-primary animate-pulse">SCANNING DATABASE...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {pokemon.map((p, i) => (
            <motion.div
              key={p.dexNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 24) * 0.03 }}
            >
              <PokemonCard pokemon={p} onFavoriteToggle={() => setRefreshKey((k) => k + 1)} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#a8e8ff]" />
          <motion.div className="w-12 h-[1px] bg-primary/20" />
          <p className="font-data-mono text-[12px] text-outline">
            {hasMore ? `SECTOR ${page} // ${pokemon.length} OF ${total} RECORDS` : `${total} RECORDS LOADED`}
          </p>
          <div className="w-12 h-[1px] bg-primary/20" />
          <div className={`w-2 h-2 rounded-full ${hasMore ? 'bg-primary/20' : 'bg-primary shadow-[0_0_8px_#a8e8ff]'}`} />
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => fetchPokemon(page + 1, true)}
            disabled={loading}
            className="px-8 py-4 border border-primary/40 glass-panel bg-primary/5 hover:bg-primary/10 text-primary font-ui-header text-ui-header tracking-widest uppercase transition-all duration-300 group disabled:opacity-50"
          >
            {loading ? 'FETCHING...' : 'Fetch New Sector'}
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </button>
        )}
      </div>
    </>
  );
}
