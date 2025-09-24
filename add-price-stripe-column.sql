-- Ajouter la colonne price_stripe_id à la table products
ALTER TABLE products 
ADD COLUMN price_stripe_id text;

-- Mettre à jour tous les produits avec le même price_id
UPDATE products 
SET price_stripe_id = 'prod_T7C77KUA68OFUd' 
WHERE is_active = true;

-- Vérifier que la mise à jour a bien fonctionné
SELECT id, title, price_stripe_id 
FROM products 
WHERE price_stripe_id = 'prod_T7C77KUA68OFUd';
