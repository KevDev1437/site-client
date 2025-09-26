-- Script pour utiliser des images temporaires en attendant
-- Utilise des images Unsplash différentes pour chaque produit

UPDATE products 
SET image_url = CASE 
  WHEN id = '506a44be-16f3-49cb-964b-8084112b28be' THEN 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
  WHEN id = '681e5e96-8792-49b3-a471-9e99de44fa36' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
  WHEN id = '7c86c59e-e862-4264-92bc-4673c928873c' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
  WHEN id = 'ac089e1e-58c8-441e-9e5e-272046708574' THEN 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop'
  WHEN id = 'c7130205-d61a-4fa6-8e7f-8244b0574881' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  WHEN id = 'dd76c340-a965-4792-b5c4-849e3d83084e' THEN 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
  ELSE image_url
END;

-- Vérification des mises à jour
SELECT id, title, image_url FROM products ORDER BY created_at;
