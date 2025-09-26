-- Script SQL pour mettre à jour les images des ateliers
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Atelier Peinture & Créativité
UPDATE workshops 
SET cover_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-peinture-creativite/cover.jpg'
WHERE id = '1e81ae91-df00-45ea-b837-c7f7e2c9f696';

-- 2. Atelier Sculpture en Argile
UPDATE workshops 
SET cover_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-sculpture-argile/cover.jpg'
WHERE id = '37f9aa08-7c6a-456c-91ff-f8fba36fdf0c';

-- 3. Atelier Photographie Débutant
UPDATE workshops 
SET cover_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-debutant/cover.jpg'
WHERE id = 'f3171972-c5ca-43c0-ad4f-cd20f4c0ccfd';

-- 4. Atelier Photographie Expert
UPDATE workshops 
SET cover_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-expert/cover.jpg'
WHERE id = 'f3171972-c5ca-43c0-ad4f-cd20f4c0ccff';

-- Vérification des mises à jour
SELECT id, title, cover_url FROM workshops ORDER BY created_at;
