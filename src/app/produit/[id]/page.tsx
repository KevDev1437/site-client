'use client';

import { useProduct } from '@/hooks/useProducts';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error } = useProduct(productId);
  const { handlePurchase, loading: isPurchasing } = useStripeCheckout();

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-fonce py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto"></div>
            <p className="font-sans text-gray-600 mt-4">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-beige-fonce py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
            Produit introuvable
          </h1>
          <p className="font-sans text-lg text-gray-600 mb-8">
            Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Link 
            href="/boutique"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-rose-poudre text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-fonce py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/boutique"
          className="inline-flex items-center gap-2 text-terracotta hover:text-rose-poudre mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Retour à la boutique</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image du produit */}
          <div className="aspect-square rounded-2xl overflow-hidden">
            <Image
              src={product.image_url ?? "/placeholder.png"}
              alt={product.title}
              width={600}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <p className="font-serif text-3xl font-semibold text-terracotta">
                {product.price.toFixed(2)}€
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="font-sans text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Bouton d'achat */}
            <div className="pt-6">
              <button 
                onClick={() => product && handlePurchase(product)}
                disabled={isPurchasing === product?.id}
                className="w-full bg-terracotta hover:bg-rose-poudre text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {isPurchasing === product?.id ? 'Redirection...' : 'Acheter maintenant'}
              </button>
              <p className="font-sans text-sm text-gray-500 mt-3 text-center">
                Paiement sécurisé avec Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
