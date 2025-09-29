/**
 * Test Final - Vérification Complète
 * 
 * Ce script teste toutes les connexions Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🎯 TEST FINAL - Vérification Complète');
console.log('=====================================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test complet
async function runCompleteTest() {
  try {
    console.log('\n🔍 Test 1: Produits');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price, is_active')
      .eq('is_active', true);
    
    console.log(`✅ Produits: ${products?.length || 0} trouvés`);
    if (productsError) console.error('❌ Erreur produits:', productsError);
    
    console.log('\n🔍 Test 2: Ateliers');
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('id, title, date, published')
      .eq('published', true);
    
    console.log(`✅ Ateliers: ${workshops?.length || 0} trouvés`);
    if (workshopsError) console.error('❌ Erreur ateliers:', workshopsError);
    
    console.log('\n🔍 Test 3: Témoignages');
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('id, name, rating');
    
    console.log(`✅ Témoignages: ${testimonials?.length || 0} trouvés`);
    if (testimonialsError) console.error('❌ Erreur témoignages:', testimonialsError);
    
    console.log('\n🎉 RÉSULTAT FINAL:');
    console.log(`- Produits actifs: ${products?.length || 0}`);
    console.log(`- Ateliers publiés: ${workshops?.length || 0}`);
    console.log(`- Témoignages: ${testimonials?.length || 0}`);
    
    if (products?.length > 0 && workshops?.length > 0 && testimonials?.length > 0) {
      console.log('\n✅ TOUT FONCTIONNE ! Votre site devrait maintenant afficher les données.');
    } else {
      console.log('\n⚠️ Certaines données manquent. Vérifiez les scripts de seeding.');
    }
    
  } catch (err) {
    console.error('❌ Erreur lors du test:', err);
  }
}

runCompleteTest();
