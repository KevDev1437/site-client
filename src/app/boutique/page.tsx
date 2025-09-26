'use client';

import ProductCard from '@/components/cards/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts } from '@/hooks/useProducts';

export default function BoutiquePage() {
  const { products, loading, error } = useProducts();

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
              <ProductCard key={product.id} product={product} showDescription={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
