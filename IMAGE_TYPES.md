# Types d'images supportés

## Configuration Next.js

Votre projet est maintenant configuré pour accepter **tous les types d'images** :

### Types supportés :
- **PNG** (.png) - Transparence supportée
- **JPEG** (.jpg, .jpeg) - Compression optimisée
- **WebP** (.webp) - Format moderne, plus léger
- **AVIF** (.avif) - Format ultra-moderne, très léger
- **SVG** (.svg) - Vecteurs, parfait pour les icônes
- **GIF** (.gif) - Animations
- **BMP** (.bmp) - Format bitmap
- **TIFF** (.tiff) - Format professionnel

### Configuration appliquée :

1. **next.config.ts** - Formats optimisés (WebP, AVIF)
2. **tailwind.config.js** - Configuration des couleurs et polices
3. **globals.css** - Styles personnalisés

### Utilisation :

```jsx
// Tous ces formats fonctionnent maintenant :
<Image src="/image.jpg" alt="JPEG" />
<Image src="/image.png" alt="PNG" />
<Image src="/image.webp" alt="WebP" />
<Image src="/image.svg" alt="SVG" />
<Image src="/image.gif" alt="GIF" />
```

### Optimisations automatiques :
- **WebP** et **AVIF** pour les navigateurs modernes
- **Redimensionnement** automatique
- **Lazy loading** par défaut
- **Compression** optimisée

Vous pouvez maintenant utiliser n'importe quel type d'image dans votre projet ! 🎨✨
