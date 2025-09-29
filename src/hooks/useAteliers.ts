'use client';

import { createClient } from '@/lib/supabase';
import { describeSupabaseError, logSupabaseFetch } from '@/lib/supabase-error';
import { Atelier } from '@/types/atelier';
import { useEffect, useState } from 'react';

export function useAteliers() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAteliers = async () => {
      try {
  logSupabaseFetch({ table: 'workshops', filters: { published: true } }, 'start');
        const supabase = createClient();

        const { data, error } = await supabase
          .from('workshops')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: true });

        if (error) {
          const msg = describeSupabaseError(error);
          logSupabaseFetch({ table: 'workshops' }, 'error', msg);
          setError(msg);
        } else if ((data?.length ?? 0) === 0) {
          logSupabaseFetch({ table: 'workshops', count: 0 }, 'empty');
          setAteliers([]);
        } else {
          logSupabaseFetch({ table: 'workshops', count: data!.length }, 'success');
          setAteliers(data!);
        }
      } catch (err: unknown) {
  const errorMessage = describeSupabaseError(err);
  logSupabaseFetch({ table: 'workshops' }, 'error', errorMessage);
  setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAteliers();
  }, []);

  return { ateliers, loading, error };
}
