/**
 * Exemples d'utilisation des fonctions de nettoyage d'authentification
 */

import { cleanupInvalidSessions, initializeAuthCleanup, initializeAuthCleanupWithCleanup } from './auth-cleanup';

// ========================================
// EXEMPLE 1: Usage général (sans React)
// ========================================

/**
 * Pour initialiser le nettoyage automatique dans un contexte non-React
 * (par exemple, dans un script d'initialisation global)
 */
export function setupGlobalAuthCleanup(): void {
  // Cette version gère automatiquement le nettoyage après 10 minutes
  initializeAuthCleanup();
  
  console.log('🧹 Nettoyage automatique d\'authentification initialisé');
}

// ========================================
// EXEMPLE 2: Usage avec React useEffect
// ========================================

/**
 * Hook personnalisé pour le nettoyage d'authentification
 */
import { useEffect } from 'react';

export function useAuthCleanup(): void {
  useEffect(() => {
    // Cette version retourne une fonction de cleanup que React peut gérer
    const cleanup = initializeAuthCleanupWithCleanup();
    
    // React appellera automatiquement cleanup() lors du démontage
    return cleanup;
  }, []);
}

// ========================================
// EXEMPLE 3: Nettoyage manuel
// ========================================

/**
 * Pour nettoyer manuellement les sessions invalides
 */
export async function manualAuthCleanup(): Promise<void> {
  console.log('🧹 Nettoyage manuel des sessions...');
  await cleanupInvalidSessions();
  console.log('✅ Nettoyage manuel terminé');
}

// ========================================
// EXEMPLE 4: Usage dans un composant React
// ========================================

/**
 * Composant qui utilise le nettoyage d'authentification
 */
import React from 'react';

export function AuthCleanupProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // Utiliser le hook personnalisé
  useAuthCleanup();
  
  return <>{children}</>;
}

// ========================================
// EXEMPLE 5: Usage dans un service worker
// ========================================

/**
 * Pour un service worker ou un contexte non-React
 */
export function setupServiceWorkerAuthCleanup(): void {
  // Nettoyage immédiat
  cleanupInvalidSessions();
  
  // Nettoyage périodique
  setInterval(cleanupInvalidSessions, 5 * 60 * 1000); // Toutes les 5 minutes
  
  console.log('🧹 Nettoyage d\'authentification configuré pour le service worker');
}
