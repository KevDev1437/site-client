'use client';

import { createClient } from '@/lib/supabase';
import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EmailConfirmationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const supabase = createClient();
      
      // Vérifier si l'utilisateur vient d'être confirmé
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Vérifier si l'email a été confirmé récemment
        const confirmedAt = session.user.email_confirmed_at;
        const now = new Date();
        const confirmedTime = confirmedAt ? new Date(confirmedAt) : null;
        
        // Si l'email a été confirmé dans les 5 dernières minutes
        if (confirmedTime && (now.getTime() - confirmedTime.getTime()) < 5 * 60 * 1000) {
          setIsConfirmed(true);
          setShowBanner(true);
          
          // Masquer le banner après 10 secondes
          setTimeout(() => {
            setShowBanner(false);
          }, 10000);
        }
      }
    };

    checkEmailConfirmation();
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-6">
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg p-4 flex items-center gap-4 ${
          isConfirmed 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className={`rounded-full p-2 ${
            isConfirmed 
              ? 'bg-green-100' 
              : 'bg-blue-100'
          }`}>
            <CheckCircle className={`w-5 h-5 ${
              isConfirmed 
                ? 'text-green-600' 
                : 'text-blue-600'
            }`} />
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold ${
              isConfirmed 
                ? 'text-green-800' 
                : 'text-blue-800'
            }`}>
              {isConfirmed ? 'Email confirmé ! 🎉' : 'Vérification en cours...'}
            </h3>
            <p className={`text-sm ${
              isConfirmed 
                ? 'text-green-700' 
                : 'text-blue-700'
            }`}>
              {isConfirmed 
                ? 'Votre compte a été activé avec succès. Bienvenue chez Yapha Creative Studio !'
                : 'Nous vérifions votre compte...'
              }
            </p>
          </div>
          
          <button
            onClick={() => setShowBanner(false)}
            className={`p-1 rounded-full hover:bg-white/50 transition-colors ${
              isConfirmed 
                ? 'text-green-600 hover:text-green-800' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
