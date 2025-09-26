-- Vérifier la table orders
SELECT COUNT(*) as total_orders FROM orders;
SELECT * FROM orders LIMIT 10;

-- Vérifier la table reservations  
SELECT COUNT(*) as total_reservations FROM reservations;
SELECT * FROM reservations LIMIT 10;

-- Vérifier les workshops
SELECT COUNT(*) as total_workshops FROM workshops;
SELECT id, title, seats, total_seats FROM workshops LIMIT 5;

-- Vérifier la structure de la table orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de la table reservations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'reservations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS pour orders
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'orders';

-- Vérifier les politiques RLS pour reservations
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reservations';
