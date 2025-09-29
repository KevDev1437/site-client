'use client';

import { mapSupabaseProduct } from '@/lib/product-utils';
import { createClient } from '@/lib/supabase';
import { describeSupabaseError, logSupabaseFetch } from '@/lib/supabase-error';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        logSupabaseFetch({ table: 'products' }, 'start');
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          const msg = describeSupabaseError(error);
          logSupabaseFetch({ table: 'products' }, 'error', msg);
          setError(msg);
        } else if ((data?.length ?? 0) === 0) {
          logSupabaseFetch({ table: 'products', count: 0 }, 'empty');
          setProducts([]);
        } else {
          logSupabaseFetch({ table: 'products', count: data!.length }, 'success');
          setProducts(data!.map(mapSupabaseProduct));
        }
      } catch (err: unknown) {
  const errorMessage = describeSupabaseError(err);
  logSupabaseFetch({ table: 'products' }, 'error', errorMessage);
  setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        console.log('🔄 useProduct: Début du chargement pour ID:', id);
        
        const supabase = createClient();

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        console.log('🔄 useProduct: Réponse reçue:', { data: !!data, error });

        if (error) {
          console.error('❌ useProduct: Erreur Supabase:', error);
          setError(error.message || 'Produit introuvable');
        } else {
          console.log('✅ useProduct: Produit trouvé:', data?.title);
          setProduct(data ? mapSupabaseProduct(data) : null);
        }
      } catch (err: unknown) {
        console.error('❌ useProduct: Erreur complète:', err);
        const errorMessage = err instanceof Error ? err.message : 'Produit introuvable';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
