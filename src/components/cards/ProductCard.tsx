import { Product } from '@/types/product';
import { Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
  onPurchase?: (product: Product) => void;
}

export default function ProductCard({ product, showDescription = false, onPurchase }: ProductCardProps) {
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

  return (
    <div className="card-elegant p-6 text-center group-hover:card-elevated transition-all duration-300">
      <div className="aspect-square rounded-2xl overflow-hidden mb-6">
        <Image
          src={product.image_url}
          alt={product.title}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
      </div>
      
      <h3 className="font-serif text-lg font-medium text-gray-900 mb-2">
        {product.title}
      </h3>
      
      {showDescription && product.description && (
        <p className="font-sans text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
      )}
      
      <p className="font-serif text-xl font-semibold text-terracotta mb-6">
        {product.price.toFixed(2)}€
      </p>
      
      <div className="space-y-3">
        {/* Bouton Voir le produit */}
        <Link 
          href={`/produit/${product.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Voir le produit
        </Link>
        
        {/* Bouton Acheter maintenant */}
        <button
          onClick={handlePurchase}
          disabled={isPurchasing}
          className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-rose-poudre text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isPurchasing ? 'Redirection...' : 'Acheter maintenant'}
        </button>
      </div>
    </div>
  );
}
