import { Suspense } from 'react';
import SuccessContent from './success-content';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4 font-serif">
              Chargement...
            </h1>
            <p className="text-gray-600 font-sans">
              Vérification de votre paiement en cours...
            </p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
