'use client';

import ProductCard from '@/components/cards/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts } from '@/hooks/useProducts';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BoutiquePage() {
  const { products, loading, error } = useProducts();
  const { handlePurchase } = useStripeCheckout();
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowMessage('✅ Achat confirmé ! Merci pour votre commande.');
    } else if (canceled === 'true') {
      setShowMessage('ℹ️ Achat annulé. Vous pouvez continuer vos achats.');
    }
    
    // Masquer le message après 5 secondes
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, showMessage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-fonce py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto"></div>
            <p className="font-sans text-gray-600 mt-4">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-fonce py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="font-sans text-red-600">Erreur lors du chargement des produits</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-fonce py-24 px-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Message de confirmation/annulation */}
        {showMessage && (
          <div className="mb-8 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-center">
            {showMessage}
          </div>
        )}
        
        <SectionTitle 
          title="Notre Boutique"
          subtitle="Découvrez notre sélection de matériel créatif de qualité et d'œuvres d'art uniques"
        />

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans text-gray-600 text-lg">
              Aucun produit disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showDescription={true}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Information sur la sécurité des paiements */}
        <div className="mt-16 text-center">
          <div className="bg-rose border border-dore/20 rounded-xl p-8 max-w-2xl mx-auto">
            <div className="text-dore text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
              Paiement sécurisé
            </h3>
            <p className="text-gris-doux">
              Tous nos paiements sont sécurisés par Stripe. Vous recevrez un email de confirmation 
              après votre achat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
