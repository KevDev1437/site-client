'use client';

import { mapSupabaseProduct } from '@/lib/product-utils';
import { createClient } from '@/lib/supabase';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProducts((data || []).map(mapSupabaseProduct));
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des produits:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
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
      try {
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setProduct(data ? mapSupabaseProduct(data) : null);
      } catch (err: unknown) {
        console.error('Erreur lors du chargement du produit:', err);
        const errorMessage = err instanceof Error ? err.message : 'Produit introuvable';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}
