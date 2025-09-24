-- Créer la table produits
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insérer des produits d'exemple
INSERT INTO products (title, description, price, image_url, stock) VALUES
(
  'Kit Peinture Aquarelle',
  'Kit complet pour débuter la peinture aquarelle avec tous les accessoires nécessaires',
  29.99,
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
  10
),
(
  'Set Pinceaux Premium',
  'Collection de pinceaux de qualité professionnelle pour tous vos projets artistiques',
  24.99,
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
  15
),
(
  'Carnet de Croquis',
  'Carnet de croquis premium avec papier de qualité pour vos dessins et esquisses',
  15.99,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  20
),
(
  'Argile Poterie 2kg',
  'Argile naturelle de qualité pour la poterie et le modelage',
  18.99,
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
  8
),
(
  'Fil Crochet Bio',
  'Fil de crochet en coton biologique, doux et résistant',
  12.99,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
  25
),
(
  'Coffret Calligraphie',
  'Coffret complet pour apprendre la calligraphie avec guides et accessoires',
  35.99,
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
  5
);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_stock ON products(stock);

-- Activer RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion/modification aux utilisateurs authentifiés
CREATE POLICY "Products can be managed by authenticated users" ON products
  FOR ALL USING (auth.role() = 'authenticated');
