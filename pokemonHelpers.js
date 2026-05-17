const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382,
  383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492,
  493,
]);

const MYTHICAL_IDS = new Set([151, 251, 385, 386, 489, 490, 491, 492, 493]);

export function getGeneration(dexNumber) {
  if (dexNumber <= 151) return 1;
  if (dexNumber <= 251) return 2;
  if (dexNumber <= 386) return 3;
  return 4;
}

export function getRegion(dexNumber) {
  if (dexNumber <= 151) return 'kanto';
  if (dexNumber <= 251) return 'johto';
  if (dexNumber <= 386) return 'hoenn';
  return 'sinnoh';
}

export function getPokemonClass(dexNumber, isLegendary, isMythical) {
  if (isMythical) return 'MYTHICAL';
  if (isLegendary) return 'LEGENDARY';
  if ([94, 93, 92, 169, 42, 41].includes(dexNumber)) return 'SPECTRAL';
  if (dexNumber % 50 === 0 || [6, 9, 3, 65, 68, 76, 130, 131, 143].includes(dexNumber))
    return 'ELITE';
  return 'STANDARD';
}

export function classifyPokemon(dexNumber) {
  const isLegendary = LEGENDARY_IDS.has(dexNumber);
  const isMythical = MYTHICAL_IDS.has(dexNumber);
  return {
    isLegendary,
    isMythical,
    pokemonClass: getPokemonClass(dexNumber, isLegendary, isMythical),
    generation: getGeneration(dexNumber),
    region: getRegion(dexNumber),
  };
}

export const TYPE_THEME = {
  fire: 'secondary',
  water: 'primary',
  grass: 'primary',
  electric: 'primary',
  psychic: 'tertiary',
  ghost: 'on-tertiary-fixed-variant',
  poison: 'on-tertiary-fixed-variant',
  dragon: 'tertiary',
  dark: 'on-tertiary-fixed-variant',
  steel: 'outline',
  fairy: 'tertiary',
  fighting: 'secondary',
  normal: 'outline',
  flying: 'primary',
  ground: 'secondary',
  rock: 'outline',
  bug: 'primary',
  ice: 'primary',
  default: 'primary',
};

export function getTypeTheme(type) {
  return TYPE_THEME[type?.toLowerCase()] || TYPE_THEME.default;
}

export const MAX_STAT = 255;
