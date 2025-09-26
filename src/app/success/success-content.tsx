'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          
          <h1 className="text-3xl font-bold text-green-600 mb-4 font-serif">
            Paiement réussi !
          </h1>
          
          <p className="text-gray-600 mb-6 font-sans">
            Merci pour votre confiance. Votre commande a été traitée avec succès.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 font-sans mb-1">Référence de session :</p>
              <p className="text-xs text-gray-700 font-mono break-all">{sessionId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <Link 
              href="/boutique"
              className="block w-full bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-6 py-3 font-sans transition-colors"
            >
              Retour à la boutique
            </Link>
            
            <Link 
              href="/profile"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-6 py-3 font-sans transition-colors"
            >
              Voir mon profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
