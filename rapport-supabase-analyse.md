# Rapport d'Analyse Supabase - Site Client Yapha Creative Studio

## 📊 Résumé Exécutif

Ce rapport présente une analyse exhaustive de l'utilisation de Supabase dans le code du site client Yapha Creative Studio. L'analyse révèle **6 tables principales**, **3 buckets de stockage**, et de nombreuses relations implicites entre les entités.

---

## 🗄️ Tables Identifiées

### 1. **`profiles`** - Profils utilisateurs
**Utilisation :** Gestion des profils utilisateurs étendus
**Colonnes utilisées :**
- `id` (PK, UUID, lié à auth.users.id)
- `full_name` (string, nullable)
- `bio` (text, nullable) 
- `phone` (string, nullable)
- `avatar_url` (string, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Opérations :**
- **SELECT :** `profiles.*` (récupération complète du profil)
- **UPDATE :** `full_name`, `bio`, `phone`, `avatar_url`, `updated_at`
- **DELETE :** Suppression par `id` lors de la suppression de compte

### 2. **`products`** - Catalogue de produits
**Utilisation :** Gestion du catalogue boutique
**Colonnes utilisées :**
- `id` (PK, UUID)
- `title` (string)
- `description` (text, nullable)
- `price` (decimal/numeric)
- `image_url` (string, nullable)
- `stock` (integer)
- `is_active` (boolean, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `price_stripe_id` (string, nullable)

**Opérations :**
- **SELECT :** `products.*` (liste complète), `id, stock, title` (webhook)
- **UPDATE :** `stock` (décrémentation), `price_stripe_id` (mise à jour prix)
- **Relations :** Lié à `orders.product_id`

### 3. **`workshops`** - Ateliers créatifs
**Utilisation :** Gestion des ateliers et réservations
**Colonnes utilisées :**
- `id` (PK, UUID)
- `slug` (string, unique)
- `title` (string)
- `date` (timestamp)
- `location` (string)
- `price` (decimal/numeric)
- `seats` (integer, places disponibles)
- `total_seats` (integer, places totales)
- `price_stripe_id` (string, nullable)
- `cover_url` (string, nullable)
- `excerpt` (text, nullable)
- `description` (text, nullable)
- `published` (boolean)
- `created_at` (timestamp)

**Opérations :**
- **SELECT :** `workshops.*`, `id, slug, title, date, location, price, seats, price_stripe_id, cover_url, excerpt`
- **UPDATE :** `seats` (décrémentation), `price_stripe_id`
- **Relations :** Lié à `reservations.workshop_id` et `orders.workshop_id`

### 4. **`orders`** - Commandes et achats
**Utilisation :** Historique des transactions Stripe
**Colonnes utilisées :**
- `id` (PK, UUID)
- `user_id` (FK vers profiles.id)
- `workshop_id` (FK vers workshops.id, nullable)
- `product_id` (FK vers products.id, nullable)
- `stripe_session_id` (string)
- `amount` (integer, en centimes)
- `currency` (string, ex: 'eur')
- `status` (string, enum)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Opérations :**
- **INSERT :** Création lors des webhooks Stripe
- **SELECT :** Avec relations `workshop:workshops(title, date)`, `product:products(title, price)`
- **DELETE :** Suppression par `user_id` lors de la suppression de compte

### 5. **`reservations`** - Réservations d'ateliers
**Utilisation :** Gestion des réservations d'ateliers
**Colonnes utilisées :**
- `id` (PK, UUID)
- `user_id` (FK vers profiles.id)
- `workshop_id` (FK vers workshops.id)
- `stripe_session_id` (string, nullable)
- `status` (string, enum)
- `created_at` (timestamp)

**Opérations :**
- **INSERT :** Création lors des webhooks Stripe
- **SELECT :** Avec relation `workshop:workshops(id, title, date, location, cover_url)`
- **DELETE :** Suppression par `user_id` lors de la suppression de compte

### 6. **`testimonials`** - Témoignages clients
**Utilisation :** Affichage des témoignages
**Colonnes utilisées :**
- `*` (toutes les colonnes via SELECT *)

**Opérations :**
- **SELECT :** `testimonials.*` (récupération complète)

---

## 🗂️ Buckets de Stockage Supabase

### 1. **`images`** - Images statiques
**Utilisation :** Logo, images de fond, photos de produits
**Fichiers identifiés :**
- `logo.png`
- `julie.jpg`
- Images de produits (dynamiques)

### 2. **`avatars`** - Avatars utilisateurs
**Utilisation :** Photos de profil des utilisateurs
**Opérations :**
- **UPLOAD :** `avatars.upload(filePath, file, { upsert: true })`
- **GET_URL :** `avatars.getPublicUrl(filePath)`

### 3. **`videos`** - Vidéos
**Utilisation :** Contenu vidéo
**Fichiers identifiés :**
- `cree-ton-moment.mp4`

---

## 🔗 Relations Implicites Identifiées

### Relations Principales
1. **`profiles.id` ↔ `orders.user_id`** (1:N)
2. **`profiles.id` ↔ `reservations.user_id`** (1:N)
3. **`workshops.id` ↔ `reservations.workshop_id`** (1:N)
4. **`workshops.id` ↔ `orders.workshop_id`** (1:N, nullable)
5. **`products.id` ↔ `orders.product_id`** (1:N, nullable)

### Relations de Contraintes
- **`orders`** : Soit `workshop_id` OU `product_id` doit être défini (pas les deux)
- **`reservations`** : Toujours lié à un `workshop_id`
- **`orders`** : Peut être lié à un atelier OU un produit

---

## 📋 Enums et Statuts Identifiés

### Statuts des Commandes (`orders.status`)
- `'pending'` - En attente
- `'paid'` - Payé ✅
- `'failed'` - Échoué
- `'cancelled'` - Annulé

### Statuts des Réservations (`reservations.status`)
- `'confirmed'` - Confirmé ✅
- `'pending'` - En attente (implicite)

### Statuts d'Authentification
- `'loading'` - Chargement
- `'success'` - Succès
- `'error'` - Erreur

---

## 🏗️ Indexes et Contraintes Recommandés

### Indexes de Performance
```sql
-- Indexes pour les requêtes fréquentes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_workshop_id ON reservations(workshop_id);
CREATE INDEX idx_workshops_published ON workshops(published);
CREATE INDEX idx_workshops_date ON workshops(date);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_stock ON products(stock);
```

### Contraintes de Données
```sql
-- Contraintes de clés étrangères
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_orders_workshop_id 
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT fk_orders_product_id 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

ALTER TABLE reservations ADD CONSTRAINT fk_reservations_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE reservations ADD CONSTRAINT fk_reservations_workshop_id 
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE;
```

### Contraintes de Validation
```sql
-- Contraintes de validation des données
ALTER TABLE orders ADD CONSTRAINT chk_orders_amount_positive 
  CHECK (amount > 0);

ALTER TABLE orders ADD CONSTRAINT chk_orders_currency 
  CHECK (currency IN ('eur', 'usd'));

ALTER TABLE orders ADD CONSTRAINT chk_orders_status 
  CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'));

ALTER TABLE reservations ADD CONSTRAINT chk_reservations_status 
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

ALTER TABLE workshops ADD CONSTRAINT chk_workshops_seats_positive 
  CHECK (seats >= 0);

ALTER TABLE products ADD CONSTRAINT chk_products_stock_positive 
  CHECK (stock >= 0);

ALTER TABLE products ADD CONSTRAINT chk_products_price_positive 
  CHECK (price > 0);
```

### Contraintes d'Unicité
```sql
-- Contraintes d'unicité
ALTER TABLE workshops ADD CONSTRAINT uk_workshops_slug UNIQUE (slug);
ALTER TABLE orders ADD CONSTRAINT uk_orders_stripe_session_id UNIQUE (stripe_session_id);
```

---

## 🔒 Politiques RLS Recommandées

### Table `profiles`
```sql
-- Les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Table `orders`
```sql
-- Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

### Table `reservations`
```sql
-- Les utilisateurs peuvent voir leurs propres réservations
CREATE POLICY "Users can view own reservations" ON reservations
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 📈 Métriques d'Utilisation

### Fréquence d'Accès par Table
1. **`products`** - Très fréquent (boutique, API)
2. **`workshops`** - Très fréquent (ateliers, API)
3. **`orders`** - Fréquent (profil utilisateur, webhooks)
4. **`reservations`** - Fréquent (profil utilisateur, webhooks)
5. **`profiles`** - Moyen (profil utilisateur)
6. **`testimonials`** - Faible (page témoignages)

### Opérations par Table
- **SELECT** : Toutes les tables (lecture)
- **INSERT** : `orders`, `reservations` (webhooks Stripe)
- **UPDATE** : `profiles`, `products`, `workshops` (mise à jour données)
- **DELETE** : `profiles`, `orders`, `reservations` (suppression compte)

---

## 🚨 Points d'Attention

### Sécurité
1. **RLS activé** sur toutes les tables sensibles
2. **Validation des données** côté client ET serveur
3. **Gestion des erreurs** dans les webhooks Stripe

### Performance
1. **Index manquants** sur les colonnes de jointure
2. **Requêtes N+1** potentielles dans les relations
3. **Cache** recommandé pour les produits/ateliers

### Intégrité
1. **Contraintes de clés étrangères** à implémenter
2. **Validation des statuts** avec des enums
3. **Gestion des suppressions en cascade**

---

## 📝 Recommandations d'Amélioration

### Court Terme
1. Ajouter les indexes de performance
2. Implémenter les contraintes de validation
3. Configurer les politiques RLS

### Moyen Terme
1. Optimiser les requêtes avec jointures
2. Implémenter un système de cache
3. Ajouter des logs de monitoring

### Long Terme
1. Migration vers des enums PostgreSQL
2. Implémentation d'un système d'audit
3. Optimisation des requêtes complexes

---

*Rapport généré le : ${new Date().toLocaleDateString('fr-FR')}*
*Version du code analysé : Dernière version du repository*
