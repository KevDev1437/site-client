import EventCard from "@/components/cards/EventCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { supabase } from "@/lib/supabase";

export default async function WorkshopsPage() {
  if (!supabase) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration en cours</h1>
        <p className="text-gray-600">Les ateliers seront bientôt disponibles</p>
      </div>
    );
  }

  const { data: workshops, error } = await supabase
    .from("workshops")
    .select("id, slug, title, date, location, price, seats, price_stripe_id, cover_url, excerpt")
    .order("date", { ascending: true });

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
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de connexion</h1>
        <p className="text-gray-600">Erreur : {error.message}</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
          <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!workshops || workshops.length === 0) {
    return (
      <div className="py-20 text-center">
        <SectionTitle 
          title="Tous nos ateliers"
          subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
        />
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun atelier disponible
          </h3>
          <p className="text-gray-600">
            De nouveaux ateliers seront bientôt disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <SectionTitle 
        title="Tous nos ateliers"
        subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
      />

      {/* Results count */}
      <div className="mb-8">
        <p className="text-gray-600">
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
