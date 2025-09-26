# Structure des dossiers pour Supabase Storage

## Étapes à suivre dans Supabase Storage :

### 1. Créer le bucket `products` (si pas déjà fait)
- Aller dans Storage > Buckets
- Créer un nouveau bucket nommé `products`
- Configurer les permissions publiques

### 2. Créer les dossiers pour chaque produit :

```
📁 products/
├── 📁 coffret-calligraphie/
├── 📁 carnet-croquis/
├── 📁 fil-crochet-bio/
├── 📁 set-pinceaux-premium/
├── 📁 argile-poterie/
└── 📁 kit-peinture-aquarelle/
```

### 3. Uploader les images dans chaque dossier :

**Pour chaque produit, uploader :**
- `image1.jpg` (image principale)
- `image2.jpg` (image secondaire, optionnelle)
- `image3.jpg` (image détail, optionnelle)

### 4. Vérifier les URLs générées :

Les URLs devraient ressembler à :
```
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/coffret-calligraphie/image1.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/carnet-croquis/image1.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/fil-crochet-bio/image1.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/set-pinceaux-premium/image1.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/argile-poterie/image1.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/products/kit-peinture-aquarelle/image1.jpg
```

### 5. Exécuter le script SQL :

Utiliser soit :
- `update-products-images.sql` (requêtes séparées)
- `update-products-images-single-query.sql` (une seule requête)

### 6. Tester sur le site :

Vérifier que les images s'affichent correctement sur :
- Page d'accueil (section boutique)
- Page `/boutique`
- Pages produits individuelles
