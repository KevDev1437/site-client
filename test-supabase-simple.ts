/**
 * Test Simple Supabase - Vérification de la Connexion
 * 
 * Ce script teste la connexion Supabase sans les hooks React
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Test Simple Supabase');
console.log('====================');

// Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement :');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

// Créer le client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test de connexion
async function testConnection() {
  try {
    console.log('\n🔗 Test de connexion...');
    
    // Test simple
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

// Test des données
async function testData() {
  try {
    console.log('\n📊 Test des données...');
    
    // Test produits
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, is_active')
      .limit(3);
    
    console.log('📦 Produits:', {
      count: products?.length || 0,
      error: productsError?.message || 'OK'
    });
    
    // Test ateliers
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('id, title, published')
      .limit(3);
    
    console.log('🎨 Ateliers:', {
      count: workshops?.length || 0,
      error: workshopsError?.message || 'OK'
    });
    
    // Test témoignages
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('id, name')
      .limit(3);
    
    console.log('💬 Témoignages:', {
      count: testimonials?.length || 0,
      error: testimonialsError?.message || 'OK'
    });
    
  } catch (err) {
    console.error('❌ Erreur lors du test des données:', err);
  }
}

// Exécuter les tests
async function runTests() {
  const connectionOk = await testConnection();
  if (connectionOk) {
    await testData();
  }
  
  console.log('\n🎉 Test terminé !');
}

runTests().catch(console.error);
