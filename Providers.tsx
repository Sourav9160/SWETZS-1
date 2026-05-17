'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CompareProvider } from '@/context/CompareContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompareProvider>{children}</CompareProvider>
    </AuthProvider>
  );
}
