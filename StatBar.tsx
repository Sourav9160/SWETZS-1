'use client';

import { motion } from 'framer-motion';
import { getTheme } from '@/lib/themeClasses';
import type { ThemeColor } from '@/types/pokemon';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  theme: ThemeColor;
}

export function StatBar({ label, value, max, theme }: StatBarProps) {
  const t = getTheme(theme);
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      <motion.div
        className="flex justify-between font-data-mono text-[10px] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span>{label}</span>
        <span className={t.text}>
          {value}/{max}
        </span>
      </motion.div>
      <motion.div className="h-1 w-full bg-surface-dim overflow-hidden flex gap-[2px]">
        <motion.div
          className={`h-full ${t.bgBar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div className="h-full bg-surface-container-high flex-1" />
      </motion.div>
    </motion.div>
  );
}
