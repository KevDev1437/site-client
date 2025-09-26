'use client';

import AtelierCard from '@/components/cards/AtelierCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { useAteliers } from '@/hooks/useAteliers';
import { useCart } from '@/store/cart';
import { Atelier } from '@/types/atelier';

export default function ElegantAteliersSection() {
  const { ateliers, loading, error } = useAteliers();
  const { addToCart } = useCart();

  const handleAddToCart = (atelier: Atelier) => {
    addToCart({
      id: atelier.id,
      title: atelier.title,
      price: atelier.price,
      image_url: atelier.cover_url,
      priceId: atelier.price_stripe_id
    });
  };

  if (loading) {
    return (
      <section className="py-24 bg-boutique px-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto"></div>
            <p className="font-sans text-gray-600 mt-4">Chargement des ateliers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-boutique px-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
              Impossible de charger les ateliers
            </h3>
            <p className="font-sans text-gray-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-boutique px-6">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle 
          title="Nos Ateliers"
          subtitle="Découvrez nos ateliers créatifs et laissez libre cours à votre imagination"
        />
        
        {/* Grille responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ateliers.map((atelier) => (
            <AtelierCard 
              key={atelier.id} 
              atelier={atelier} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Message si aucun atelier */}
        {ateliers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-dore text-6xl mb-4">🎨</div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
              Aucun atelier disponible
            </h3>
            <p className="font-sans text-gray-600">
              Nos prochains ateliers seront bientôt annoncés
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
