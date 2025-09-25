import EventCard from "@/components/cards/EventCard";
import SectionTitle from "@/components/ui/SectionTitle";

export const dynamic = "force-dynamic";

interface Workshop {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  seats: number;
  price_stripe_id?: string;
  cover_url?: string;
  excerpt?: string;
}

export default async function WorkshopsPage() {
  let workshops: Workshop[] | null = null;
  let error: { message: string } | null = null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/workshops`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      workshops = data.workshops || [];
    } else {
      const errorData = await response.json();
      error = { message: errorData.error || 'Failed to fetch workshops' };
    }
  } catch (err) {
    console.error("❌ Error fetching workshops:", err);
    error = { message: 'Failed to fetch workshops' };
  }

  // Debug seulement en développement
  if (process.env.NODE_ENV === 'development') {
    console.log("📦 Workshops data =", workshops);
    console.log("❌ Workshops error =", error);
    if (!workshops || workshops.length === 0) {
      console.log("⚠️ Aucun atelier trouvé côté Supabase");
    }
  }

  if (error) {
    return (
      <div className="py-20 text-center px-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4 font-serif">Erreur de connexion</h1>
        <p className="text-gris-doux">Erreur : {error.message}</p>
        <div className="mt-4 p-4 bg-rose rounded-lg text-left">
          <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!workshops || workshops.length === 0) {
    return (
      <div className="py-20 text-center px-6">
        <SectionTitle 
          title="Tous nos ateliers"
          subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
        />
        <div className="text-center py-12">
          <div className="text-dore text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
            Aucun atelier disponible
          </h3>
          <p className="text-gris-doux">
            De nouveaux ateliers seront bientôt disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-boutique px-6">
        <SectionTitle 
          title="Tous nos ateliers"
          subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
        />

      {/* Results count */}
      <div className="mb-8">
        <p className="text-gris-doux">
          {workshops.length} atelier{workshops.length > 1 ? 's' : ''} disponible{workshops.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((workshop) => (
          <EventCard
            key={workshop.id}
            workshop={{
              slug: workshop.slug,
              title: workshop.title,
              date: workshop.date,
              location: workshop.location,
              price: workshop.price,
              cover: workshop.cover_url || '',
              excerpt: workshop.excerpt || '',
              seats: workshop.seats,
              priceStripeId: workshop.price_stripe_id
            }}
          />
        ))}
      </div>
    </div>
  );
}
