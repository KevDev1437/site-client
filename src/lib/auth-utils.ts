import type { AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * Gère les erreurs d'authentification Supabase de manière centralisée
 */
export function handleAuthError(error: AuthError | Error): 'clear' | 'retry' {
  const errorMessage = error.message.toLowerCase();
  
  // Erreurs de réseau ou temporaires
  if (errorMessage.includes('network') || 
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection')) {
    return 'retry';
  }
  
  // Autres erreurs - nettoyer la session
  return 'clear';
}

/**
 * Vérifie si une session est valide et peut être rafraîchie
 */
export async function isSessionValid(): Promise<boolean> {
  try {
    if (!supabase) return false;
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erreur de session:', error);
      return false;
    }
    
    return !!data?.session?.user;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de session:', error);
    return false;
  }
}

/**
 * Rafraîchit la session de manière sécurisée
 */
export async function refreshSession(): Promise<boolean> {
  try {
    if (!supabase) return false;
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      return false;
    }
    
    return !!data?.session;
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement de session:', error);
    return false;
  }
}

/**
 * Déconnecte l'utilisateur et nettoie la session
 */
export async function signOut(): Promise<void> {
  try {
    if (!supabase) return;
    
    await supabase.auth.signOut();
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
  }
}
