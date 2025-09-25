'use client';

import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  price_stripe_id: string;
  image_url: string;
  description?: string;
  stock: number;
  created_at: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
      console.error('Erreur:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(null);
    }
  };

  if (isLoadingProducts) {
    return (
      <div className="py-20 px-6">
        <SectionTitle 
          title="Notre boutique"
          subtitle="Découvrez notre sélection de matériel créatif de qualité pour continuer à créer chez vous"
        />
        <div className="text-center py-12">
          <div className="text-dore text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
            Chargement des produits...
          </h3>
          <p className="text-gris-doux">
            Veuillez patienter pendant que nous récupérons nos produits
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 px-6">
        <SectionTitle 
          title="Notre boutique"
          subtitle="Découvrez notre sélection de matériel créatif de qualité pour continuer à créer chez vous"
        />
        <div className="text-center py-12">
          <div className="text-dore text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
            Aucun produit disponible
          </h3>
          <p className="text-gris-doux">
            Nos produits seront bientôt disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-beige-fonce px-6">
      <SectionTitle 
        title="Notre boutique"
        subtitle="Découvrez notre sélection de matériel créatif de qualité pour continuer à créer chez vous"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="card-elegant overflow-hidden hover:card-elevated transition-all duration-300">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 font-serif">
                {product.title}
              </h3>
              
              {product.description && (
                <p className="text-gris-doux text-sm">
                  {product.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-dore">
                  {product.price}€
                </span>
                <Button 
                  onClick={() => handlePurchase(product)}
                  disabled={loading === product.id || product.stock <= 0}
                  className="btn-primary disabled:opacity-50"
                >
                  {product.stock <= 0 ? 'Rupture de stock' : 
                   loading === product.id ? 'Redirection...' : 'Acheter maintenant'}
                </Button>
              </div>
              
              {product.stock > 0 && (
                <p className="text-sm text-gris-doux">
                  {product.stock} en stock
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Information notice */}
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
  );
}
