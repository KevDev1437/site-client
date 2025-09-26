-- Script pour corriger la fonction delete_user et éliminer l'erreur "column reference user_id is ambiguous"

-- 1. Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS delete_user();

-- 2. Créer la nouvelle fonction corrigée
CREATE OR REPLACE FUNCTION delete_user_corrected()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Récupérer l'ID de l'utilisateur actuel
  current_user_id := auth.uid();
  
  -- Vérifier que l'utilisateur est connecté
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Supprimer les données liées dans l'ordre (pour éviter les contraintes de clé étrangère)
  
  -- 1. Supprimer les réservations d'ateliers
  DELETE FROM workshop_bookings WHERE user_id = current_user_id;
  
  -- 2. Supprimer les achats
  DELETE FROM user_purchases WHERE user_id = current_user_id;
  
  -- 3. Supprimer le profil
  DELETE FROM profiles WHERE id = current_user_id;
  
  -- 4. Supprimer l'avatar du storage (si existe)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'avatars' 
  AND name LIKE current_user_id::text || '/%';
  
  -- 5. Supprimer l'utilisateur de auth.users (cela supprimera automatiquement les sessions, tokens, etc.)
  DELETE FROM auth.users WHERE id = current_user_id;
  
  -- La fonction se termine ici, la suppression de auth.users déclenchera automatiquement
  -- la suppression des données liées dans auth.sessions, auth.refresh_tokens, etc.
  
END;
$$;

-- 3. Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION delete_user_corrected() TO authenticated;

-- 4. Tester la fonction (optionnel)
-- SELECT delete_user_corrected();
