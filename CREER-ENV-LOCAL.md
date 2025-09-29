# 🔧 Création du Fichier .env.local

## 🚨 Problème Identifié

Votre projet **n'a pas de fichier `.env.local`** ! C'est la cause des erreurs `{}` dans vos hooks.

## 📝 Solution : Créer le Fichier .env.local

### **Étape 1 : Créer le Fichier**

Créez un fichier nommé `.env.local` à la racine de votre projet (même niveau que `package.json`).

### **Étape 2 : Ajouter la Configuration**

Copiez-collez ce contenu dans votre fichier `.env.local` :

```env
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nhfmaxdkecahngnsczsn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Configuration Stripe (si nécessaire)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### **Étape 3 : Remplacer les Valeurs**

1. **Récupérez vos clés Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Ouvrez votre projet
   - Allez dans **Settings > API**
   - Copiez l'**URL** et la **clé anon**

2. **Remplacez dans le fichier** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Étape 4 : Redémarrer le Serveur**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 🧪 Test de Validation

Après avoir créé le fichier, testez :

```bash
# Exécuter le diagnostic
npx tsx debug-supabase-connection.ts
```

Vous devriez voir :
```
✅ SUPABASE_URL: Définie
✅ SUPABASE_ANON_KEY: Définie
✅ Connexion Supabase réussie
```

## 📋 Structure du Fichier

Votre projet devrait avoir cette structure :
```
site-client-1/
├── .env.local          ← NOUVEAU FICHIER À CRÉER
├── package.json
├── src/
└── ...
```

## ⚠️ Points Importants

1. **Nom exact** : `.env.local` (avec le point au début)
2. **Emplacement** : À la racine du projet
3. **Pas de guillemets** : `NEXT_PUBLIC_SUPABASE_URL=https://...` (pas de guillemets)
4. **Redémarrage** : Obligatoire après création/modification

## 🎯 Résultat Attendu

Après création du fichier `.env.local` :
- ✅ Les hooks `useProducts()` et `useAteliers()` fonctionneront
- ✅ Les données se chargeront correctement
- ✅ Plus d'erreurs `{}` dans la console

## 🚀 Prochaines Étapes

1. **Créer le fichier `.env.local`** avec vos vraies clés
2. **Redémarrer le serveur** de développement
3. **Tester** avec le diagnostic
4. **Vérifier** que les données s'affichent

**Le problème sera résolu dès que vous aurez créé ce fichier !** 🎉
