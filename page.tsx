'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dex');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop min-h-screen flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        className="glass-panel border border-primary/20 rounded-xl p-8 w-full max-w-md relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="scanline-effect" />
        <p className="font-data-mono text-[10px] text-primary/60 uppercase mb-2">ACCESS_PROTOCOL</p>
        <h2 className="font-display-lg text-headline-lg text-primary uppercase mb-8">Neural Login</h2>

        {error && <p className="font-data-mono text-[10px] text-secondary mb-4">{error}</p>}

        <div className="space-y-6 mb-8">
          <motion.div>
            <label className="font-data-mono text-[10px] text-primary/60 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-primary/30 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
            />
          </motion.div>
          <div>
            <label className="font-data-mono text-[10px] text-primary/60 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-primary/30 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-ui-header uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION'}
        </button>

        <p className="font-data-mono text-[10px] text-outline mt-6 text-center">
          NO CREDENTIALS?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            REGISTER
          </Link>
        </p>
      </motion.form>
    </main>
  );
}
