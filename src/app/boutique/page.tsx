import { Suspense } from 'react';
import BoutiqueContent from './BoutiqueContent';

export default function BoutiquePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige-fonce flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a5c3b] mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Chargement de la boutique...</p>
        </div>
      </div>
    }>
      <BoutiqueContent />
    </Suspense>
  );
}
