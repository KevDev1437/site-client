-- Script pour configurer le bucket 'videos' dans Supabase Storage (optionnel)

-- 1. Créer le bucket pour les vidéos du site
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800, -- 50MB limit pour les vidéos
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer toutes les politiques existantes sur storage.objects pour le bucket videos
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- 3. Créer les nouvelles politiques RLS pour le bucket videos
CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' 
    AND auth.role() = 'authenticated'
  );

-- 4. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'videos';

-- 5. Instructions pour uploader la vidéo :
-- - Aller dans Supabase Dashboard > Storage > images (ou videos)
-- - Cliquer sur "Upload file"
-- - Sélectionner votre vidéo "cree-ton-moment.mp4"
-- - La vidéo sera accessible via l'URL publique
