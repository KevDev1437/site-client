export const dynamic = "force-dynamic";

import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner';
import ContactTiles from '@/components/blocks/ContactTiles';
import CreeTonMomentSection from '@/components/blocks/CreeTonMomentSection';
import ElegantAteliersSection from '@/components/blocks/ElegantAteliersSection';
import ElegantBoutiqueSection from '@/components/blocks/ElegantBoutiqueSection';
import FounderIntro from '@/components/blocks/FounderIntro';
import MomentsCreationSection from '@/components/blocks/MomentsCreationSection';
import PhotoMosaic from '@/components/blocks/PhotoMosaic';
import Button from '@/components/ui/Button';

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
      <MomentsCreationSection />

      {/* Section "Crée ton moment" - Diviseur */}
      <CreeTonMomentSection />

      {/* Section Boutique */}
      <ElegantBoutiqueSection maxProducts={4} />

      {/* Section Ateliers */}
      <ElegantAteliersSection />

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
