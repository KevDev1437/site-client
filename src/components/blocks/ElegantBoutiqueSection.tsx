'use client';

import ElegantProductCard from '@/components/cards/ElegantProductCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts } from '@/hooks/useProducts';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

interface ElegantBoutiqueSectionProps {
  showAllProducts?: boolean;
  maxProducts?: number;
}

export default function ElegantBoutiqueSection({ 
  showAllProducts = false, 
  maxProducts = 4 
}: ElegantBoutiqueSectionProps) {
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

  // Filtrer les produits selon le contexte
  const displayedProducts = showAllProducts 
    ? products 
    : products.slice(0, maxProducts);

  return (
    <section className="py-24 bg-beige-fonce px-6">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle 
          title={showAllProducts ? "Notre Boutique" : ""}
          subtitle="Des carnets, des pinceaux et des œuvres pensées pour t'accompagner dans ton aventure artistique."
        />
        
        {/* Grille responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ElegantProductCard 
              key={product.id} 
              product={product} 
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {/* Bouton "Voir tous" si section limitée */}
        {!showAllProducts && products.length > maxProducts && (
          <div className="text-center mt-12">
            <Button 
              href="/boutique" 
              className="font-sans text-base px-8 py-3 rounded-full bg-terracotta hover:bg-rose-poudre text-white transition-colors"
            >
              Voir tous les produits
            </Button>
          </div>
        )}

        {/* Message si aucun produit */}
        {displayedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-dore text-6xl mb-4">📦</div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="font-sans text-gray-600">
              Nos produits seront bientôt disponibles
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

