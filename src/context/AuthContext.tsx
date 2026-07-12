'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut } from '../lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const logout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || null,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, isLoading: isPending, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};