import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';

const products = [
  {
    id: 1,
    title: "Kit Peinture Aquarelle",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Set Pinceaux Premium",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Carnet de Croquis",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Argile Poterie 2kg",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Fil Crochet Bio",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Coffret Calligraphie",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
  }
];

export default function ShopPage() {
  return (
    <div className="py-20">
      <SectionTitle 
        title="Notre boutique"
        subtitle="Découvrez notre sélection de matériel créatif de qualité pour continuer à créer chez vous"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {product.title}
              </h3>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">
                  {product.price}€
                </span>
                <Button 
                  onClick={() => alert("Fonctionnalité panier bientôt disponible !")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon notice */}
      <div className="mt-16 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto">
          <div className="text-yellow-600 text-4xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Boutique en construction
          </h3>
          <p className="text-gray-600">
            Notre boutique en ligne sera bientôt disponible ! En attendant, 
            vous pouvez retrouver tous nos produits directement dans notre atelier.
          </p>
        </div>
      </div>
    </div>
  );
}
