'use client';

import ElegantBoutiqueSection from '@/components/blocks/ElegantBoutiqueSection';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BoutiquePage() {
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

  return (
    <div className="min-h-screen bg-beige-fonce">
      {/* Message de confirmation/annulation */}
      {showMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-center py-4">
          <div className="max-w-7xl mx-auto px-6">
            {showMessage}
          </div>
        </div>
      )}
      
      {/* Section boutique élégante */}
      <ElegantBoutiqueSection showAllProducts={true} />

      {/* Information sur la sécurité des paiements */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
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
