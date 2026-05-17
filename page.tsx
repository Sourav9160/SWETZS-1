'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { displayStats, formatName, themeColor } from '@/lib/pokemonUtils';
import { getTheme } from '@/lib/themeClasses';
import { StatBar } from '@/components/StatBar';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import type { Pokemon } from '@/types/pokemon';

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const id = parseInt(params.id as string, 10);

  useEffect(() => {
    if (isNaN(id)) return;
    setLoading(true);
    api.pokemon
      .get(id)
      .then((res) => {
        setPokemon(res.pokemon);
        setEvolutionChain(res.evolutionChain);
      })
      .catch(() => router.push('/dex'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const toggleFavorite = async () => {
    if (!user || !pokemon) {
      router.push('/auth/login');
      return;
    }
    if (pokemon.isFavorite) await api.favorites.remove(pokemon.dexNumber);
    else await api.favorites.add(pokemon.dexNumber);
    const res = await api.pokemon.get(id);
    setPokemon(res.pokemon);
  };

  const toggleCompare = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (isInCompare(id)) await removeFromCompare(id);
    else await addToCompare(id);
  };

  if (loading) {
    return (
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen flex items-center justify-center">
        <p className="font-data-mono text-primary animate-pulse">DECRYPTING BIO-DATA...</p>
      </main>
    );
  }

  if (!pokemon) return null;

  const theme = themeColor(pokemon.theme);
  const t = getTheme(theme);
  const stats = displayStats(pokemon);
  const image = pokemon.artwork || pokemon.sprite || '';

  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen max-w-container-max mx-auto">
      <Link href="/dex" className="font-data-mono text-[10px] text-primary/60 hover:text-primary mb-8 inline-block">
        ← RETURN TO DEX
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.section
          className={`glass-panel ${t.border} rounded-xl overflow-hidden relative`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="scanline-effect" />
          <div
            className={`h-96 relative bg-gradient-to-b ${t.gradient} to-transparent flex items-center justify-center p-12`}
          >
            <Image
              src={image}
              alt={pokemon.name}
              width={320}
              height={320}
              className={`object-contain ${t.glow}`}
              unoptimized
            />
            <div className={`absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 ${t.borderStrong}`} />
            <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 ${t.borderStrong}`} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className={`font-data-mono text-[10px] ${t.textMuted} mb-2`}>
            #{String(pokemon.dexNumber).padStart(3, '0')} // CLASS: {pokemon.pokemonClass} // GEN{' '}
            {pokemon.generation}
          </p>
          <h1 className={`font-display-lg text-display-lg ${t.text} uppercase mb-4`}>
            {formatName(pokemon.name)}
          </h1>
          <div className="flex gap-2 mb-6">
            {pokemon.types.map((type) => (
              <span key={type} className={`px-3 py-1 ${t.bg} ${t.borderStrong} rounded-full font-data-mono text-[10px] ${t.text}`}>
                {type.toUpperCase()}
              </span>
            ))}
          </div>

          {pokemon.description && (
            <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">{pokemon.description}</p>
          )}

          <motion.div className="space-y-3 mb-8">
            {stats.map((s) => (
              <StatBar key={s.label} label={s.label} value={s.value} max={s.max} theme={theme} />
            ))}
          </motion.div>

          <div className="flex gap-4 mb-12">
            <button
              type="button"
              onClick={toggleFavorite}
              className={`px-6 py-3 border ${t.borderStrong} glass-panel font-ui-header text-ui-header uppercase transition-all hover:bg-primary/10`}
            >
              {pokemon.isFavorite ? 'REMOVE FAVORITE' : 'ADD FAVORITE'}
            </button>
            <button
              type="button"
              onClick={toggleCompare}
              className="px-6 py-3 border border-primary/40 glass-panel font-ui-header text-ui-header uppercase text-primary transition-all hover:bg-primary/10"
            >
              {isInCompare(id) ? 'REMOVE COMPARE' : 'ADD TO COMPARE'}
            </button>
          </div>

          {evolutionChain.length > 1 && (
            <div>
              <p className="font-data-mono text-[10px] text-primary/60 uppercase mb-4">Evolution Chain</p>
              <div className="flex flex-wrap items-center gap-4">
                {evolutionChain.map((evo, i) => (
                  <div key={evo.dexNumber} className="flex items-center gap-4">
                    <Link
                      href={`/pokemon/${evo.dexNumber}`}
                      className={`glass-panel p-3 rounded-lg border ${evo.dexNumber === pokemon.dexNumber ? t.borderStrong : 'border-primary/10'} hover:border-primary/40 transition-all`}
                    >
                      <Image
                        src={evo.sprite || evo.artwork || ''}
                        alt={evo.name}
                        width={64}
                        height={64}
                        className="object-contain"
                        unoptimized
                      />
                      <p className="font-data-mono text-[10px] text-primary mt-2 text-center">
                        {formatName(evo.name)}
                      </p>
                    </Link>
                    {i < evolutionChain.length - 1 && (
                      <span className="material-symbols-outlined text-primary/40">arrow_forward</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}
