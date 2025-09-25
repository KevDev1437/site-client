'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        if (!supabase) {
          console.error('❌ Supabase client non initialisé');
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ On récupère la session de manière sécurisée
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user ?? null);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération de la session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // ✅ On sécurise l'écouteur d'événements
    const { data: authListener } =
      supabase?.auth.onAuthStateChange?.((event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          console.log('✅ Utilisateur déconnecté');
        }
      }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}
