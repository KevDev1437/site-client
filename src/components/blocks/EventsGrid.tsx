import EventCard from '@/components/cards/EventCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';

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

export default async function EventsGrid() {
  let workshops: Workshop[] | null = null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/workshops`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      workshops = data.workshops?.slice(0, 6) || [];
    }
  } catch (error) {
    console.error("❌ Error fetching workshops:", error);
  }

  if (!workshops || workshops.length === 0) {
    return (
      <section id="events" className="py-20">
        <SectionTitle 
          title="Tes prochains moments préférés"
          subtitle="Découvrez nos ateliers créatifs et laissez libre cours à votre imagination"
        />
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Configuration en cours
          </h3>
          <p className="text-gray-600">
            Les ateliers seront bientôt disponibles
          </p>
        </div>
      </section>
    );
  }

  // Debug seulement en développement
  if (process.env.NODE_ENV === 'development') {
    console.log("📦 Workshops data =", workshops);
    if (!workshops || workshops.length === 0) {
      console.log("⚠️ Aucun atelier trouvé côté Supabase");
    }
  }

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
