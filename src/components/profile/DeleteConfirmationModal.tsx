'use client';

import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteConfirmationModal({ isOpen, onClose }: DeleteConfirmationModalProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icône de succès */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
          Compte supprimé avec succès
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6 font-sans">
          Toutes vos données ont été définitivement supprimées. 
          Vous allez être redirigé vers l&apos;accueil dans <span className="font-bold text-green-600">{countdown}</span> seconde{countdown > 1 ? 's' : ''}.
        </p>
        
        {/* Indicateur de chargement */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </div>
        
        {/* Message de redirection */}
        <p className="text-sm text-gray-500 mt-4 font-sans">
          Redirection en cours...
        </p>

        {/* Bouton d'annulation (optionnel) */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-sans transition-colors"
          >
            Fermer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
