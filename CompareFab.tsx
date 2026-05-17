'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '@/context/CompareContext';

export function CompareFab() {
  const { compareList } = useCompare();

  return (
    <Link href="/compare">
      <motion.button
        className="fixed bottom-24 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(168,232,255,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="material-symbols-outlined">compare_arrows</span>
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-on-secondary rounded-full font-data-mono text-[10px] flex items-center justify-center"
            >
              {compareList.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </Link>
  );
}
