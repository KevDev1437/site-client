# 🚨 CORRECTION URGENTE - Politiques RLS

## 🎯 Problème Critique

**Erreur :** `permission denied for schema public`

**Impact :** Les pages ne s'affichent pas du tout car les politiques RLS bloquent l'accès aux tables.

## 🛠️ SOLUTION IMMÉDIATE

### **1. Aller dans Supabase Dashboard**

1. **Ouvrez** [supabase.com](https://supabase.com)
2. **Connectez-vous** à votre compte
3. **Sélectionnez votre projet** Yapha Creative Studio
4. **Cliquez sur "SQL Editor"** (icône `</>` dans le menu de gauche)

### **2. Exécuter ce Script SQL**

**COPIEZ-COLLEZ ET EXÉCUTEZ** ce script dans l'éditeur SQL :

```sql
-- 🚨 CORRECTION URGENTE - Politiques RLS
-- Ce script corrige immédiatement les permissions

-- 1. Désactiver temporairement RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Workshops are viewable by everyone" ON workshops;
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON workshops;
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials;

-- 3. Réactiver RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 4. Créer les nouvelles politiques pour lecture publique
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Workshops are viewable by everyone" ON workshops
    FOR SELECT USING (true);

CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
    FOR SELECT USING (true);

-- 5. Vérifier que les politiques sont créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('products', 'workshops', 'testimonials')
ORDER BY tablename, policyname;
```

### **3. Cliquer sur "Run"**

Après avoir collé le script, **cliquez sur le bouton "Run"** pour l'exécuter.

### **4. Vérifier le Résultat**

Vous devriez voir 3 politiques créées :
- `Products are viewable by everyone`
- `Workshops are viewable by everyone` 
- `Testimonials are viewable by everyone`

## 🎯 Résultat Immédiat

Après exécution du script :
- ✅ **Pages s'affichent** normalement
- ✅ **Données chargées** correctement
- ✅ **Plus d'erreur** `permission denied`
- ✅ **Site fonctionnel** complètement

## 🚀 Si les Données N'Existent Pas

Si après la correction, les compteurs sont à 0, exécutez aussi le script de seeding :

```sql
-- Copier-coller le contenu de supabase-final-seeding.sql
```

## ⚠️ IMPORTANT

**Cette correction est OBLIGATOIRE** pour que votre site fonctionne. Sans cela, les pages ne peuvent pas se charger du tout.

**Exécutez le script maintenant !** 🚨
