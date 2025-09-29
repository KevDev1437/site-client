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
        console.log('🔄 useProducts: Début du chargement...');
        
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        console.log('🔄 useProducts: Client Supabase créé, requête en cours...');

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('🔄 useProducts: Réponse reçue:', { data: data?.length, error });

        if (error) {
          console.error('❌ useProducts: Erreur Supabase:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('⚠️ useProducts: Aucun produit trouvé');
          setProducts([]);
        } else {
          console.log('✅ useProducts: Produits trouvés:', data.length);
          const mappedProducts = (data || []).map(mapSupabaseProduct);
          setProducts(mappedProducts);
        }
      } catch (err: unknown) {
        console.error('❌ useProducts: Erreur complète:', err);
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
        console.log('🔄 useProduct: Début du chargement pour ID:', id);
        
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase client non initialisé');
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        console.log('🔄 useProduct: Réponse reçue:', { data: !!data, error });

        if (error) {
          console.error('❌ useProduct: Erreur Supabase:', error);
          throw error;
        }

        if (data) {
          console.log('✅ useProduct: Produit trouvé:', data.title);
          setProduct(mapSupabaseProduct(data));
        } else {
          console.warn('⚠️ useProduct: Produit non trouvé');
          setProduct(null);
        }
      } catch (err: unknown) {
        console.error('❌ useProduct: Erreur complète:', err);
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
