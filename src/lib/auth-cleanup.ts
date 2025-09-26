import { supabase } from './supabase';

/**
 * Nettoie les sessions invalides et les tokens expirés
 */
export async function cleanupInvalidSessions(): Promise<void> {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase client non disponible pour le nettoyage');
      return;
    }

    // Vérifier la session actuelle
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('🔄 Erreur de session détectée, nettoyage en cours...');
      
      // Si c'est une erreur de token, déconnecter l'utilisateur
      if (error.message.includes('Invalid Refresh Token') ||
          error.message.includes('Refresh Token Not Found') ||
          error.message.includes('JWT expired')) {
        
        console.log('🧹 Nettoyage des tokens invalides...');
        await supabase.auth.signOut();
        console.log('✅ Session nettoyée avec succès');
      }
    } else if (!session) {
      console.log('ℹ️ Aucune session active');
    } else {
      console.log('✅ Session valide détectée');
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des sessions:', error);
  }
}

// Types pour les event handlers
type BeforeUnloadHandler = (event: BeforeUnloadEvent) => void;
type VisibilityChangeHandler = () => void;
type OnlineHandler = (event: Event) => void;

/**
 * Vérifie et nettoie automatiquement les sessions au démarrage
 * Version pour usage général (sans retour de cleanup)
 */
export function initializeAuthCleanup(): void {
  // Nettoyer au chargement de la page
  cleanupInvalidSessions();
  
  // Nettoyer périodiquement (toutes les 5 minutes)
  const cleanupInterval = setInterval(cleanupInvalidSessions, 5 * 60 * 1000);
  
  // Nettoyer avant la fermeture de la page
  const handleBeforeUnload: BeforeUnloadHandler = () => {
    cleanupInvalidSessions();
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Nettoyer quand la page devient visible (retour d'onglet)
  const handleVisibilityChange: VisibilityChangeHandler = () => {
    if (!document.hidden) {
      cleanupInvalidSessions();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Nettoyer quand la connexion revient
  const handleOnline: OnlineHandler = () => {
    cleanupInvalidSessions();
  };
  
  window.addEventListener('online', handleOnline);
  
  // Nettoyage automatique après 10 minutes (fallback)
  setTimeout(() => {
    clearInterval(cleanupInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('online', handleOnline);
  }, 10 * 60 * 1000);
}

/**
 * Version pour React useEffect avec retour de cleanup function
 */
export function initializeAuthCleanupWithCleanup(): () => void {
  // Nettoyer au chargement de la page
  cleanupInvalidSessions();
  
  // Nettoyer périodiquement (toutes les 5 minutes)
  const cleanupInterval = setInterval(cleanupInvalidSessions, 5 * 60 * 1000);
  
  // Nettoyer avant la fermeture de la page
  const handleBeforeUnload: BeforeUnloadHandler = () => {
    cleanupInvalidSessions();
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Nettoyer quand la page devient visible (retour d'onglet)
  const handleVisibilityChange: VisibilityChangeHandler = () => {
    if (!document.hidden) {
      cleanupInvalidSessions();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Nettoyer quand la connexion revient
  const handleOnline: OnlineHandler = () => {
    cleanupInvalidSessions();
  };
  
  window.addEventListener('online', handleOnline);
  
  // Retourner une fonction de nettoyage pour React
  return (): void => {
    clearInterval(cleanupInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('online', handleOnline);
  };
}
