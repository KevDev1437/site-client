# Structure des dossiers pour les Ateliers dans Supabase Storage

## Étapes à suivre dans Supabase Storage :

### 1. Créer le bucket `workshops` (si pas déjà fait)
- Aller dans Storage > Buckets
- Créer un nouveau bucket nommé `workshops`
- Configurer les permissions publiques

### 2. Créer les dossiers pour chaque atelier :

```
📁 workshops/
├── 📁 atelier-peinture-creativite/
├── 📁 atelier-sculpture-argile/
├── 📁 atelier-photographie-debutant/
└── 📁 atelier-photographie-expert/
```

### 3. Uploader les images dans chaque dossier :

**Pour chaque atelier, uploader :**
- `cover.jpg` (image de couverture principale)
- `image1.jpg` (image secondaire, optionnelle)
- `image2.jpg` (image détail, optionnelle)

### 4. Vérifier les URLs générées :

Les URLs devraient ressembler à :
```
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-peinture-creativite/cover.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-sculpture-argile/cover.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-debutant/cover.jpg
https://nhfmaxdkecahngnsczsn.supabase.co/storage/v1/object/public/workshops/atelier-photographie-expert/cover.jpg
```

### 5. Exécuter le script SQL :

Utiliser le fichier `update-workshops-images.sql` pour mettre à jour les URLs dans la base de données.

### 6. Tester sur le site :

Vérifier que les images s'affichent correctement sur :
- Page d'accueil (section ateliers)
- Page `/workshops`
- Pages ateliers individuelles

