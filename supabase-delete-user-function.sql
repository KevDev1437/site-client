-- Fonction pour supprimer un utilisateur et toutes ses données
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Récupérer l'ID de l'utilisateur actuel
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Supprimer les données liées dans l'ordre correct (pour respecter les contraintes de clé étrangère)
  
  -- 1. Supprimer les achats
  DELETE FROM user_purchases WHERE user_id = user_id;
  
  -- 2. Supprimer les réservations d'ateliers
  DELETE FROM workshop_bookings WHERE user_id = user_id;
  
  -- 3. Supprimer le profil
  DELETE FROM profiles WHERE id = user_id;
  
  -- 4. Supprimer l'utilisateur de auth.users (cela supprimera automatiquement les sessions, etc.)
  DELETE FROM auth.users WHERE id = user_id;
  
END;
$$;

-- Donner les permissions d'exécution à tous les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
