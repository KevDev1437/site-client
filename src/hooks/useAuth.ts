'use client';

import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
          setUser(null);
        } else {
          setUser(data?.session?.user ?? null);
        }
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
        
        switch (event) {
          case 'SIGNED_IN':
            setUser(session?.user ?? null);
            setLoading(false);
            break;
          case 'SIGNED_OUT':
            console.log('✅ Utilisateur déconnecté');
            setUser(null);
            setLoading(false);
            break;
          case 'TOKEN_REFRESHED':
            console.log('🔄 Token rafraîchi avec succès');
            setUser(session?.user ?? null);
            setLoading(false);
            break;
          case 'PASSWORD_RECOVERY':
            console.log('🔄 Récupération de mot de passe');
            break;
          default:
            setUser(session?.user ?? null);
            setLoading(false);
        }
      }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}