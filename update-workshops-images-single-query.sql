-- Script SQL compact pour mettre à jour toutes les images d'ateliers en une seule requête
-- Exécutez ce script dans l'éditeur SQL de Supabase

UPDATE workshops 
SET cover_url = CASE 
  WHEN id = '1e81ae91-df00-45ea-b837-c7f7e2c9f696' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-peinture-creativite/cover.jpg'
  WHEN id = '37f9aa08-7c6a-456c-91ff-f8fba36fdf0c' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-sculpture-argile/cover.jpg'
  WHEN id = 'f3171972-c5ca-43c0-ad4f-cd20f4c0ccfd' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-debutant/cover.jpg'
  WHEN id = 'f3171972-c5ca-43c0-ad4f-cd20f4c0ccff' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-expert/cover.jpg'
  ELSE cover_url
END;

-- Vérification des mises à jour
SELECT id, title, cover_url FROM workshops ORDER BY created_at;

