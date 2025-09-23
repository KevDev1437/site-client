import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function FounderIntro() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Hey, <span className="text-blue-600">Moi, c&apos;est KevDevops</span> 👋
          </h2>
          
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              Passionnée d&apos;art depuis toujours, j&apos;ai créé Yapha Creative Studio 
              pour partager ma passion avec vous dans une ambiance chaleureuse et bienveillante.
            </p>
            
            <p>
              Ici, pas de jugement, pas de pression ! Juste l&apos;envie de créer ensemble, 
              de découvrir de nouvelles techniques et de passer de beaux moments. 
              Que vous soyez débutant ou confirmé, vous êtes les bienvenus ! ✨
            </p>
            
            <p>
              Mon rêve ? Voir vos yeux s&apos;illuminer quand vous réalisez votre première 
              création, entendre vos rires pendant nos ateliers, et créer une vraie 
              communauté de créatifs bienveillants.
            </p>
          </div>
          
          {/* Social icons */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors duration-200"
              aria-label="Instagram"
            >
              <span className="text-2xl">📷</span>
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
              aria-label="TikTok"
            >
              <span className="text-2xl">🎵</span>
            </a>
          </div>
          
          <div className="pt-4">
            <Button href="/contact">
              Parler avec nous
            </Button>
          </div>
        </div>

        {/* Right side - Portrait */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=600&fit=crop"
              alt="Sarah - Fondatrice de Yapha Creative Studio"
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-full opacity-60"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200 rounded-full opacity-40"></div>
          
          {/* Floating quote */}
          <div className="absolute top-8 -left-8 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <p className="text-sm text-gray-600 italic">
              &ldquo;Créer, c&apos;est vivre deux fois&rdquo;
            </p>
            <p className="text-xs text-gray-400 mt-1">- Sarah</p>
          </div>
        </div>
      </div>
    </section>
  );
}
