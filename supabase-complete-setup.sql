-- Script complet pour configurer Supabase avec toutes les tables et permissions

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activer RLS sur profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Politiques RLS pour profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Créer la table user_purchases
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS pour user_purchases
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON user_purchases;
CREATE POLICY "Users can view own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Créer la table workshop_bookings
CREATE TABLE IF NOT EXISTS workshop_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID,
  workshop_name TEXT NOT NULL,
  workshop_date TIMESTAMP WITH TIME ZONE NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  price DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RLS pour workshop_bookings
ALTER TABLE workshop_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookings" ON workshop_bookings;
CREATE POLICY "Users can view own bookings" ON workshop_bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON workshop_bookings;
CREATE POLICY "Users can insert own bookings" ON workshop_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON workshop_bookings;
CREATE POLICY "Users can update own bookings" ON workshop_bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- 8. Trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, bio, avatar_url, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Fonction pour supprimer un utilisateur
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Supprimer les données liées
  DELETE FROM user_purchases WHERE user_id = user_id;
  DELETE FROM workshop_bookings WHERE user_id = user_id;
  DELETE FROM profiles WHERE id = user_id;
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- 11. Permissions pour delete_user
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- 12. Créer le bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 13. Politiques RLS pour storage
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
