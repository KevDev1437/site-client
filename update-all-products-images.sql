-- Mettre à jour toutes les images des produits avec la même URL
UPDATE products 
SET image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/logo.png'
WHERE is_active = true;

-- Vérifier que la mise à jour a bien fonctionné
SELECT id, title, image_url 
FROM products 
WHERE image_url = 'https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/logo.png';
