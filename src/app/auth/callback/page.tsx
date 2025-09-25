'use client';

import { createClient } from '@/lib/supabase';
import { CheckCircle, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          setMessage('Erreur lors de la confirmation de votre compte');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Votre compte a été confirmé avec succès !');
          
          // Rediriger vers la page d'accueil après 3 secondes
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Session non trouvée');
        }
      } catch {
        setStatus('error');
        setMessage('Une erreur est survenue');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-beige-clair flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-terracotta mx-auto mb-6"></div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Confirmation en cours...
            </h1>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous confirmons votre compte.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Email confirmé ! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Votre compte a été confirmé avec succès. Vous allez être redirigé vers la page d&apos;accueil.
            </p>
            <div className="bg-terracotta/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-terracotta">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Compte activé</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-terracotta hover:bg-rose-poudre text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Continuer vers le site
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Mail className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Erreur de confirmation
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-terracotta hover:bg-rose-poudre text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Retour à l&apos;accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}
