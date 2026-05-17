import type { Pokemon, ThemeColor } from '@/types/pokemon';

const REGION_LABELS: Record<string, string> = {
  kanto: 'KANTO_REGION',
  johto: 'JOHTO_REGION',
  hoenn: 'HOENN_REGION',
  sinnoh: 'SINNOH_REGION',
};

const TYPE_LABELS: Record<string, string> = {
  fire: 'FIRE_CORE',
  water: 'WATER_STREAM',
  electric: 'ELECTRIC_PULSE',
  psychic: 'PSYCHIC_LINK',
  grass: 'GRASS_MATRIX',
  ghost: 'GHOST_SPECTRUM',
  dragon: 'DRAGON_CORE',
  normal: 'ALL_TYPES',
};

export function regionLabel(region: string) {
  return REGION_LABELS[region] || region.toUpperCase();
}

export function typeFilterLabel(type: string) {
  if (type === 'all') return 'ALL_TYPES';
  return TYPE_LABELS[type] || type.toUpperCase();
}

export function themeColor(theme?: string): ThemeColor {
  const valid: ThemeColor[] = ['primary', 'secondary', 'tertiary', 'on-tertiary-fixed-variant', 'outline'];
  return valid.includes(theme as ThemeColor) ? (theme as ThemeColor) : 'primary';
}

export function displayStats(pokemon: Pokemon) {
  const s = pokemon.stats;
  const max = pokemon.maxStat || 255;
  return [
    { label: 'Attack_Pwr', value: s.attack, max },
    { label: 'Defense_Val', value: s.defense, max },
    { label: 'Speed_Ref', value: s.speed, max },
    { label: 'Sp_Attack', value: s.specialAttack, max },
    { label: 'HP_Reserves', value: s.hp, max },
  ].slice(0, 3);
}

export function formatName(name: string) {
  return name.replace(/-/g, ' ').toUpperCase();
}

export function genLabel(gen: number) {
  const roman = ['', 'I', 'II', 'III', 'IV'];
  return `GEN_${roman[gen] || gen}`;
}

export function databaseLabel(region: string) {
  const map: Record<string, string> = {
    kanto: 'Kanto_v1.02',
    johto: 'Johto_v2.01',
    hoenn: 'Hoenn_v3.00',
    sinnoh: 'Sinnoh_v4.00',
    all: 'Multi_Region_v4',
  };
  return map[region] || 'Neural_DB_v4';
}
