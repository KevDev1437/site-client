# Configuration Stripe

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# Stripe Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_XXXX
```

## Configuration

### En local (développement)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `STRIPE_SECRET_KEY=sk_test_XXXX` (clé de test Stripe)

### En production (Vercel)
- `NEXT_PUBLIC_SITE_URL=https://<ton-projet>.vercel.app`
- `STRIPE_SECRET_KEY=sk_live_XXXX` (clé live Stripe)

## Étapes de configuration

1. **Créer un compte Stripe** : https://stripe.com
2. **Récupérer les clés API** dans le dashboard Stripe
3. **Créer des produits et prix** dans Stripe Dashboard
4. **Remplacer les priceStripeId** dans `src/data/workshops.ts` par vos vrais IDs
5. **Configurer les webhooks** (optionnel pour les notifications)

## IDs de prix Stripe

Les workshops utilisent actuellement des IDs d'exemple :
- `price_1QExample1` → Cours de peinture & Apéro
- `price_1QExample2` → Brunch, Paint & Talk
- etc.

Remplacez ces IDs par vos vrais IDs Stripe dans `src/data/workshops.ts`.
