# 🔧 Résolution du Problème RLS

## 🚨 Problème Identifié

**Erreur :** `permission denied for schema public`

**Cause :** Les politiques Row Level Security (RLS) bloquent l'accès aux tables.

## 🛠️ Solution Étape par Étape

### **Étape 1 : Exécuter le Script de Correction RLS**

Dans **Supabase SQL Editor**, copiez-collez et exécutez le contenu de `fix-rls-policies.sql` :

```sql
-- Désactiver temporairement RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Workshops are viewable by everyone" ON workshops;
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;

-- Réactiver RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Workshops are viewable by everyone" ON workshops
    FOR SELECT USING (true);

CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
    FOR SELECT USING (true);
```

### **Étape 2 : Vérifier les Données**

Exécutez le contenu de `check-data-exists.sql` pour vérifier que les données existent :

```sql
-- Vérifier les produits
SELECT COUNT(*) as products_count FROM products WHERE is_active = true;

-- Vérifier les ateliers
SELECT COUNT(*) as workshops_count FROM workshops WHERE published = true;

-- Vérifier les témoignages
SELECT COUNT(*) as testimonials_count FROM testimonials;
```

### **Étape 3 : Si les Données N'Existent Pas**

Si les compteurs sont à 0, exécutez le script de seeding :

```sql
-- Copier-coller et exécuter le contenu de supabase-final-seeding.sql
```

### **Étape 4 : Tester la Correction**

1. **Rafraîchir votre site** (F5)
2. **Vérifier le composant de test** - il devrait maintenant afficher ✅
3. **Vérifier la console** - plus d'erreurs `{}`

## 🎯 Résultat Attendu

Après correction des politiques RLS :
- ✅ **Produits** : Nombre > 0, pas d'erreur
- ✅ **Ateliers** : Nombre > 0, pas d'erreur  
- ✅ **Témoignages** : Nombre > 0, pas d'erreur
- ✅ **Status** : "✅ Connexion Supabase réussie"

## 🔍 Vérification des Politiques

Pour vérifier que les politiques sont correctement créées :

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('products', 'workshops', 'testimonials')
ORDER BY tablename, policyname;
```

Vous devriez voir 3 politiques avec `permissive = true` et `cmd = SELECT`.

## 🚀 Prochaines Étapes

1. **Exécuter le script RLS** dans Supabase
2. **Vérifier les données** avec le script de vérification
3. **Si nécessaire, exécuter le seeding**
4. **Tester sur votre site**
5. **Supprimer le composant de test** une fois que tout fonctionne

## 🧹 Nettoyage

Une fois que tout fonctionne, supprimez le composant de test :

```typescript
// Dans src/app/page.tsx, supprimer :
import TestSupabase from '@/components/TestSupabase';
// Et la section :
<div className="py-8 px-6">
  <TestSupabase />
</div>
```

**Le problème sera résolu après l'exécution du script RLS !** 🎉
