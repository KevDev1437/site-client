import CheckoutButton from '@/components/CheckoutButton';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface WorkshopDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  // Await params pour Next.js 15
  const { slug } = await params;

  let workshop = null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/workshops/${slug}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      workshop = data.workshop;
    }
  } catch (error) {
    console.error("❌ Error fetching workshop:", error);
  }

  // Debug seulement en développement
  if (process.env.NODE_ENV === 'development') {
    console.log("📦 Workshop =", workshop);
  if (!workshop) {
    console.log("⚠️ Aucun atelier trouvé avec le slug:", slug);
  }
  }

  if (!workshop) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Les places restantes sont maintenant directement dans workshop.seats depuis Supabase

  return (
    <div className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left side - Image */}
        <div className="space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={workshop.cover_url || workshop.cover || '/placeholder-workshop.jpg'}
              alt={workshop.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Additional info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations pratiques
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Durée :</span>
                <span className="font-medium">2h30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Niveau :</span>
                <span className="font-medium">Tous niveaux</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matériel :</span>
                <span className="font-medium">Fourni</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {workshop.title}
            </h1>
            
            <div className="space-y-4">
              {/* Date and Time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">
                  {formatDate(workshop.date)} à {formatTime(workshop.date)}
                </span>
              </div>
              
              {/* Location */}
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{workshop.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              À propos de cet atelier
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {workshop.excerpt || "Découvrez cet atelier créatif dans une ambiance conviviale."}
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Dans une ambiance conviviale et bienveillante, vous découvrirez les techniques 
              essentielles pour créer votre propre œuvre. Notre équipe d&apos;artistes expérimentés 
              vous accompagnera pas à pas pour que vous repartiez avec une création dont vous 
              serez fier.
            </p>
          </div>

          {/* Pricing and Booking */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  30€
                </div>
                <div className="text-gray-600">
                  par personne
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Prix unique pour tous les ateliers
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {workshop.seats} places restantes
                </div>
                <div className="text-sm text-gray-600">
                  Places disponibles
                </div>
              </div>
            </div>
            
            <CheckoutButton 
              priceId={workshop.price_stripe_id} 
              workshopSlug={workshop.slug}
            />
            
            <p className="text-sm text-gray-600 text-center mt-4">
              Paiement sécurisé • Annulation gratuite jusqu&apos;à 24h avant
            </p>
          </div>

          {/* What's included */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ce qui est inclus
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tout le matériel nécessaire</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Encadrement par un artiste professionnel</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Boissons et collations</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Votre création à emporter</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
