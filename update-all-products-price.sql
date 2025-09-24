-- Mettre à jour tous les produits avec le même price_id
UPDATE products 
SET price_stripe_id = 'price_1VRAI_ID_STRIPE' 
WHERE is_active = true;

-- Vérifier que la mise à jour a bien fonctionné
SELECT id, title, price_stripe_id 
FROM products 
WHERE price_stripe_id = 'price_1VRAI_ID_STRIPE';
