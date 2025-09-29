# 🚀 Guide d'Implémentation - Schéma Supabase Yapha Creative Studio

## 📋 Résumé du Schéma Créé

Après analyse exhaustive de votre code Next.js, j'ai créé un schéma Supabase optimisé qui centralise et corrige toutes les entités identifiées.

### 🎯 **Problèmes Résolus**

1. **✅ Centralisation des commandes** : Une seule table `orders` pour produits ET ateliers
2. **✅ Types ENUM** : Statuts normalisés (`pending`, `paid`, `failed`, `cancelled`)
3. **✅ Contraintes d'intégrité** : FK, CHECK, UNIQUE, CASCADE
4. **✅ Optimisation Stripe** : Prix en centimes, session_id unique
5. **✅ RLS complet** : Sécurité au niveau des lignes
6. **✅ Indexes performants** : Requêtes optimisées
7. **✅ Triggers automatiques** : Gestion du stock et des places

---

## 🗄️ **Tables Créées (6)**

| Table | Description | Relations |
|-------|-------------|-----------|
| `profiles` | Profils utilisateurs étendus | `auth.users` → 1:1 |
| `workshops` | Ateliers créatifs | `orders`, `reservations` |
| `products` | Produits boutique | `orders` |
| `orders` | Commandes unifiées | `profiles`, `workshops`, `products` |
| `reservations` | Réservations ateliers | `profiles`, `workshops` |
| `testimonials` | Témoignages clients | Aucune |

---

## 🔧 **Étapes d'Implémentation**

### **1. Exécution du Script SQL**

```bash
# Dans Supabase SQL Editor
# Copier-coller le contenu de supabase-complete-schema.sql
# Exécuter le script complet
```

### **2. Configuration des Buckets de Stockage**

Créer manuellement dans l'interface Supabase Storage :

```
📁 avatars/          # Avatars utilisateurs
📁 images/           # Images statiques (logo, julie.jpg)
📁 videos/           # Vidéos (cree-ton-moment.mp4)
📁 products/         # Images produits
📁 workshops/        # Images ateliers
```

**Permissions recommandées :**
- `avatars` : Public read, Authenticated write
- `images`, `videos`, `products`, `workshops` : Public read

### **3. Variables d'Environnement**

Vérifier que ces variables sont configurées :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_API_VERSION=2025-08-27.basil
```

---

## 🎨 **Fonctionnalités Avancées Implémentées**

### **🔄 Gestion Automatique du Stock**

```sql
-- Décrémentation automatique lors des commandes
-- Incrémentation lors des annulations
-- Triggers sur orders et reservations
```

### **📊 Vues Optimisées**

- `published_workshops` : Ateliers avec disponibilité
- `active_products` : Produits en stock
- `user_orders_with_details` : Commandes avec détails
- `user_reservations_with_details` : Réservations avec détails

### **🔒 Sécurité RLS**

- Utilisateurs voient uniquement leurs données
- Lecture publique pour produits/ateliers/témoignages
- Protection contre les accès non autorisés

---

## 🚨 **Points d'Attention**

### **⚠️ Migration des Données Existantes**

Si vous avez déjà des données :

1. **Sauvegarder** vos données actuelles
2. **Exporter** les données importantes
3. **Exécuter** le nouveau schéma
4. **Réimporter** les données avec les nouveaux formats

### **🔧 Ajustements Nécessaires**

1. **Prix en centimes** : Convertir `25.00€` → `2500`
2. **Statuts normalisés** : Utiliser les ENUM créés
3. **Relations FK** : Vérifier les IDs existants

---

## 📈 **Optimisations de Performance**

### **Indexes Créés (15)**

```sql
-- Requêtes fréquentes optimisées
idx_workshops_published_date    -- Ateliers publiés par date
idx_products_active             -- Produits actifs
idx_orders_user_status          -- Commandes utilisateur
idx_reservations_user_workshop  -- Réservations uniques
```

### **Contraintes de Performance**

- **UNIQUE** sur `stripe_session_id` (évite les doublons)
- **CHECK** sur les montants positifs
- **CASCADE** sur les suppressions (intégrité)

---

## 🧪 **Tests Recommandés**

### **1. Tests de Base**

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies WHERE schemaname = 'public';
```

### **2. Tests Fonctionnels**

```javascript
// Test création de profil
const { data, error } = await supabase
  .from('profiles')
  .insert({ id: user.id, full_name: 'Test User' });

// Test récupération ateliers
const { data: workshops } = await supabase
  .from('published_workshops')
  .select('*');
```

### **3. Tests Stripe**

```javascript
// Test webhook avec données de test
const testSession = {
  id: 'cs_test_123',
  amount_total: 5000,
  currency: 'eur',
  metadata: {
    type: 'workshop',
    userId: 'test-user-id',
    workshopId: 'workshop-id'
  }
};
```

---

## 🔄 **Migration depuis l'Ancien Schéma**

### **Script de Migration (si nécessaire)**

```sql
-- Exemple de migration des prix
UPDATE products SET price = price * 100; -- Convertir en centimes
UPDATE workshops SET price = price * 100;

-- Exemple de migration des statuts
UPDATE orders SET status = 'paid' WHERE status = 'completed';
UPDATE reservations SET status = 'confirmed' WHERE status = 'active';
```

---

## 📚 **Documentation des Relations**

### **Schéma Relationnel**

```
auth.users (1) ←→ (1) profiles
    ↓
    ├── (1:N) orders ←→ (1) workshops
    ├── (1:N) orders ←→ (1) products  
    └── (1:N) reservations ←→ (1) workshops

testimonials (isolé)
```

### **Flux de Données**

1. **Inscription** → `profiles` créé automatiquement
2. **Achat produit** → `orders` + décrémentation `products.stock`
3. **Réservation atelier** → `orders` + `reservations` + décrémentation `workshops.seats`
4. **Webhook Stripe** → Mise à jour statuts automatique

---

## 🎉 **Résultat Final**

Votre schéma Supabase est maintenant :

- ✅ **Cohérent** avec votre code Next.js
- ✅ **Optimisé** pour Stripe (prix en centimes)
- ✅ **Sécurisé** avec RLS complet
- ✅ **Performant** avec indexes appropriés
- ✅ **Évolutif** avec contraintes d'intégrité
- ✅ **Documenté** avec commentaires SQL

**Prêt pour la production ! 🚀**
