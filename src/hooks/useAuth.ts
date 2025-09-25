'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier que supabase est initialisé
    if (!supabase) {
      console.error('❌ Supabase client non initialisé');
      setLoading(false);
      return;
    }

    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération de la session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user || null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          console.log('✅ Utilisateur déconnecté');
        }
      }
    ) || { subscription: { unsubscribe: () => {} } };

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
}
