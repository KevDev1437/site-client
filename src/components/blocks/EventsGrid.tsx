import EventCard from '@/components/cards/EventCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { workshops } from '@/data/workshops';

export default function EventsGrid() {

  return (
    <section id="events" className="py-20">
      <SectionTitle 
        title="Tes prochains moments préférés"
        subtitle="Découvrez nos ateliers créatifs et laissez libre cours à votre imagination"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.slice(0, 6).map((workshop) => (
          <EventCard key={workshop.slug} workshop={workshop} />
        ))}
      </div>
      
      {/* View all button */}
      <div className="text-center mt-12">
        <Button href="/workshops" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
          Voir tous les ateliers
        </Button>
      </div>
    </section>
  );
}
