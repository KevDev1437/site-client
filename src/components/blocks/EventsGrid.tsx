import EventCard from '@/components/cards/EventCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { supabase } from '@/lib/supabase';

export default async function EventsGrid() {
  const { data: workshops } = await supabase
    .from("workshops")
    .select("id, slug, title, date, location, price, seats, price_stripe_id, cover_url, excerpt")
    .order("date", { ascending: true })
    .limit(6);

  return (
    <section id="events" className="py-20">
      <SectionTitle 
        title="Tes prochains moments préférés"
        subtitle="Découvrez nos ateliers créatifs et laissez libre cours à votre imagination"
      />
      
      {workshops && workshops.length > 0 ? (
        <>
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
          
          {/* View all button */}
          <div className="text-center mt-12">
            <Button href="/workshops" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              Voir tous les ateliers
            </Button>
          </div>
        </>
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
    </section>
  );
}
