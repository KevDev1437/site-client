export type Workshop = {
  slug: string;            // kebab-case unique
  title: string;
  date: string;            // ISO
  location: string;        // "Paris, France" etc.
  price: number;           // in EUR
  cover: string;           // URL placeholder
  excerpt: string;
  seats: number;           // capacity
  priceStripeId?: string;  // Stripe price ID
};

export const workshops: Workshop[] = [
  {
    slug: "kevin-test",
    title: "Kevin Test",
    date: "2025-10-01T18:00:00Z",
    location: "En ligne",
    price: 10,
    cover: "https://files.stripe.com/links/MDB8YWNjdF8xU0FaUUxMUXNBYUhmWGQ5fGZsX3Rlc3RfRUEzNFVPWmhobE5MZmJMZGFiNDVkRlRi00Jd32ctF6",
    excerpt: "je teste mon premier paiement",
    seats: 50,
    priceStripeId: "price_1SAZalLQsAaHfXd9RtoHWImA"
  },
  {
    slug: "cours-peinture-apero",
    title: "Cours de peinture & Apéro",
    date: "2024-01-15T18:30:00.000Z",
    location: "Paris, France",
    price: 45,
    cover: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    excerpt: "Découvrez la peinture à l'huile dans une ambiance conviviale avec apéritif et échanges artistiques.",
    seats: 12,
    priceStripeId: "price_1QExample1"
  },
  {
    slug: "brunch-paint-talk",
    title: "Brunch, Paint & Talk",
    date: "2024-01-20T10:00:00.000Z",
    location: "Lyon, France",
    price: 55,
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    excerpt: "Commencez votre dimanche en beauté avec un brunch gourmand suivi d'un atelier peinture aquarelle.",
    seats: 8,
    priceStripeId: "price_1QExample2"
  },
  {
    slug: "sip-diner-paint",
    title: "Sip, Dîner & Paint",
    date: "2024-01-25T19:00:00.000Z",
    location: "Marseille, France",
    price: 65,
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    excerpt: "Soirée complète : dîner gastronomique, dégustation de vins et création d'une toile personnalisée.",
    seats: 10,
    priceStripeId: "price_1QExample3"
  },
  {
    slug: "atelier-bento-cakes",
    title: "Atelier Bento Cakes",
    date: "2024-01-28T14:00:00.000Z",
    location: "Toulouse, France",
    price: 35,
    cover: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    excerpt: "Apprenez à créer de délicieux bento cakes décorés avec des techniques de pâtisserie créative.",
    seats: 15,
    priceStripeId: "price_1QExample4"
  },
  {
    slug: "crochet-bag-debutant",
    title: "Crochet Bag : Débutant",
    date: "2024-02-02T16:00:00.000Z",
    location: "Nantes, France",
    price: 25,
    cover: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    excerpt: "Initiation au crochet avec création de votre premier sac personnalisé. Matériel fourni.",
    seats: 12,
    priceStripeId: "price_1QExample5"
  },
  {
    slug: "atelier-poterie-terre",
    title: "Atelier Poterie & Terre",
    date: "2024-02-08T15:30:00.000Z",
    location: "Bordeaux, France",
    price: 40,
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    excerpt: "Modelage et tournage de poterie. Créez vos propres pièces uniques en terre cuite.",
    seats: 8,
    priceStripeId: "price_1QExample6"
  },
  {
    slug: "calligraphie-moderne",
    title: "Calligraphie Moderne",
    date: "2024-02-12T18:00:00.000Z",
    location: "Strasbourg, France",
    price: 30,
    cover: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    excerpt: "Découvrez l'art de la calligraphie moderne avec techniques de brush lettering et composition.",
    seats: 10,
    priceStripeId: "price_1QExample7"
  },
  {
    slug: "workshop-macrame",
    title: "Workshop Macramé",
    date: "2024-02-18T14:30:00.000Z",
    location: "Montpellier, France",
    price: 35,
    cover: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    excerpt: "Créez votre suspension macramé personnalisée. Techniques de nœuds et finitions professionnelles.",
    seats: 12,
    priceStripeId: "price_1QExample8"
  }
];
