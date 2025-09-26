-- Script SQL compact pour mettre à jour toutes les images en une seule requête
-- Exécutez ce script dans l'éditeur SQL de Supabase

UPDATE products 
SET image_url = CASE 
  WHEN id = '506a44be-16f3-49cb-964b-8084112b28be' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/coffret-calligraphie/image1.jpg'
  WHEN id = '681e5e96-8792-49b3-a471-9e99de44fa36' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/carnet-croquis/image1.jpg'
  WHEN id = '7c86c59e-e862-4264-92bc-4673c928873c' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/fil-crochet-bio/image1.jpg'
  WHEN id = 'ac089e1e-58c8-441e-9e5e-272046708574' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/set-pinceaux-premium/image1.jpg'
  WHEN id = 'c7130205-d61a-4fa6-8e7f-8244b0574881' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/argile-poterie/image1.jpg'
  WHEN id = 'dd76c340-a965-4792-b5c4-849e3d83084e' THEN 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/kit-peinture-aquarelle/image1.jpg'
  ELSE image_url
END;

-- Vérification des mises à jour
SELECT id, title, image_url FROM products ORDER BY created_at;
