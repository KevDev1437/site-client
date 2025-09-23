import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text */}
        <div className="space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold italic leading-tight text-gray-900">
            Créez, 
            <span className="text-blue-600"> partagez</span>, 
            <br />
            <span className="text-pink-500">épanouissez-vous</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            Découvrez l&apos;art de la création dans nos ateliers conviviaux. 
            Peinture, crochet, poterie... Laissez libre cours à votre créativité 
            dans une ambiance chaleureuse et bienveillante.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/workshops">
              Découvrir les ateliers
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop"
              alt="Atelier créatif - Yapha Creative Studio"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>
        </div>
      </div>

      {/* Scroll down chevron */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#events" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
