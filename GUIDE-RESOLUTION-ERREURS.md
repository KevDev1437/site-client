# 🔧 Guide de Résolution des Erreurs Supabase

## 🚨 Problème Identifié

Les hooks `useProducts()` et `useAteliers()` échouent avec des erreurs vides `{}`, ce qui indique un problème de connexion ou de configuration Supabase.

## 🔍 Diagnostic Étape par Étape

### **1. Vérifier les Variables d'Environnement**

Vérifiez que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://nhfmaxdkecahngnsczsn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Test :** Redémarrez votre serveur de développement après modification.

### **2. Vérifier que les Données Existent**

Exécutez ce script de diagnostic :

```bash
# Installer tsx si nécessaire
npm install -D tsx

# Exécuter le diagnostic
npx tsx debug-supabase-connection.ts
```

### **3. Vérifier les Politiques RLS**

Dans Supabase SQL Editor, vérifiez que les politiques RLS sont correctes :

```sql
-- Vérifier les politiques pour products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

-- Vérifier les politiques pour workshops  
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'workshops';
```

### **4. Tester les Requêtes Directement**

Dans Supabase SQL Editor, testez :

```sql
-- Test produits
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Test ateliers
SELECT COUNT(*) FROM workshops WHERE published = true;

-- Test avec RLS
SELECT * FROM products LIMIT 1;
SELECT * FROM workshops LIMIT 1;
```

## 🛠️ Solutions Proposées

### **Solution 1 : Hooks Améliorés**

Remplacez vos hooks par les versions corrigées :

```typescript
// Remplacer src/hooks/useProducts.ts par src/hooks/useProducts-fixed.ts
// Remplacer src/hooks/useAteliers.ts par src/hooks/useAteliers-fixed.ts
```

Les hooks corrigés incluent :
- ✅ Logs détaillés pour le debugging
- ✅ Gestion d'erreurs améliorée
- ✅ Vérification des données nulles

### **Solution 2 : Vérifier la Configuration Supabase**

1. **URL Supabase** : Vérifiez que l'URL est correcte
2. **Clé Anon** : Vérifiez que la clé est valide
3. **Projet actif** : Vérifiez que le projet Supabase est actif

### **Solution 3 : Réexécuter le Seeding**

Si les données n'existent pas :

```sql
-- Dans Supabase SQL Editor
-- Copier-coller et exécuter supabase-final-seeding.sql
```

### **Solution 4 : Vérifier les Politiques RLS**

Assurez-vous que les politiques permettent la lecture publique :

```sql
-- Politique pour products (lecture publique)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Politique pour workshops (lecture publique)  
CREATE POLICY "Workshops are viewable by everyone" ON workshops
    FOR SELECT USING (true);
```

## 🧪 Tests de Validation

### **Test 1 : Connexion Basique**

```typescript
// Dans votre composant
useEffect(() => {
  const testConnection = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      console.log('Test connexion:', { data, error });
    } catch (err) {
      console.error('Erreur connexion:', err);
    }
  };
  
  testConnection();
}, []);
```

### **Test 2 : Données Spécifiques**

```typescript
// Test direct des requêtes
const testData = async () => {
  const supabase = createClient();
  
  // Test produits
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
  
  console.log('Produits:', { products, productsError });
  
  // Test ateliers
  const { data: workshops, error: workshopsError } = await supabase
    .from('workshops')
    .select('*')
    .eq('published', true);
    
  console.log('Ateliers:', { workshops, workshopsError });
};
```

## 📋 Checklist de Résolution

- [ ] **Variables d'environnement** définies et correctes
- [ ] **Serveur redémarré** après modification des variables
- [ ] **Données insérées** via le script de seeding
- [ ] **Politiques RLS** configurées pour lecture publique
- [ ] **Hooks corrigés** avec logs détaillés
- [ ] **Console du navigateur** vérifiée pour les erreurs
- [ ] **Réseau** vérifié (pas de blocage CORS)

## 🚀 Script de Test Rapide

Créez un composant de test :

```typescript
// TestSupabase.tsx
'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const test = async () => {
      try {
        const supabase = createClient();
        
        // Test produits
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);
        
        // Test ateliers
        const { data: workshops, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .limit(1);
        
        setStatus(`
          Produits: ${products?.length || 0} (${productsError ? 'ERROR' : 'OK'})
          Ateliers: ${workshops?.length || 0} (${workshopsError ? 'ERROR' : 'OK'})
        `);
      } catch (err) {
        setStatus(`Erreur: ${err}`);
      }
    };
    
    test();
  }, []);

  return <div>{status}</div>;
}
```

## 🎯 Résultat Attendu

Après application des corrections :
- ✅ Les hooks chargent les données sans erreur
- ✅ Les produits s'affichent dans la boutique
- ✅ Les ateliers s'affichent dans la section ateliers
- ✅ Les logs de la console montrent le chargement réussi

**Si le problème persiste, vérifiez les logs de la console pour des messages d'erreur plus spécifiques.**
