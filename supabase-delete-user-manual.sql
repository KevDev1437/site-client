-- Script pour supprimer manuellement un utilisateur de Supabase
-- ⚠️ ATTENTION: Ce script supprime définitivement l'utilisateur et toutes ses données

-- Remplacez 'USER_EMAIL_HERE' par l'email de l'utilisateur à supprimer
-- Remplacez 'USER_ID_HERE' par l'ID de l'utilisateur à supprimer

-- 1. Trouver l'ID de l'utilisateur par son email
-- SELECT id, email FROM auth.users WHERE email = 'USER_EMAIL_HERE';

-- 2. Supprimer les données liées (remplacez USER_ID_HERE par l'ID réel)
-- DELETE FROM workshop_bookings WHERE user_id = 'USER_ID_HERE';
-- DELETE FROM user_purchases WHERE user_id = 'USER_ID_HERE';
-- DELETE FROM profiles WHERE id = 'USER_ID_HERE';

-- 3. Supprimer l'avatar du storage (remplacez USER_ID_HERE par l'ID réel)
-- DELETE FROM storage.objects WHERE bucket_id = 'avatars' AND name LIKE 'USER_ID_HERE/%';

-- 4. Supprimer l'utilisateur de auth.users (remplacez USER_ID_HERE par l'ID réel)
-- DELETE FROM auth.users WHERE id = 'USER_ID_HERE';

-- 5. Vérifier que l'utilisateur a été supprimé
-- SELECT * FROM auth.users WHERE email = 'USER_EMAIL_HERE';
-- SELECT * FROM profiles WHERE id = 'USER_ID_HERE';

-- ⚠️ INSTRUCTIONS D'UTILISATION:
-- 1. Remplacez 'USER_EMAIL_HERE' par l'email réel
-- 2. Remplacez 'USER_ID_HERE' par l'ID réel (récupéré avec la première requête)
-- 3. Exécutez les requêtes une par une dans l'ordre
-- 4. Vérifiez avec les requêtes de vérification
