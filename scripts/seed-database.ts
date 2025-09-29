/**
 * Script de Seeding Automatique - Yapha Creative Studio
 * 
 * Ce script peut être exécuté via Next.js pour insérer des données de test
 * Compatible avec l'API Supabase et les hooks existants
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (utilise les variables d'environnement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// DONNÉES DE TEST
// =====================================================

const productsData = [
  {
    id: 'prod_coffret_calligraphie',
    title: 'Coffret Calligraphie Moderne',
    description: 'Un coffret complet pour débuter la calligraphie moderne. Inclut 3 plumes, 2 encres, papier premium et guide d\'apprentissage. Parfait pour les débutants comme les confirmés.',
    price: 4500, // 45.00€ en centimes
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    stock: 12,
    is_active: true,
    price_stripe_id: 'price_1QCalligraphie'
  },
  {
    id: 'prod_carnet_croquis',
    title: 'Carnet de Croquis Premium',
    description: 'Carnet de croquis 200 pages, papier 120g, reliure spirale métallique. Format A5, parfait pour les esquisses, dessins et notes créatives. Papier adapté à tous les médiums.',
    price: 1800, // 18.00€ en centimes
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    stock: 25,
    is_active: true,
    price_stripe_id: 'price_1QCroquis'
  },
  {
    id: 'prod_fil_crochet_bio',
    title: 'Fil Crochet Bio 100% Coton',
    description: 'Fil de crochet écologique en coton bio, 100g. Couleurs naturelles, doux au toucher. Idéal pour les projets éco-responsables. 3 couleurs disponibles : blanc, beige, gris.',
    price: 1200, // 12.00€ en centimes
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    stock: 30,
    is_active: true,
    price_stripe_id: 'price_1QCrochet'
  },
  {
    id: 'prod_set_pinceaux_premium',
    title: 'Set Pinceaux Premium 8 pièces',
    description: 'Collection de 8 pinceaux professionnels en poils naturels. Tailles variées pour tous types de peinture : aquarelle, acrylique, huile. Manches en bois de hêtre, qualité artiste.',
    price: 3200, // 32.00€ en centimes
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stock: 8,
    is_active: true,
    price_stripe_id: 'price_1QPinceaux'
  },
  {
    id: 'prod_argile_poterie',
    title: 'Argile Poterie Naturelle 5kg',
    description: 'Argile naturelle pour poterie, 5kg. Texture fine, facile à modeler. Cuisson à 1000°C. Parfaite pour débuter la poterie ou créer des pièces uniques. Livrée dans un seau hermétique.',
    price: 2800, // 28.00€ en centimes
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    stock: 15,
    is_active: true,
    price_stripe_id: 'price_1QArgile'
  }
];

const workshopsData = [
  {
    id: 'workshop_peinture_creativite',
    slug: 'atelier-peinture-creativite',
    title: 'Atelier Peinture & Créativité',
    date: '2024-03-15T14:00:00+01:00', // Date future
    location: 'Studio Yapha - 15 rue de la Créativité, 75011 Paris',
    price: 6500, // 65.00€ en centimes
    seats: 8, // Places disponibles
    total_seats: 12, // Places totales
    price_stripe_id: 'price_1QPeinture',
    cover_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    excerpt: 'Découvrez la peinture acrylique dans une ambiance conviviale. Techniques de base, mélanges de couleurs et création d\'une œuvre personnelle.',
    description: 'Un atelier complet de 3 heures pour découvrir ou approfondir la peinture acrylique. Nous aborderons les techniques de base, les mélanges de couleurs, et vous créerez votre propre œuvre d\'art. Matériel fourni, tous niveaux acceptés. Ambiance conviviale garantie !',
    published: true
  },
  {
    id: 'workshop_sculpture_argile',
    slug: 'atelier-sculpture-argile',
    title: 'Sculpture sur Argile - Initiation',
    date: '2024-03-22T10:00:00+01:00', // Date future
    location: 'Studio Yapha - 15 rue de la Créativité, 75011 Paris',
    price: 7500, // 75.00€ en centimes
    seats: 6, // Places disponibles
    total_seats: 10, // Places totales
    price_stripe_id: 'price_1QSculpture',
    cover_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    excerpt: 'Initiation à la sculpture sur argile. Apprenez les techniques de modelage et créez votre première pièce unique. Cuisson incluse.',
    description: 'Atelier de 4 heures pour découvrir l\'art de la sculpture sur argile. Vous apprendrez les techniques de base du modelage, les différentes textures, et créerez votre première pièce unique. L\'argile, les outils et la cuisson sont inclus. Votre création sera cuite et vous pourrez la récupérer une semaine plus tard.',
    published: true
  },
  {
    id: 'workshop_photographie_debutant',
    slug: 'atelier-photographie-debutant',
    title: 'Photographie Créative - Débutant',
    date: '2024-03-29T09:30:00+01:00', // Date future
    location: 'Studio Yapha - 15 rue de la Créativité, 75011 Paris',
    price: 5500, // 55.00€ en centimes
    seats: 10, // Places disponibles
    total_seats: 15, // Places totales
    price_stripe_id: 'price_1QPhoto',
    cover_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop',
    excerpt: 'Apprenez les bases de la photographie créative. Composition, lumière naturelle et techniques de prise de vue. Apportez votre appareil !',
    description: 'Atelier de 3h30 pour maîtriser les fondamentaux de la photographie créative. Nous aborderons la composition, la gestion de la lumière naturelle, les réglages de base de votre appareil, et les techniques pour créer des images artistiques. Apportez votre appareil photo (reflex, hybride ou même smartphone). Sortie photo en extérieur incluse.',
    published: true
  }
];

// =====================================================
// FONCTIONS DE SEEDING
// =====================================================

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  try {
    // Vérifier si des produits existent déjà
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️ Products already exist, skipping...');
      return;
    }
    
    // Insérer les produits
    const { data, error } = await supabase
      .from('products')
      .insert(productsData);
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ ${productsData.length} products inserted successfully!`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

async function seedWorkshops() {
  console.log('🌱 Seeding workshops...');
  
  try {
    // Vérifier si des ateliers existent déjà
    const { data: existingWorkshops } = await supabase
      .from('workshops')
      .select('id')
      .limit(1);
    
    if (existingWorkshops && existingWorkshops.length > 0) {
      console.log('⚠️ Workshops already exist, skipping...');
      return;
    }
    
    // Insérer les ateliers
    const { data, error } = await supabase
      .from('workshops')
      .insert(workshopsData);
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ ${workshopsData.length} workshops inserted successfully!`);
  } catch (error) {
    console.error('❌ Error seeding workshops:', error);
    throw error;
  }
}

async function seedTestimonials() {
  console.log('🌱 Seeding testimonials...');
  
  try {
    // Vérifier si des témoignages existent déjà
    const { data: existingTestimonials } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1);
    
    if (existingTestimonials && existingTestimonials.length > 0) {
      console.log('⚠️ Testimonials already exist, skipping...');
      return;
    }
    
    const testimonialsData = [
      {
        name: 'Camille M.',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        quote: 'L\'atelier peinture était incroyable ! J\'ai découvert des techniques que je ne connaissais pas. L\'ambiance était parfaite.',
        rating: 5,
        is_featured: true
      },
      {
        name: 'Antoine L.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        quote: 'La sculpture sur argile m\'a passionné. Julie explique très bien et l\'atelier est super bien équipé.',
        rating: 5,
        is_featured: true
      }
    ];
    
    // Insérer les témoignages
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialsData);
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ ${testimonialsData.length} testimonials inserted successfully!`);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    throw error;
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function seedDatabase() {
  console.log('🚀 Starting database seeding...');
  
  try {
    await seedProducts();
    await seedWorkshops();
    await seedTestimonials();
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Afficher un résumé
    const { data: products } = await supabase
      .from('products')
      .select('id, title, stock')
      .eq('is_active', true);
    
    const { data: workshops } = await supabase
      .from('workshops')
      .select('id, title, seats, total_seats')
      .eq('published', true);
    
    console.log('\n📊 Summary:');
    console.log(`- Products: ${products?.length || 0} active products`);
    console.log(`- Workshops: ${workshops?.length || 0} published workshops`);
    
    if (products) {
      const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
      console.log(`- Total stock: ${totalStock} items`);
    }
    
    if (workshops) {
      const totalSeats = workshops.reduce((sum, w) => sum + (w.total_seats || 0), 0);
      const availableSeats = workshops.reduce((sum, w) => sum + (w.seats || 0), 0);
      console.log(`- Workshop seats: ${availableSeats}/${totalSeats} available`);
    }
    
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  }
}

// =====================================================
// EXÉCUTION
// =====================================================

// Exécuter le seeding si le script est appelé directement
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase, seedProducts, seedTestimonials, seedWorkshops };

