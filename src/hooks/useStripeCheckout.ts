'use client';

import { Product } from '@/types/product';
import { useState } from 'react';

export function useStripeCheckout() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (product: Product) => {
    try {
      setLoading(product.id);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_UNIFIED_PRICE_ID || "price_1QExample",
          productName: product.title,
          productPrice: product.price,
          productId: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(null);
    }
  };

  return { handlePurchase, loading };
}
