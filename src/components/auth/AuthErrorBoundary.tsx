'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Composant qui capture les erreurs d'authentification et redirige
 * vers la page de connexion en cas d'erreur de refresh token
 */
export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.error?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('invalid refresh token') || 
          errorMessage.includes('refresh token not found') ||
          errorMessage.includes('jwt expired')) {
        console.log('🔄 Erreur d\'authentification détectée, redirection...');
        setHasError(true);
        router.push('/auth/callback');
      }
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [mounted, router]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session expirée
          </h2>
          <p className="text-gray-600 mb-4">
            Votre session a expiré. Vous allez être redirigé vers la page de connexion.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
