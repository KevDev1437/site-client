export const dynamic = "force-dynamic";

import ContactTiles from '@/components/blocks/ContactTiles';
import EventsGrid from '@/components/blocks/EventsGrid';
import FounderIntro from '@/components/blocks/FounderIntro';
import Hero from '@/components/blocks/Hero';
import PhotoMosaic from '@/components/blocks/PhotoMosaic';

export default function Home() {
  return (
    <>
      <Hero />
      <EventsGrid />
      <PhotoMosaic />
      <FounderIntro />
      <ContactTiles />
    </>
  );
}
