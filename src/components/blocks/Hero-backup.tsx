import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center py-24 section-texture-papier">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left side - Text */}
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="font-script text-5xl text-or-doux mb-6">
              Bienvenue chez
            </div>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-gray-900">
              Yapha Creative
              <br />
              <span className="text-terracotta">Studio</span>
            </h1>
          </div>
          
          <p className="text-2xl text-gris-doux leading-relaxed max-w-2xl font-sans">
            Découvrez l&apos;art de la création dans nos ateliers conviviaux. 
            Peinture, crochet, poterie... Laissez libre cours à votre créativité 
            dans une ambiance chaleureuse et bienveillante.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <Button href="/workshops" className="btn-primary">
              Découvrir les ateliers
            </Button>
            <Button href="/shop" className="btn-secondary">
              Notre boutique
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden card-elevated">
            <Image
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop"
              alt="Atelier créatif - Yapha Creative Studio"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements - style flat lay artistique */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-rose-poudre rounded-full opacity-25"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-or-doux rounded-full opacity-15"></div>
          <div className="absolute top-1/2 -left-12 w-20 h-20 bg-terracotta rounded-full opacity-30"></div>
        </div>
      </div>

      {/* Scroll down chevron */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#events" className="text-terracotta hover:text-or-doux transition-colors duration-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
