'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user || null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          console.log('✅ Utilisateur déconnecté');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
