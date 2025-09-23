import ContactTiles from '@/components/blocks/ContactTiles';
import EventsGrid from '@/components/blocks/EventsGrid';
import FounderIntro from '@/components/blocks/FounderIntro';
import Hero from '@/components/blocks/Hero';
import PhotoMosaic from '@/components/blocks/PhotoMosaic';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Home() {
  return (
    <>
      <Hero />
      <SectionTitle 
        title="Tes prochains moments préférés"
        subtitle="Découvrez nos ateliers créatifs et laissez libre cours à votre imagination"
      />
      <EventsGrid />
      <PhotoMosaic />
      <FounderIntro />
      <ContactTiles />
    </>
  );
}
