-- Script SQL pour mettre à jour les images des produits
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Coffret Calligraphie
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/coffret-calligraphie/image1.jpg'
WHERE id = '506a44be-16f3-49cb-964b-8084112b28be';

-- 2. Carnet de Croquis
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/carnet-croquis/image1.jpg'
WHERE id = '681e5e96-8792-49b3-a471-9e99de44fa36';

-- 3. Fil Crochet Bio
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/fil-crochet-bio/image1.jpg'
WHERE id = '7c86c59e-e862-4264-92bc-4673c928873c';

-- 4. Set Pinceaux Premium
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/set-pinceaux-premium/image1.jpg'
WHERE id = 'ac089e1e-58c8-441e-9e5e-272046708574';

-- 5. Argile Poterie 2kg
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/argile-poterie/image1.jpg'
WHERE id = 'c7130205-d61a-4fa6-8e7f-8244b0574881';

-- 6. Kit Peinture Aquarelle
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/kit-peinture-aquarelle/image1.jpg'
WHERE id = 'dd76c340-a965-4792-b5c4-849e3d83084e';

-- Vérification des mises à jour
SELECT id, title, image_url FROM products ORDER BY created_at;
