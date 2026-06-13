import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { exploreSupabaseAdminEmail, isSupabaseConfigured, supabase } from '../lib/supabase';

export interface User {
  uid: string;
  email?: string | null;
}

interface AuthContextType {
  isAdmin: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  passwordRecovery: boolean;
  login: (adminCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null; session: Session | null }>;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string, redirectTo?: string) => Promise<{ error: string | null; session: Session | null }>;
  sendPasswordResetEmail: (email: string, redirectTo?: string) => Promise<{ error: string | null }>;
  completePasswordReset: (password: string) => Promise<{ error: string | null; session: Session | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_GATE_KEY = 'todayler_is_admin';

function mapSupabaseUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  return {
    uid: user.id,
    email: user.email ?? null,
  };
}

function isConfiguredAdminSession(email?: string | null) {
  return Boolean(exploreSupabaseAdminEmail) && (email ?? '').trim().toLowerCase() === exploreSupabaseAdminEmail;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem(ADMIN_GATE_KEY) === 'true');
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('mode') === 'recover';
  });

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        setSession(null);
        setUser(null);
        setIsAdmin(localStorage.getItem(ADMIN_GATE_KEY) === 'true');
      } else {
        setSession(data.session ?? null);
        setUser(mapSupabaseUser(data.session?.user ?? null));
        setIsAdmin(
          localStorage.getItem(ADMIN_GATE_KEY) === 'true' &&
            isConfiguredAdminSession(data.session?.user?.email),
        );
      }
      setLoading(false);
    };

    void bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(mapSupabaseUser(nextSession?.user ?? null));
      setIsAdmin(
        localStorage.getItem(ADMIN_GATE_KEY) === 'true' &&
          isConfiguredAdminSession(nextSession?.user?.email),
      );
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setPasswordRecovery(false);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = async (adminCode?: string) => {
    const isPromoCode = adminCode === '8loop';
    setIsAdmin(isPromoCode);
    if (isPromoCode) {
      localStorage.setItem(ADMIN_GATE_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_GATE_KEY);
    }
    return true;
  };

  const logout = async () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_GATE_KEY);
    setPasswordRecovery(false);
    if (supabase) {
      await supabase.auth.signOut({ scope: 'local' });
    }
    setSession(null);
    setUser(null);
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase is not configured.', session: null };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { error: 'Email is required.', session: null };
    }

    if (!password) {
      return { error: 'Password is required.', session: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    return { error: error?.message ?? null, session: data.session ?? null };
  };

  const sendMagicLink = async (email: string, redirectTo?: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { error: 'Email is required.' };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    return { error: error?.message ?? null };
  };

  const signUpWithPassword = async (email: string, password: string, redirectTo?: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase is not configured.', session: null };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { error: 'Email is required.', session: null };
    }

    if (!password) {
      return { error: 'Password is required.', session: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    return { error: error?.message ?? null, session: data.session ?? null };
  };

  const sendPasswordResetEmail = async (email: string, redirectTo?: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { error: 'Email is required.' };
    }

    const resolvedRedirectTo = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/explore/signup?mode=recover` : undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: resolvedRedirectTo,
    });

    return { error: error?.message ?? null };
  };

  const completePasswordReset = async (password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase is not configured.', session: null };
    }

    if (!password) {
      return { error: 'Password is required.', session: null };
    }

    const { data, error } = await supabase.auth.updateUser({ password });
    if (!error) {
      setPasswordRecovery(false);
    }
    return { error: error?.message ?? null, session: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        session,
        loading,
        passwordRecovery,
        login,
        logout,
        signInWithPassword,
        sendMagicLink,
        signUpWithPassword,
        sendPasswordResetEmail,
        completePasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
