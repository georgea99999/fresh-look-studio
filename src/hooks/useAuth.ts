import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

const SHARED_EMAIL = 'oktodeck@yachtcount.app';
const SHARED_PASSWORD = 'Okto26';
const SHARED_USERNAME = 'Oktodeck';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string, keepLoggedIn: boolean) => {
    if (username !== SHARED_USERNAME || password !== SHARED_PASSWORD) {
      return { error: 'Invalid username or password' };
    }

    if (!keepLoggedIn) {
      // Clear any persisted session on tab close by not persisting
      // We'll handle this by signing out on window unload
      window.addEventListener('beforeunload', () => {
        supabase.auth.signOut();
      }, { once: true });
    }

    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: SHARED_EMAIL,
      password: SHARED_PASSWORD,
    });

    if (signInError) {
      // If user doesn't exist, sign up
      if (signInError.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: SHARED_EMAIL,
          password: SHARED_PASSWORD,
        });
        if (signUpError) return { error: signUpError.message };

        // Sign in after signup
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: SHARED_EMAIL,
          password: SHARED_PASSWORD,
        });
        if (retryError) return { error: retryError.message };
      } else {
        return { error: signInError.message };
      }
    }

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, login, logout };
}
