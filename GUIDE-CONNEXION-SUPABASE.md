# 🔗 Guide de Connexion à Supabase

## 🎯 Comment se Connecter à Supabase

### **1. Accès au Dashboard Supabase**

1. **Allez sur** [supabase.com](https://supabase.com)
2. **Connectez-vous** avec votre compte
3. **Sélectionnez votre projet** (Yapha Creative Studio)
4. **Allez dans l'onglet "SQL Editor"** (icône `</>` dans le menu de gauche)

### **2. Exécuter le Script RLS**

Dans **SQL Editor**, copiez-collez et exécutez ce script :

```sql
-- 🔧 Correction des Politiques RLS
-- Ce script corrige les permissions pour permettre l'accès public

-- 1. Désactiver temporairement RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Workshops are viewable by everyone" ON workshops;
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;

-- 3. Réactiver RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 4. Créer les nouvelles politiques
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

### **3. Vérifier les Données**

Si les données n'existent pas, exécutez aussi le script de seeding :

```sql
-- Copier-coller et exécuter le contenu de supabase-final-seeding.sql
```

### **4. Tester la Correction**

Après avoir exécuté les scripts :
1. **Rafraîchir votre site** (F5)
2. **Vérifier le composant de test** - il devrait afficher ✅
3. **Vérifier la console** - plus d'erreurs `permission denied`

## 🔍 Vérification des Politiques

Pour vérifier que les politiques sont correctement créées, exécutez :

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('products', 'workshops', 'testimonials')
ORDER BY tablename, policyname;
```

Vous devriez voir 3 politiques avec `permissive = true` et `cmd = SELECT`.

## 🎯 Résultat Attendu

Après exécution du script RLS :
- ✅ **Status** : "✅ Connexion Supabase réussie"
- ✅ **Produits** : Nombre > 0, pas d'erreur
- ✅ **Ateliers** : Nombre > 0, pas d'erreur
- ✅ **Témoignages** : Nombre > 0, pas d'erreur

## 🚀 Prochaines Étapes

1. **Exécuter le script RLS** dans Supabase SQL Editor
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
