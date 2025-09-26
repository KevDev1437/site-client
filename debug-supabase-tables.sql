-- Vérifier l'existence des tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'reservations', 'workshops', 'products');

-- Vérifier la structure de la table orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- Vérifier la structure de la table reservations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'reservations' 
AND table_schema = 'public';

-- Vérifier les données dans orders
SELECT COUNT(*) as total_orders FROM orders;
SELECT * FROM orders LIMIT 5;

-- Vérifier les données dans reservations
SELECT COUNT(*) as total_reservations FROM reservations;
SELECT * FROM reservations LIMIT 5;

-- Vérifier les workshops
SELECT COUNT(*) as total_workshops FROM workshops;
SELECT id, title, seats FROM workshops LIMIT 5;

-- Vérifier les products
SELECT COUNT(*) as total_products FROM products;
SELECT id, title, stock FROM products LIMIT 5;

