import CheckoutButton from '@/components/CheckoutButton';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

interface Workshop {
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  cover: string;
  excerpt: string;
  seats: number;
  priceStripeId?: string;
}

interface EventCardProps {
  workshop: Workshop;
}

export default function EventCard({ workshop }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Événement passé';
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `${diffDays} jours avant l&apos;événement`;
  };

  return (
    <Link href={`/workshops/${workshop.slug}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Cover Image */}
        <div className="aspect-video overflow-hidden">
          <Image
            src={workshop.cover}
            alt={workshop.title}
            width={800}
            height={450}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Days until event pill */}
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {getDaysUntilEvent(workshop.date)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {workshop.title}
          </h3>
          
          {/* Date and Location */}
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">
                {formatDate(workshop.date)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{workshop.location}</span>
            </div>
          </div>
          
          {/* Price and Seats */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="font-medium text-lg text-gray-900">
              {workshop.price}€
            </span>
            <span className="text-sm text-gray-600">
              {workshop.seats} places restantes
            </span>
          </div>
          
          {/* CTA Button */}
          {workshop.priceStripeId ? (
            <CheckoutButton priceId={workshop.priceStripeId} workshopSlug={workshop.slug} />
          ) : (
            <Button 
              href={`/workshops/${workshop.slug}`}
              className="w-full"
            >
              Acheter des billets
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
