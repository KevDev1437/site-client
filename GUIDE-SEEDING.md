# 🌱 Guide de Seeding - Données de Test

## 📋 Vue d'Ensemble

Ce guide vous explique comment peupler votre base de données Supabase avec des données de test réalistes pour Yapha Creative Studio.

## 🎯 Données Incluses

### **5 Produits Boutique**
- Coffret Calligraphie Moderne (45€)
- Carnet de Croquis Premium (18€)
- Fil Crochet Bio 100% Coton (12€)
- Set Pinceaux Premium 8 pièces (32€)
- Argile Poterie Naturelle 5kg (28€)

### **3 Ateliers Créatifs**
- Atelier Peinture & Créativité (65€) - 15 mars 2024
- Sculpture sur Argile - Initiation (75€) - 22 mars 2024
- Photographie Créative - Débutant (55€) - 29 mars 2024

### **Témoignages Clients**
- 2 témoignages supplémentaires avec photos

---

## 🚀 Méthodes de Seeding

### **Méthode 1 : Script SQL (Recommandé)**

```bash
# 1. Ouvrir Supabase SQL Editor
# 2. Copier-coller le contenu de supabase-seeding-data.sql
# 3. Exécuter le script
```

**Avantages :**
- ✅ Exécution directe dans Supabase
- ✅ Pas de dépendances Node.js
- ✅ Contrôle total sur les données

### **Méthode 2 : Script Next.js**

```bash
# 1. Installer tsx (si pas déjà fait)
npm install -D tsx

# 2. Exécuter le seeding complet
npm run seed

# 3. Ou seeding par catégorie
npm run seed:products
npm run seed:workshops
npm run seed:testimonials
```

**Avantages :**
- ✅ Automatisation via scripts
- ✅ Vérification des doublons
- ✅ Logs détaillés
- ✅ Résumé des données insérées

---

## 🔧 Configuration Requise

### **Variables d'Environnement**

Vérifiez que ces variables sont configurées dans `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Dépendances (pour script Next.js)**

```bash
# Installer tsx pour exécuter TypeScript
npm install -D tsx

# Ou utiliser npx
npx tsx scripts/seed-database.ts
```

---

## 📊 Vérification des Données

### **Requêtes de Vérification**

```sql
-- Vérifier les produits
SELECT 
    title, 
    price/100 as prix_euros, 
    stock, 
    is_active 
FROM products 
WHERE is_active = true;

-- Vérifier les ateliers
SELECT 
    title, 
    date, 
    price/100 as prix_euros, 
    seats, 
    total_seats,
    published 
FROM workshops 
WHERE published = true;

-- Vérifier les témoignages
SELECT name, rating, is_featured 
FROM testimonials;
```

### **Test dans l'Application**

1. **Page Boutique** : Vérifier que les 5 produits s'affichent
2. **Page Ateliers** : Vérifier que les 3 ateliers s'affichent
3. **Page Témoignages** : Vérifier que les témoignages s'affichent
4. **Hooks** : Tester `useProducts()` et `useAteliers()`

---

## 🎨 Personnalisation des Données

### **Modifier les Produits**

Dans `supabase-seeding-data.sql` ou `scripts/seed-database.ts` :

```typescript
const productsData = [
  {
    id: 'prod_votre_produit',
    title: 'Votre Produit',
    description: 'Description détaillée...',
    price: 2500, // 25.00€ en centimes
    image_url: 'https://votre-image.com',
    stock: 10,
    is_active: true,
    price_stripe_id: 'price_votre_id'
  }
];
```

### **Modifier les Ateliers**

```typescript
const workshopsData = [
  {
    id: 'workshop_votre_atelier',
    slug: 'votre-atelier-slug',
    title: 'Votre Atelier',
    date: '2024-04-15T14:00:00+01:00', // Date future
    location: 'Votre Lieu',
    price: 5000, // 50.00€ en centimes
    seats: 8,
    total_seats: 12,
    // ... autres champs
  }
];
```

---

## 🚨 Points d'Attention

### **⚠️ Gestion des Doublons**

Les scripts vérifient automatiquement l'existence des données :

```typescript
// Vérification automatique
const { data: existingProducts } = await supabase
  .from('products')
  .select('id')
  .limit(1);

if (existingProducts && existingProducts.length > 0) {
  console.log('⚠️ Products already exist, skipping...');
  return;
}
```

### **💰 Prix en Centimes**

Tous les prix sont stockés en centimes (compatible Stripe) :

```typescript
price: 4500, // = 45.00€
price: 1800, // = 18.00€
```

### **📅 Dates Futures**

Les ateliers ont des dates futures pour être visibles :

```typescript
date: '2024-03-15T14:00:00+01:00', // Date future
```

---

## 🔄 Réinitialisation

### **Supprimer les Données de Test**

```sql
-- Supprimer les données de test
DELETE FROM testimonials WHERE name IN ('Camille M.', 'Antoine L.');
DELETE FROM products WHERE id LIKE 'prod_%';
DELETE FROM workshops WHERE id LIKE 'workshop_%';
```

### **Réexécuter le Seeding**

```bash
# Script Next.js
npm run seed

# Ou script SQL
# Copier-coller supabase-seeding-data.sql dans SQL Editor
```

---

## 📈 Monitoring

### **Logs de Seeding**

Le script Next.js affiche des logs détaillés :

```
🌱 Seeding products...
✅ 5 products inserted successfully!
🌱 Seeding workshops...
✅ 3 workshops inserted successfully!
🎉 Database seeding completed successfully!

📊 Summary:
- Products: 5 active products
- Workshops: 3 published workshops
- Total stock: 90 items
- Workshop seats: 24/37 available
```

### **Vérification des Relations**

```sql
-- Vérifier l'intégrité des données
SELECT 
    'Products' as table_name,
    COUNT(*) as count,
    SUM(stock) as total_stock
FROM products 
WHERE is_active = true

UNION ALL

SELECT 
    'Workshops' as table_name,
    COUNT(*) as count,
    SUM(seats) as available_seats
FROM workshops 
WHERE published = true;
```

---

## ✅ Checklist de Validation

- [ ] **Produits** : 5 produits actifs avec stock > 0
- [ ] **Ateliers** : 3 ateliers publiés avec dates futures
- [ ] **Prix** : Tous en centimes (ex: 4500 = 45€)
- [ ] **Images** : URLs d'images valides
- [ ] **Relations** : Hooks `useProducts()` et `useAteliers()` fonctionnent
- [ ] **RLS** : Données visibles publiquement (produits/ateliers)
- [ ] **Performance** : Requêtes rapides avec indexes

**Votre base de données est maintenant prête pour les tests ! 🎉**
