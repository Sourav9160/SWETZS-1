import type { ThemeColor } from '@/types/pokemon';

export const THEME = {
  primary: {
    text: 'text-primary',
    textMuted: 'text-primary/60',
    border: 'border-primary/30',
    borderStrong: 'border-primary/40',
    bg: 'bg-primary/10',
    bgBar: 'bg-primary',
    bgBarMuted: 'bg-primary/60',
    glow: 'drop-shadow-[0_0_20px_rgba(168,232,255,0.4)]',
    gradient: 'from-primary/10',
  },
  secondary: {
    text: 'text-secondary',
    textMuted: 'text-secondary/60',
    border: 'border-secondary/30',
    borderStrong: 'border-secondary/40',
    bg: 'bg-secondary/10',
    bgBar: 'bg-secondary',
    bgBarMuted: 'bg-secondary/60',
    glow: 'drop-shadow-[0_0_20px_rgba(255,82,92,0.4)]',
    gradient: 'from-secondary/10',
  },
  tertiary: {
    text: 'text-tertiary',
    textMuted: 'text-tertiary/60',
    border: 'border-tertiary/30',
    borderStrong: 'border-tertiary/40',
    bg: 'bg-tertiary/10',
    bgBar: 'bg-tertiary',
    bgBarMuted: 'bg-tertiary/60',
    glow: 'drop-shadow-[0_0_20px_rgba(239,214,255,0.6)]',
    gradient: 'from-tertiary/10',
  },
  'on-tertiary-fixed-variant': {
    text: 'text-on-tertiary-fixed-variant',
    textMuted: 'text-on-tertiary-fixed-variant/60',
    border: 'border-on-tertiary-fixed-variant/30',
    borderStrong: 'border-on-tertiary-fixed-variant/40',
    bg: 'bg-on-tertiary-fixed-variant/10',
    bgBar: 'bg-on-tertiary-fixed-variant',
    bgBarMuted: 'bg-on-tertiary-fixed-variant/60',
    glow: 'drop-shadow-[0_0_20px_rgba(107,0,176,0.4)]',
    gradient: 'from-on-tertiary-fixed-variant/10',
  },
  outline: {
    text: 'text-outline',
    textMuted: 'text-outline/60',
    border: 'border-outline/30',
    borderStrong: 'border-outline/40',
    bg: 'bg-outline/10',
    bgBar: 'bg-outline',
    bgBarMuted: 'bg-outline/60',
    glow: 'drop-shadow-[0_0_20px_rgba(133,147,152,0.4)]',
    gradient: 'from-outline/10',
  },
} as const;

export function getTheme(theme?: string) {
  const key = (theme || 'primary') as keyof typeof THEME;
  return THEME[key] || THEME.primary;
}
