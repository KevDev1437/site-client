-- Correction des politiques RLS pour résoudre l'erreur "new row violates row-level security policy"

-- 1. Supprimer toutes les politiques existantes sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 2. Recréer les politiques avec les bonnes permissions
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Vérifier que RLS est activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Créer un profil pour l'utilisateur actuel s'il n'en a pas
-- (Cette requête doit être exécutée par l'utilisateur connecté)
INSERT INTO profiles (id, full_name, bio, avatar_url, phone)
SELECT 
  auth.uid(),
  '',
  '',
  '',
  ''
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
  );

-- 5. Vérifier les permissions sur les autres tables
DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;
CREATE POLICY "Users can view own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own bookings" ON workshop_bookings;
CREATE POLICY "Users can view own bookings" ON workshop_bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON workshop_bookings;
CREATE POLICY "Users can insert own bookings" ON workshop_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON workshop_bookings;
CREATE POLICY "Users can update own bookings" ON workshop_bookings
  FOR UPDATE USING (auth.uid() = user_id);
