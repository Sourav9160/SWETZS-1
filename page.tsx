'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { formatName, themeColor } from '@/lib/pokemonUtils';
import { getTheme } from '@/lib/themeClasses';
import { StatBar } from '@/components/StatBar';

export default function ComparePage() {
  const { user } = useAuth();
  const { compareList, loading, clearCompare, removeFromCompare } = useCompare();

  if (!user) {
    return (
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen max-w-container-max mx-auto text-center">
        <p className="font-data-mono text-primary/60 mb-4">AUTHENTICATION REQUIRED</p>
        <Link href="/auth/login" className="font-ui-header text-primary border border-primary/40 px-6 py-3">
          LOGIN TO COMPARE
        </Link>
      </main>
    );
  }

  const statKeys = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'] as const;
  const statLabels: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    specialAttack: 'SP_ATK',
    specialDefense: 'SP_DEF',
    speed: 'SPD',
  };

  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen max-w-container-max mx-auto">
      <header className="mb-12">
        <p className="font-data-mono text-data-mono text-primary/60 mb-2">BATTLE_MODE // COMPARISON_MATRIX</p>
        <div className="flex justify-between items-end">
          <h2 className="font-display-lg text-display-lg text-primary uppercase">Tactical Compare</h2>
          {compareList.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="font-ui-header text-[10px] text-secondary border border-secondary/30 px-4 py-2 hover:bg-secondary/10"
            >
              CLEAR ALL
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <p className="font-data-mono text-primary animate-pulse">LOADING COMPARISON DATA...</p>
      ) : compareList.length === 0 ? (
        <motion.div className="glass-panel border border-primary/10 rounded-xl p-12 text-center">
          <p className="font-data-mono text-outline mb-4">NO POKÉMON IN COMPARE LIST</p>
          <Link href="/dex" className="font-ui-header text-primary border border-primary/40 px-6 py-3 inline-block">
            BROWSE DEX
          </Link>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="font-data-mono text-[10px] text-primary/60 text-left p-4">STAT</th>
                {compareList.map((p) => {
                  const theme = themeColor(p.theme);
                  const t = getTheme(theme);
                  return (
                    <th key={p.dexNumber} className="p-4 text-center">
                      <Link href={`/pokemon/${p.dexNumber}`}>
                        <Image
                          src={p.sprite || p.artwork || ''}
                          alt={p.name}
                          width={80}
                          height={80}
                          className="mx-auto object-contain"
                          unoptimized
                        />
                        <p className={`font-headline-lg text-headline-lg-mobile ${t.text} uppercase mt-2`}>
                          {formatName(p.name)}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(p.dexNumber)}
                        className="font-data-mono text-[10px] text-secondary mt-2 hover:underline"
                      >
                        REMOVE
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {statKeys.map((key) => (
                <tr key={key} className="border-t border-primary/10">
                  <td className="font-data-mono text-[10px] text-primary/60 p-4">{statLabels[key]}</td>
                  {compareList.map((p) => {
                    const theme = themeColor(p.theme);
                    const max = p.maxStat || 255;
                    return (
                      <td key={p.dexNumber} className="p-4">
                        <StatBar
                          label=""
                          value={p.stats[key]}
                          max={max}
                          theme={theme}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </main>
  );
}
