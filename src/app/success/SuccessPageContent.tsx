'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SessionData {
  sessionId: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;
  paymentStatus: string;
  productName: string;
  metadata: Record<string, string>;
}

export default function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Session introuvable ❌');
      setLoading(false);
      return;
    }

    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération des données');
        }

        setSessionData(data.data);
      } catch (err) {
        console.error('Erreur récupération session:', err);
        setError('Impossible de récupérer les infos du paiement');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [searchParams]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Erreur</h1>
          <p className="text-gray-600 font-sans">{error}</p>
          <Link 
            href="/boutique"
            className="inline-block mt-4 bg-terracotta hover:bg-rose-poudre text-white rounded-lg px-4 py-2 font-sans transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Message de succès */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
            Merci pour votre réservation !
          </h1>
          <p className="text-gray-600 font-sans">
            Votre paiement a été traité avec succès
          </p>
        </div>

        {/* Récapitulatif */}
        {sessionData && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-serif">
              Récapitulatif de votre commande
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-sans">Produit :</span>
                <span className="font-medium text-gray-900 font-sans">{sessionData.productName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-sans">Montant payé :</span>
                <span className="font-bold text-terracotta font-sans">
                  {formatAmount(sessionData.amountTotal, sessionData.currency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-sans">Email de confirmation :</span>
                <span className="font-medium text-gray-900 font-sans">{sessionData.customerEmail}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link 
            href="/boutique"
            className="block w-full bg-terracotta hover:bg-rose-poudre text-white rounded-lg px-4 py-3 font-medium font-sans text-center transition-colors"
          >
            Retour à la boutique
          </Link>
          
          <button 
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-3 font-medium font-sans transition-colors"
            onClick={() => alert('Fonctionnalité à venir !')}
          >
            Voir mes réservations
          </button>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-6 font-sans">
          Un email de confirmation vous a été envoyé à {sessionData?.customerEmail}
        </p>
      </div>
    </div>
  );
}
