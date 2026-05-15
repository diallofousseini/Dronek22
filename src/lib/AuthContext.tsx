'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, ADMIN_EMAIL } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for mock auth first (as a fallback)
    if (typeof window !== 'undefined' && localStorage.getItem('dronek_mock_auth') === 'true') {
      setUser({ email: ADMIN_EMAIL, id: 'mock-admin' } as any);
      setLoading(false);
    }

    // 2. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Optionnel : restreindre l'accès à l'admin email
        if (session.user.email === ADMIN_EMAIL) {
          setUser(session.user);
        } else {
          // Log out if not admin? Depending on requirements. 
          // For now, let's just set the user.
          setUser(session.user);
        }
      }
      setLoading(false);
    });

    // 3. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        // If sign out event or no session, check mock auth
        if (localStorage.getItem('dronek_mock_auth') === 'true') {
          setUser({ email: ADMIN_EMAIL, id: 'mock-admin' } as any);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
