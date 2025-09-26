export const dynamic = "force-dynamic";

import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner';
import ContactTiles from '@/components/blocks/ContactTiles';
import CreeTonMomentSection from '@/components/blocks/CreeTonMomentSection';
import EventsGrid from '@/components/blocks/EventsGrid';
import FounderIntro from '@/components/blocks/FounderIntro';
import PhotoMosaic from '@/components/blocks/PhotoMosaic';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-texture-papier">
      {/* Banner de confirmation d'email */}
      <EmailConfirmationBanner />
      
      {/* Hero Section - "Exprime ton art" */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-beige-clair">
        
        {/* Contenu centré */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-5xl font-bold text-gray-900 leading-tight">
            Exprime ton art
          </h1>
          <p className="font-sans text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            Découvre l&apos;univers créatif de Yapha Creative Studio et libère ton potentiel artistique
          </p>
          <Button href="/workshops" className="font-sans text-base px-6 py-3 rounded-full bg-terracotta hover:bg-rose-poudre text-white mt-8">
            Découvrir nos créations
          </Button>
        </div>
      </section>

      {/* Section "Moments de création" */}
      <section className="py-24 bg-beige-tres-clair px-6">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            title="Moments de création"
            subtitle="Plonge dans l'ambiance chaleureuse de nos ateliers créatifs"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carte 1: Imagine de nouvelles idées */}
            <div className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 card-elegant">
                <Image
                  src="/image1.jpg"
                  alt="Carnet et stylos créatifs"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-sm italic text-gray-500 mb-4">
                Imagine de nouvelles idées
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                Laisse libre cours à ton imagination dans nos ateliers d&apos;écriture créative
              </p>
            </div>

            {/* Carte 2: Laisse courir ton pinceau */}
            <div className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 card-elegant">
                <Image
                  src="/image2.jpg"
                  alt="Atelier peinture et café"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-sm italic text-gray-500 mb-4">
                Laisse courir ton pinceau
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                Découvre la peinture dans une ambiance détendue et bienveillante
              </p>
            </div>

            {/* Carte 3: Libère ta créativité */}
            <div className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 card-elegant">
                <Image
                  src="/image3.jpg"
                  alt="Personne en train de créer"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-sm italic text-gray-500 mb-4">
                Libère ta créativité
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                Explore différentes techniques artistiques à ton rythme
              </p>
            </div>

            {/* Carte 4: Nouvelle carte */}
            <div className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 card-elegant">
                <Image
                  src="/image4.jpg"
                  alt="Atelier créatif"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-sm italic text-gray-500 mb-4">
                Crée en communauté
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                Partage tes créations et inspire-toi des autres dans nos ateliers collectifs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Crée ton moment" - Diviseur */}
      <CreeTonMomentSection />

      {/* Section Boutique */}
      <section className="py-24 bg-beige-fonce px-6">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            title=""
            subtitle="Des carnets, des pinceaux et des œuvres pensées pour t'accompagner dans ton aventure artistique."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Produit 1: Set de stylos */}
            <div className="card-elegant p-6 text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
                  alt="Set de stylos créatifs"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-base font-medium text-gray-900 mb-2">
                Set de stylos
              </h3>
              <p className="font-serif text-lg font-semibold text-terracotta mb-6">15,00€</p>
              <Button href="/shop" className="font-sans text-sm uppercase tracking-wide bg-terracotta hover:bg-rose-poudre text-white px-4 py-2 rounded-lg">
                Voir plus
              </Button>
            </div>

            {/* Produit 2: Carnet */}
            <div className="card-elegant p-6 text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
                  alt="Carnet créatif"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-base font-medium text-gray-900 mb-2">
                Carnet
              </h3>
              <p className="font-serif text-lg font-semibold text-terracotta mb-6">20,00€</p>
              <Button href="/shop" className="font-sans text-sm uppercase tracking-wide bg-terracotta hover:bg-rose-poudre text-white px-4 py-2 rounded-lg">
                Voir plus
              </Button>
            </div>

            {/* Produit 3: Œuvre */}
            <div className="card-elegant p-6 text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
                  alt="Œuvre d'art"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-base font-medium text-gray-900 mb-2">
                Œuvre
              </h3>
              <p className="font-serif text-lg font-semibold text-terracotta mb-6">150,00€</p>
              <Button href="/shop" className="font-sans text-sm uppercase tracking-wide bg-terracotta hover:bg-rose-poudre text-white px-4 py-2 rounded-lg">
                Voir plus
              </Button>
            </div>

            {/* Produit 4: Nouveau produit */}
            <div className="card-elegant p-6 text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
                  alt="Kit créatif"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-base font-medium text-gray-900 mb-2">
                Kit créatif
              </h3>
              <p className="font-serif text-lg font-semibold text-terracotta mb-6">35,00€</p>
              <Button href="/shop" className="font-sans text-sm uppercase tracking-wide bg-terracotta hover:bg-rose-poudre text-white px-4 py-2 rounded-lg">
                Voir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Ateliers (EventsGrid intégré) */}
      <section id="events" className="py-24 bg-boutique px-6">
      <EventsGrid />
      </section>

      {/* Section Galerie (PhotoMosaic intégré) */}
      <section className="py-24 bg-beige-tres-clair px-6">
      <PhotoMosaic />
      </section>

      {/* Section Fondatrice (FounderIntro intégré) */}
      <section className="py-24 bg-rose-poudre px-6">
      <FounderIntro />
      </section>

      {/* Section Contact (ContactTiles intégré) */}
      <section className="py-24 bg-beige-fonce px-6">
      <ContactTiles />
      </section>
    </div>
  );
}
