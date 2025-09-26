-- Script pour corriger l'image du carnet de croquis
-- Utilise une image Unsplash qui fonctionne

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
WHERE id = '681e5e96-8792-49b3-a471-9e99de44fa36';

-- Vérification
SELECT id, title, image_url FROM products WHERE id = '681e5e96-8792-49b3-a471-9e99de44fa36';
