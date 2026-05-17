'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Pokemon } from '@/types/pokemon';
import { displayStats, formatName, themeColor } from '@/lib/pokemonUtils';
import { getTheme } from '@/lib/themeClasses';
import { StatBar } from './StatBar';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface PokemonCardProps {
  pokemon: Pokemon;
  onFavoriteToggle?: () => void;
}

export function PokemonCard({ pokemon, onFavoriteToggle }: PokemonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = themeColor(pokemon.theme);
  const t = getTheme(theme);
  const { user } = useAuth();
  const isLegendary = pokemon.isLegendary || pokemon.pokemonClass === 'LEGENDARY';

  const handleTilt = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xRotation = -5 * ((y - rect.height / 2) / rect.height);
    const yRotation = 5 * ((x - rect.width / 2) / rect.width);
    card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
  };

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    if (pokemon.isFavorite) await api.favorites.remove(pokemon.dexNumber);
    else await api.favorites.add(pokemon.dexNumber);
    onFavoriteToggle?.();
  };

  const stats = displayStats(pokemon);
  const image = pokemon.artwork || pokemon.sprite || '/placeholder.png';

  return (
    <Link href={`/pokemon/${pokemon.dexNumber}`}>
      <motion.div
        ref={cardRef}
        className={`card-tilt group relative glass-panel bg-surface-container-low/20 ${t.border} rounded-xl overflow-hidden cursor-pointer ${isLegendary ? 'legendary-glow' : ''}`}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute top-0 right-0 p-3 z-10">
          <button
            type="button"
            onClick={toggleFavorite}
            className={`material-symbols-outlined cursor-pointer hover:scale-110 transition-transform ${pokemon.isFavorite ? `${t.text}` : `${t.text}/40`}`}
            style={{ fontVariationSettings: pokemon.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </button>
        </motion.div>
        <div
          className={`h-64 relative bg-gradient-to-b ${t.gradient} to-transparent flex items-center justify-center p-8 overflow-hidden`}
        >
          {isLegendary && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <motion.div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tertiary/20 via-transparent to-transparent" />
            </div>
          )}
          <Image
            src={image}
            alt={pokemon.name}
            width={200}
            height={200}
            className={`h-full w-auto object-contain ${t.glow} group-hover:scale-110 transition-transform duration-500`}
            unoptimized
          />
          <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 ${t.borderStrong}`} />
          {isLegendary && (
            <motion.div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 ${t.borderStrong}`} />
          )}
        </div>
        <div className="p-6 bg-surface-container-low/40">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`font-data-mono text-[10px] ${t.textMuted}`}>
                #{String(pokemon.dexNumber).padStart(3, '0')} // CLASS: {pokemon.pokemonClass}
              </p>
              <h3 className={`font-headline-lg text-headline-lg ${t.text} uppercase`}>
                {formatName(pokemon.name)}
              </h3>
            </div>
            <div className={`px-3 py-1 ${t.bg} ${t.borderStrong} rounded-full`}>
              <p className={`font-data-mono text-[10px] ${t.text}`}>
                {pokemon.types[0]?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.map((s) => (
              <StatBar key={s.label} label={s.label} value={s.value} max={s.max} theme={theme} />
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
