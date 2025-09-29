'use client';

import { createClient } from '@/lib/supabase';
import { Atelier } from '@/types/atelier';
import { useEffect, useState } from 'react';

export function useAteliers() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAteliers = async () => {
      try {
        console.log('🔄 useAteliers: Début du chargement...');
        
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        console.log('🔄 useAteliers: Client Supabase créé, requête en cours...');

        const { data, error } = await supabase
          .from('workshops')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: true });

        console.log('🔄 useAteliers: Réponse reçue:', { data: data?.length, error });

        if (error) {
          console.error('❌ useAteliers: Erreur Supabase:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('⚠️ useAteliers: Aucun atelier trouvé');
          setAteliers([]);
        } else {
          console.log('✅ useAteliers: Ateliers trouvés:', data.length);
          setAteliers(data);
        }
      } catch (err: unknown) {
        console.error('❌ useAteliers: Erreur complète:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des ateliers';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAteliers();
  }, []);

  return { ateliers, loading, error };
}
