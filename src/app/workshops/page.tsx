import EventCard from '@/components/cards/EventCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { supabase } from '@/lib/supabase';

export default async function WorkshopsPage() {
  const { data: workshops } = await supabase
    .from("workshops")
    .select("*")
    .order("date", { ascending: true });

  return (
    <div className="py-20">
      <SectionTitle 
        title="Tous nos ateliers"
        subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
      />

      {/* Results count */}
      <div className="mb-8">
        <p className="text-gray-600">
          {workshops?.length || 0} atelier{(workshops?.length || 0) > 1 ? 's' : ''} disponible{(workshops?.length || 0) > 1 ? 's' : ''}
        </p>
      </div>

      {/* Workshops Grid */}
      {workshops && workshops.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun atelier disponible
          </h3>
          <p className="text-gray-600">
            De nouveaux ateliers seront bientôt disponibles
          </p>
        </div>
      )}
    </div>
  );
}
