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
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        const { data, error } = await supabase
          .from('workshops')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }

        setAteliers(data || []);
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des ateliers:', err);
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
