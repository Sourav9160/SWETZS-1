'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';

const NAV_LINKS = [
  { href: '/', label: 'CORE', icon: 'database' },
  { href: '/dex', label: 'DEX', icon: 'grid_view' },
  { href: '/compare', label: 'BATTLE', icon: 'swords' },
  { href: '/favorites', label: 'INTEL', icon: 'analytics' },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { compareList } = useCompare();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-background/40 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform">
            menu
          </span>
          <Link href="/">
            <h1 className="font-display-lg text-headline-lg tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(168,232,255,0.8)] uppercase">
              SWETZS
            </h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 font-ui-header text-ui-header uppercase tracking-widest">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? 'text-primary border-b-2 border-primary shadow-[0_2px_10px_rgba(168,232,255,0.5)] transition-all'
                  : 'text-outline hover:text-primary/70 transition-colors'
              }
            >
              {link.label}
              {link.href === '/compare' && compareList.length > 0 && (
                <span className="ml-1 text-secondary">[{compareList.length}]</span>
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dex"
            className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform"
          >
            search
          </Link>
          {user ? (
            <motion.div className="relative group">
              <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-surface-container overflow-hidden cursor-pointer">
                <span className="font-ui-header text-primary text-xs">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="absolute right-0 top-12 hidden group-hover:block glass-panel bg-surface-container-low border border-primary/20 rounded-lg p-2 min-w-[120px] z-50">
                <p className="font-data-mono text-[10px] text-primary px-2 py-1">{user.username}</p>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-left font-ui-header text-[10px] text-secondary px-2 py-1 hover:bg-primary/10"
                >
                  LOGOUT
                </button>
              </div>
            </motion.div>
          ) : (
            <Link
              href="/auth/login"
              className="font-ui-header text-[10px] text-primary border border-primary/30 px-3 py-1 hover:bg-primary/10 transition-all"
            >
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-2 px-4 bg-surface-container-lowest/60 backdrop-blur-2xl border-t border-primary/30 shadow-[0_-4px_20px_rgba(0,212,255,0.15)] rounded-t-xl">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center transition-all active:translate-y-1 duration-200 ${
              isActive(link.href)
                ? 'text-primary drop-shadow-[0_0_5px_#a8e8ff]'
                : 'text-outline/50 hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="font-ui-header text-[10px] mt-1">{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
