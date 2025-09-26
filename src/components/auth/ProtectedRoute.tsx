'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Composant de protection de route qui redirige vers la connexion
 * si l'utilisateur n'est pas authentifié
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/callback' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔄 Utilisateur non authentifié, redirection vers:', redirectTo);
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
