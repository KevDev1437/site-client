-- Script pour vérifier et créer la fonction delete_user_account si nécessaire

-- 1. Vérifier si la fonction existe
SELECT 
  routine_name, 
  routine_type, 
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'delete_user_account' 
AND routine_schema = 'public';

-- 2. Créer la fonction si elle n'existe pas
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur actuel
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Supprimer les données liées à l'utilisateur
  -- (Les contraintes CASCADE s'occupent de la suppression en cascade)
  
  -- Supprimer les réservations
  DELETE FROM reservations WHERE user_id = current_user_id;
  
  -- Supprimer les commandes
  DELETE FROM orders WHERE user_id = current_user_id;
  
  -- Supprimer le profil utilisateur
  DELETE FROM profiles WHERE id = current_user_id;
  
  -- Supprimer l'utilisateur de la table auth.users
  -- Note: Cette opération nécessite des privilèges admin
  -- En production, utilisez l'API Admin de Supabase
  
  -- Pour l'instant, on marque l'utilisateur comme supprimé
  UPDATE auth.users 
  SET 
    email = 'deleted_' || current_user_id || '@deleted.com',
    encrypted_password = '',
    email_confirmed_at = NULL,
    phone = NULL,
    phone_confirmed_at = NULL,
    confirmation_token = NULL,
    recovery_token = NULL,
    email_change_token = NULL,
    email_change = NULL,
    phone_change_token = NULL,
    phone_change = NULL,
    reauthentication_token = NULL,
    reauthentication_sent_at = NULL,
    is_sso_user = false,
    deleted_at = NOW()
  WHERE id = current_user_id;
  
  -- Log de la suppression
  RAISE NOTICE 'Compte utilisateur % supprimé avec succès', current_user_id;
  
END;
$$;

-- 3. Donner les permissions d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;

-- 4. Tester la fonction (optionnel - à exécuter avec un utilisateur connecté)
-- SELECT delete_user_account();
