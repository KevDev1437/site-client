import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

export default function ProductCard({ product, showDescription = false }: ProductCardProps) {
  return (
    <Link href={`/produit/${product.id}`} className="group">
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
        
        <p className="font-serif text-xl font-semibold text-terracotta mb-4">
          {product.price.toFixed(2)}€
        </p>
        
        <div className="font-sans text-sm uppercase tracking-wide bg-terracotta hover:bg-rose-poudre text-white px-4 py-2 rounded-lg transition-colors">
          Voir le produit
        </div>
      </div>
    </Link>
  );
}
