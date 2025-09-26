'use client';

import { cleanupInvalidSessions } from '@/lib/auth-cleanup';
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

        // ✅ Nettoyer les sessions invalides avant de récupérer la session
        await cleanupInvalidSessions();

        // ✅ On récupère la session de manière sécurisée
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
          
          // ✅ Gestion spécifique des erreurs de token
          if (error.message.includes('Invalid Refresh Token') || 
              error.message.includes('Refresh Token Not Found') ||
              error.message.includes('JWT expired')) {
            console.log('🔄 Token invalide, déconnexion automatique');
            await supabase.auth.signOut();
          }
          
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
        
        try {
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
        } catch (error) {
          console.error('❌ Erreur dans le listener auth:', error);
          setUser(null);
          setLoading(false);
        }
      }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}