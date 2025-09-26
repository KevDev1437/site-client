-- Solution temporaire : désactiver RLS pour permettre la création des profils
-- ATTENTION : À utiliser uniquement pour la configuration initiale

-- 1. Désactiver temporairement RLS sur profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Créer des profils pour tous les utilisateurs existants
INSERT INTO profiles (id, full_name, bio, avatar_url, phone)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  COALESCE(raw_user_meta_data->>'bio', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', ''),
  COALESCE(raw_user_meta_data->>'phone', '')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
);

-- 3. Réactiver RLS avec les bonnes politiques
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Recréer les politiques
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
