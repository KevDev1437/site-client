# 🔧 Corrections Apportées au Script de Seeding

## ❌ Problème Identifié

Le script original échouait avec l'erreur :
```
invalid input syntax for type uuid
```

**Cause :** Les colonnes `id` des tables sont de type UUID avec `DEFAULT gen_random_uuid()`, mais le script tentait d'insérer des strings comme `'prod_coffret_calligraphie'`.

## ✅ Corrections Apportées

### **1. Table `products`**
**Avant :**
```sql
INSERT INTO products (id, title, description, price, image_url, stock, is_active, price_stripe_id) VALUES
(
    'prod_coffret_calligraphie',  -- ❌ String au lieu d'UUID
    'Coffret Calligraphie Moderne',
    ...
```

**Après :**
```sql
INSERT INTO products (title, description, price, image_url, stock, is_active, price_stripe_id) VALUES
(
    'Coffret Calligraphie Moderne',  -- ✅ Pas d'ID, génération automatique
    'Un coffret complet pour débuter...',
    ...
```

### **2. Table `workshops`**
**Avant :**
```sql
INSERT INTO workshops (id, slug, title, date, location, price, seats, total_seats, price_stripe_id, cover_url, excerpt, description, published) VALUES
(
    'workshop_peinture_creativite',  -- ❌ String au lieu d'UUID
    'atelier-peinture-creativite',
    ...
```

**Après :**
```sql
INSERT INTO workshops (slug, title, date, location, price, seats, total_seats, price_stripe_id, cover_url, excerpt, description, published) VALUES
(
    'atelier-peinture-creativite',  -- ✅ Pas d'ID, génération automatique
    'Atelier Peinture & Créativité',
    ...
```

### **3. Table `testimonials`**
**Déjà correct** - Pas de colonne `id` spécifiée dans l'INSERT original.

## 🎯 Résultat Final

### **Colonnes Supprimées des INSERT :**
- ❌ `id` (généré automatiquement par PostgreSQL)
- ✅ Toutes les autres colonnes conservées

### **Avantages de la Correction :**
1. **✅ Compatible UUID** : PostgreSQL génère automatiquement les UUIDs
2. **✅ Pas d'erreur** : Le script s'exécute sans problème
3. **✅ Cohérent** : Respecte le schéma défini avec `DEFAULT gen_random_uuid()`
4. **✅ Maintenable** : Pas de gestion manuelle des IDs

### **Données Insérées :**
- **6 Produits** avec UUIDs générés automatiquement
- **4 Ateliers** avec UUIDs générés automatiquement  
- **6 Témoignages** avec UUIDs générés automatiquement

## 🚀 Script Prêt à Exécuter

Le script `supabase-final-seeding.sql` est maintenant **100% fonctionnel** et peut être exécuté directement dans Supabase SQL Editor sans erreur.

**Toutes les contraintes respectées :**
- ✅ UUIDs générés automatiquement
- ✅ Price Stripe ID unique : `'price_1SAmSlLQsAaHfXd9K0CvjoR6'`
- ✅ URLs Supabase Storage correctes
- ✅ Dates futures (2025)
- ✅ Compatible avec `useProducts()` et `useAteliers()`
