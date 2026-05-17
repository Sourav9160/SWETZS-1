'use client';

import { motion } from 'framer-motion';
import { genLabel, regionLabel, typeFilterLabel } from '@/lib/pokemonUtils';
import type { FilterMeta } from '@/types/pokemon';

export interface Filters {
  q: string;
  type: string;
  generation: number | null;
  region: string;
}

interface FilterBarProps {
  filters: Filters;
  meta: FilterMeta | null;
  onChange: (filters: Filters) => void;
  onRegionCycle: () => void;
}

export function FilterBar({ filters, meta, onChange, onRegionCycle }: FilterBarProps) {
  const generations = meta?.generations || [1, 2, 3, 4];
  const types = ['all', ...(meta?.types || ['fire', 'water', 'electric', 'psychic'])];

  return (
    <section className="mb-12 glass-panel bg-surface-container-lowest/40 border border-primary/10 rounded-xl p-6 relative overflow-hidden">
      <motion.div className="scanline-effect" />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col gap-2">
          <label className="font-data-mono text-[10px] text-primary/60 uppercase">Manual Query</label>
          <motion.div className="relative">
            <input
              className="w-full bg-transparent border-b border-primary/30 py-2 font-data-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-primary transition-all"
              placeholder="ENTER POKÉMON ID..."
              type="text"
              value={filters.q}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
            />
            <span className="material-symbols-outlined absolute right-0 bottom-2 text-primary/40 text-sm">
              data_exploration
            </span>
          </motion.div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-data-mono text-[10px] text-primary/60 uppercase">Type Class</label>
          <select
            className="bg-surface-container-high/50 border border-primary/20 rounded-lg p-2 font-ui-header text-primary appearance-none focus:outline-none focus:border-primary/60"
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {typeFilterLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-data-mono text-[10px] text-primary/60 uppercase">Evolutionary Era</label>
          <div className="flex gap-2">
            {generations.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    generation: filters.generation === g ? null : g,
                  })
                }
                className={`flex-1 py-2 font-ui-header text-[12px] transition-all ${
                  filters.generation === g
                    ? 'bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20'
                    : 'border border-primary/10 text-outline hover:text-primary'
                }`}
              >
                {genLabel(g)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-data-mono text-[10px] text-primary/60 uppercase">Geographic Sector</label>
          <div className="flex items-center gap-4 py-2 text-primary">
            <span className="material-symbols-outlined cursor-pointer hover:text-secondary">map</span>
            <span className="font-ui-header text-ui-header">
              {filters.region === 'all' ? 'ALL_REGIONS' : regionLabel(filters.region)}
            </span>
            <button
              type="button"
              onClick={onRegionCycle}
              className="material-symbols-outlined cursor-pointer hover:text-secondary ml-auto"
            >
              chevron_right
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
