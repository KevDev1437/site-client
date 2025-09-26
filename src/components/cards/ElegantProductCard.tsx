import UniversalImage from '@/components/ui/UniversalImage';
import { Product } from '@/types/product';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ElegantProductCardProps {
  product: Product;
  onPurchase?: (product: Product) => void;
}

export default function ElegantProductCard({ product, onPurchase }: ElegantProductCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onPurchase) {
      setIsPurchasing(true);
      try {
        await onPurchase(product);
      } finally {
        setIsPurchasing(false);
      }
    }
  };

  const isInStock = product.stock > 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-[400px] flex flex-col group">
      {/* Image avec badge stock */}
      <div className="relative aspect-square overflow-hidden">
        <UniversalImage
          src={product.image_url}
          alt={product.title}
          width={300}
          height={300}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge stock */}
        {isInStock && (
          <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            {product.stock} en stock
          </div>
        )}
        
        {!isInStock && (
          <div className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            Épuisé
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Titre */}
        <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {/* Description */}
        {product.description && (
          <p className="font-sans text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
        )}
        
        {/* Prix */}
        <p className="font-serif text-base font-bold text-terracotta mb-4">
          {product.price.toFixed(2)}€
        </p>
        
        {/* Boutons */}
        <div className="space-y-2 mt-auto">
          {/* Bouton principal */}
          <button
            onClick={handlePurchase}
            disabled={isPurchasing || !isInStock}
            className="w-full bg-terracotta hover:bg-rose-poudre text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {isPurchasing ? 'Redirection...' : !isInStock ? 'Épuisé' : 'Acheter maintenant'}
          </button>
          
          {/* Lien discret */}
          <Link 
            href={`/produit/${product.id}`}
            className="block text-center text-terracotta hover:text-gray-600 text-sm underline transition-colors"
          >
            Voir plus de détails
          </Link>
        </div>
      </div>
    </div>
  );
}
