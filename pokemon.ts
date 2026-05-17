export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  _id?: string;
  dexNumber: number;
  name: string;
  slug: string;
  types: string[];
  generation: number;
  region: string;
  stats: PokemonStats;
  sprite?: string;
  artwork?: string;
  height?: number;
  weight?: number;
  description?: string;
  isLegendary: boolean;
  isMythical: boolean;
  pokemonClass: string;
  evolutionChainId?: number;
  evolvesFrom?: number | null;
  evolvesTo?: number[];
  abilities?: string[];
  theme?: string;
  isFavorite?: boolean;
  maxStat?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PokemonListResponse {
  data: Pokemon[];
  pagination: Pagination;
}

export interface PokemonDetailResponse {
  pokemon: Pokemon;
  evolutionChain: Pokemon[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  favorites: number[];
  compareList: number[];
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FilterMeta {
  types: string[];
  regions: string[];
  generations: number[];
  classes: string[];
}

export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'on-tertiary-fixed-variant'
  | 'outline';
