'use client';

import { safeSupabaseQuery, supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');
  const [details, setDetails] = useState<{
    products: { count: number; error?: string };
    workshops: { count: number; error?: string };
    testimonials: { count: number; error?: string };
  } | null>(null);

  useEffect(() => {
    const test = async () => {
      try {
        console.log('🔍 Test Supabase - Début');
        
        // Vérifier les variables d'environnement
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log('🔑 Variables d\'environnement:');
        console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
        console.log('- SUPABASE_KEY:', supabaseKey ? '✅ Définie' : '❌ Manquante');
        
        if (!supabaseUrl || !supabaseKey) {
          setStatus('❌ Variables d\'environnement manquantes');
          return;
        }

        console.log('🔗 Client Supabase créé');

        // Test produits
        console.log('🔄 Test produits...');
        const { data: products, error: productsError } = await safeSupabaseQuery(() =>
          supabase
            .from('products')
            .select('*')
            .limit(1)
        );
        
        console.log('📦 Produits:', { count: products?.length, error: productsError });

        // Test ateliers
        console.log('🔄 Test ateliers...');
        const { data: workshops, error: workshopsError } = await safeSupabaseQuery(() =>
          supabase
            .from('workshops')
            .select('*')
            .eq('published', true)
            .limit(1)
        );
        
        console.log('🎨 Ateliers:', { count: workshops?.length, error: workshopsError });

        // Test témoignages
        console.log('🔄 Test témoignages...');
        const { data: testimonials, error: testimonialsError } = await safeSupabaseQuery(() =>
          supabase
            .from('testimonials')
            .select('*')
            .limit(1)
        );
        
        console.log('💬 Témoignages:', { count: testimonials?.length, error: testimonialsError });

        // Résumé
        const summary = {
          products: { count: products?.length || 0, error: productsError?.message },
          workshops: { count: workshops?.length || 0, error: workshopsError?.message },
          testimonials: { count: testimonials?.length || 0, error: testimonialsError?.message }
        };

        setDetails(summary);
        
        if (productsError || workshopsError || testimonialsError) {
          setStatus('❌ Erreurs détectées - Voir les détails');
        } else {
          setStatus('✅ Connexion Supabase réussie');
        }

      } catch (err) {
        console.error('❌ Erreur complète:', err);
        setStatus(`❌ Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    };
    
    test();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">🔍 Test Supabase</h3>
      <p className="mb-2"><strong>Status:</strong> {status}</p>
      
      {details && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Détails:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Produits:</strong> {details.products.count} 
              {details.products.error && <span className="text-red-500"> - Erreur: {details.products.error}</span>}
            </div>
            <div>
              <strong>Ateliers:</strong> {details.workshops.count} 
              {details.workshops.error && <span className="text-red-500"> - Erreur: {details.workshops.error}</span>}
            </div>
            <div>
              <strong>Témoignages:</strong> {details.testimonials.count} 
              {details.testimonials.error && <span className="text-red-500"> - Erreur: {details.testimonials.error}</span>}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600">
        <p>Ouvrez la console du navigateur pour voir les logs détaillés.</p>
      </div>
    </div>
  );
}
