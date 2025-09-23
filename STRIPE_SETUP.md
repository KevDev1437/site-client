# Configuration Stripe

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# Stripe Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_XXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXX
```

## Configuration

### En local (développement)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `STRIPE_SECRET_KEY=sk_test_XXXX` (clé de test Stripe)
- `STRIPE_WEBHOOK_SECRET=whsec_XXXX` (secret du webhook local)

### En production (Vercel)
- `NEXT_PUBLIC_SITE_URL=https://<ton-projet>.vercel.app`
- `STRIPE_SECRET_KEY=sk_live_XXXX` (clé live Stripe)
- `STRIPE_WEBHOOK_SECRET=whsec_XXXX` (secret du webhook production)

## Étapes de configuration

1. **Créer un compte Stripe** : https://stripe.com
2. **Récupérer les clés API** dans le dashboard Stripe
3. **Créer des produits et prix** dans Stripe Dashboard
4. **Remplacer les priceStripeId** dans `src/data/workshops.ts` par vos vrais IDs
5. **Configurer les webhooks** pour les notifications de paiement
6. **Tester le webhook** en local avec Stripe CLI

## IDs de prix Stripe

Les workshops utilisent actuellement des IDs d'exemple :
- `price_1QExample1` → Cours de peinture & Apéro
- `price_1QExample2` → Brunch, Paint & Talk
- etc.

Remplacez ces IDs par vos vrais IDs Stripe dans `src/data/workshops.ts`.

## Configuration des Webhooks

### En local (développement)

1. **Installer Stripe CLI** : https://stripe.com/docs/stripe-cli
2. **Se connecter** : `stripe login`
3. **Lancer le webhook** : `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. **Copier la clé** `whsec_...` affichée et l'ajouter à `.env.local`

### En production

1. **Stripe Dashboard** → Developers → Webhooks
2. **Ajouter un endpoint** : `https://votre-domaine.com/api/stripe/webhook`
3. **Sélectionner l'événement** : `checkout.session.completed`
4. **Copier le secret** et l'ajouter aux variables d'environnement Vercel

### Événements gérés

- `checkout.session.completed` : Paiement confirmé
  - Log des informations : email, montant, session ID
  - TODO : Intégration Supabase pour sauvegarder les réservations
