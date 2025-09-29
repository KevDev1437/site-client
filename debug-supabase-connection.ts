/**
 * Script de Diagnostic - Connexion Supabase
 * 
 * Ce script aide à diagnostiquer les problèmes de connexion Supabase
 * et à vérifier que les données sont bien insérées.
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 DIAGNOSTIC SUPABASE');
console.log('====================');

// 1. Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement :');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.log('Vérifiez votre fichier .env.local :');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

// 2. Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Tester la connexion
async function testConnection() {
  console.log('\n🔗 Test de connexion...');
  
  try {
    // Test simple de connexion
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion:', err);
    return false;
  }
}

// 4. Vérifier les données
async function checkData() {
  console.log('\n📊 Vérification des données...');
  
  try {
    // Vérifier les produits
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, stock, is_active')
      .eq('is_active', true);
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
    } else {
      console.log(`✅ Produits trouvés: ${products?.length || 0}`);
      if (products && products.length > 0) {
        console.log('   - Premier produit:', products[0].title);
      }
    }
    
    // Vérifier les ateliers
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('id, title, date, published')
      .eq('published', true);
    
    if (workshopsError) {
      console.error('❌ Erreur ateliers:', workshopsError);
    } else {
      console.log(`✅ Ateliers trouvés: ${workshops?.length || 0}`);
      if (workshops && workshops.length > 0) {
        console.log('   - Premier atelier:', workshops[0].title);
        console.log('   - Date:', workshops[0].date);
      }
    }
    
    // Vérifier les témoignages
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('id, name, rating');
    
    if (testimonialsError) {
      console.error('❌ Erreur témoignages:', testimonialsError);
    } else {
      console.log(`✅ Témoignages trouvés: ${testimonials?.length || 0}`);
    }
    
  } catch (err) {
    console.error('❌ Erreur lors de la vérification:', err);
  }
}

// 5. Tester les requêtes spécifiques des hooks
async function testHooks() {
  console.log('\n🎣 Test des hooks...');
  
  try {
    // Test useProducts()
    console.log('Test useProducts()...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsError) {
      console.error('❌ useProducts() erreur:', productsError);
    } else {
      console.log(`✅ useProducts() OK: ${productsData?.length || 0} produits`);
    }
    
    // Test useAteliers()
    console.log('Test useAteliers()...');
    const { data: workshopsData, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: true });
    
    if (workshopsError) {
      console.error('❌ useAteliers() erreur:', workshopsError);
    } else {
      console.log(`✅ useAteliers() OK: ${workshopsData?.length || 0} ateliers`);
    }
    
  } catch (err) {
    console.error('❌ Erreur lors du test des hooks:', err);
  }
}

// 6. Vérifier les politiques RLS
async function checkRLS() {
  console.log('\n🔒 Vérification RLS...');
  
  try {
    // Test avec un utilisateur anonyme
    const { data: publicProducts, error: publicError } = await supabase
      .from('products')
      .select('id, title')
      .limit(1);
    
    if (publicError) {
      console.error('❌ RLS bloque l\'accès aux produits:', publicError);
    } else {
      console.log('✅ RLS OK pour les produits');
    }
    
    const { data: publicWorkshops, error: workshopsPublicError } = await supabase
      .from('workshops')
      .select('id, title')
      .limit(1);
    
    if (workshopsPublicError) {
      console.error('❌ RLS bloque l\'accès aux ateliers:', workshopsPublicError);
    } else {
      console.log('✅ RLS OK pour les ateliers');
    }
    
  } catch (err) {
    console.error('❌ Erreur lors de la vérification RLS:', err);
  }
}

// Exécuter tous les tests
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic...\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Diagnostic arrêté - Connexion échouée');
    return;
  }
  
  await checkData();
  await testHooks();
  await checkRLS();
  
  console.log('\n🎉 Diagnostic terminé !');
  console.log('\n📝 Solutions possibles :');
  console.log('1. Vérifiez vos variables d\'environnement dans .env.local');
  console.log('2. Vérifiez que le script de seeding a été exécuté');
  console.log('3. Vérifiez les politiques RLS dans Supabase');
  console.log('4. Vérifiez que les tables existent dans Supabase');
}

// Exécuter le diagnostic
runDiagnostic().catch(console.error);
