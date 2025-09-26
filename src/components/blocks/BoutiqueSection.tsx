'use client';

import ProductCard from '@/components/cards/ProductCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts } from '@/hooks/useProducts';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

export default function BoutiqueSection() {
  const { products, loading, error } = useProducts();
  const { handlePurchase } = useStripeCheckout();

  if (loading) {
    return (
      <section className="py-24 bg-beige-fonce px-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto"></div>
            <p className="font-sans text-gray-600 mt-4">Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-beige-fonce px-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="font-sans text-red-600">Erreur lors du chargement des produits</p>
          </div>
        </div>
      </section>
    );
  }

  // Afficher seulement les 4 premiers produits sur la page d'accueil
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-24 bg-beige-fonce px-6">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle 
          title=""
          subtitle="Des carnets, des pinceaux et des œuvres pensées pour t'accompagner dans ton aventure artistique."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {products.length > 4 && (
          <div className="text-center mt-12">
            <Button 
              href="/boutique" 
              className="font-sans text-base px-8 py-3 rounded-full bg-terracotta hover:bg-rose-poudre text-white"
            >
              Voir tous les produits
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
