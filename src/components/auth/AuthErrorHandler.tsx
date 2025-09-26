'use client';

import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export function AuthErrorHandler() {
  useEffect(() => {
    // Gestion globale des erreurs d'authentification
    const handleAuthError = (error: Error) => {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('invalid refresh token') ||
          errorMessage.includes('refresh token not found') ||
          errorMessage.includes('jwt expired') ||
          errorMessage.includes('invalid jwt')) {
        
        console.log('🔄 Erreur de token détectée, déconnexion automatique');
        
        // Déconnexion automatique en cas d'erreur de token
        supabase?.auth.signOut().then(() => {
          console.log('✅ Déconnexion automatique effectuée');
          // Optionnel : redirection vers la page de connexion
          // window.location.href = '/auth/login';
        }).catch((signOutError) => {
          console.error('❌ Erreur lors de la déconnexion:', signOutError);
        });
      }
    };

    // Écouter les erreurs globales
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error) {
        handleAuthError(event.error);
      }
    };

    // Écouter les erreurs non capturées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Error) {
        handleAuthError(event.reason);
      }
    };

    // Ajouter les listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Nettoyage
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // Ce composant ne rend rien
}
