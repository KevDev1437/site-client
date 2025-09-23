# Configuration Stripe

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# Stripe Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_XXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXX

# Stripe API Version (optionnel)
# Si non défini, Stripe utilise la version par défaut liée à la clé API
# STRIPE_API_VERSION=2025-08-27.basil

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nhfmaxdkecahngnsczsn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDgzNjUsImV4cCI6MjA3NDIyNDM2NX0.3RnJIHR-AXgL2iXzthuDDY60OuBTwWICRpWUVt471SM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODY0ODM2NSwiZXhwIjoyMDc0MjI0MzY1fQ.placeholder-service-key
```

## Configuration

### Variables d'environnement Supabase

**Variables NEXT_PUBLIC_ (côté client)** :
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase (visible côté client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase (visible côté client)

**Variables serveur (côté backend)** :
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role pour les opérations admin (webhook, etc.)

### En local (développement)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `STRIPE_SECRET_KEY=sk_test_XXXX` (clé de test Stripe)
- `STRIPE_WEBHOOK_SECRET=whsec_XXXX` (secret du webhook local)
- `STRIPE_API_VERSION=2025-08-27.basil` (optionnel, version API Stripe)
- `NEXT_PUBLIC_SUPABASE_URL=https://nhfmaxdkecahngnsczsn.supabase.co` (URL de votre projet Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDgzNjUsImV4cCI6MjA3NDIyNDM2NX0.3RnJIHR-AXgL2iXzthuDDY60OuBTwWICRpWUVt471SM` (clé anonyme Supabase)
- `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODY0ODM2NSwiZXhwIjoyMDc0MjI0MzY1fQ.placeholder-service-key` (clé service role pour webhook)

### En production (Vercel)
- `NEXT_PUBLIC_SITE_URL=https://<ton-projet>.vercel.app`
- `STRIPE_SECRET_KEY=sk_live_XXXX` (clé live Stripe)
- `STRIPE_WEBHOOK_SECRET=whsec_XXXX` (secret du webhook production)
- `STRIPE_API_VERSION=2025-08-27.basil` (optionnel, version API Stripe)
- `NEXT_PUBLIC_SUPABASE_URL=https://nhfmaxdkecahngnsczsn.supabase.co` (URL de votre projet Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDgzNjUsImV4cCI6MjA3NDIyNDM2NX0.3RnJIHR-AXgL2iXzthuDDY60OuBTwWICRpWUVt471SM` (clé anonyme Supabase)
- `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZm1heGRrZWNhaG5nbnNjenNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODY0ODM2NSwiZXhwIjoyMDc0MjI0MzY1fQ.placeholder-service-key` (clé service role pour webhook)

## Étapes de configuration

1. **Créer un compte Stripe** : https://stripe.com
2. **Créer un projet Supabase** : https://supabase.com
3. **Récupérer les clés API** dans le dashboard Stripe
4. **Récupérer les clés Supabase** dans Project Settings → API
5. **Créer les tables** dans Supabase (voir section Database)
6. **Créer des produits et prix** dans Stripe Dashboard
7. **Remplacer les priceStripeId** dans `src/data/workshops.ts` par vos vrais IDs
8. **Configurer les webhooks** pour les notifications de paiement
9. **Tester le webhook** en local avec Stripe CLI

## IDs de prix Stripe

Les workshops utilisent actuellement des IDs d'exemple :
- `price_1QExample1` → Cours de peinture & Apéro
- `price_1QExample2` → Brunch, Paint & Talk
- etc.

Remplacez ces IDs par vos vrais IDs Stripe dans `src/data/workshops.ts`.

## Configuration de la base de données Supabase

### Créer les tables

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Table ateliers
create table workshops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  date timestamptz not null,
  location text not null,
  price integer not null,
  seats integer not null,
  price_stripe_id text,
  cover_url text,
  excerpt text,
  created_at timestamptz default now()
);

-- Table commandes
create table orders (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid references workshops(id) on delete cascade,
  email text not null,
  amount integer not null,
  currency text not null,
  status text not null default 'paid',
  stripe_session_id text,
  created_at timestamptz default now()
);
```

### Insérer des données de test

```sql
-- Insérer l'atelier Kevin Test
insert into workshops (slug, title, date, location, price, seats, price_stripe_id, cover_url, excerpt)
values (
  'kevin-test',
  'Kevin Test',
  '2025-10-01T18:00:00Z',
  'En ligne',
  10,
  50,
  'price_1SAZalLQsAaHfXd9RtoHWImA',
  'https://files.stripe.com/links/MDB8YWNjdF8xU0FaUUxMUXNBYUhmWGQ5fGZsX3Rlc3RfRUEzNFVPWmhobE5MZmJMZGFiNDVkRlRi00Jd32ctF6',
  'je teste mon premier paiement'
);
```

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
