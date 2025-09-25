"use client";

import CheckoutButton from '@/components/CheckoutButton';
import Button from '@/components/ui/Button';
import { useCart } from '@/store/cart';
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
  const { addItem } = useCart();
  
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
    <Link href={`/workshops/${workshop.slug}`} className="block mx-auto">
      <div className="card-elegant overflow-hidden hover:card-elevated transition-all duration-300 cursor-pointer max-w-sm">
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
            <span className="bg-rose-poudre text-terracotta text-sm font-medium px-4 py-2 rounded-full">
              {getDaysUntilEvent(workshop.date)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-semibold text-gray-900 line-clamp-2 font-serif">
            {workshop.title}
          </h3>
          
          {/* Date and Location */}
          <div className="space-y-3 text-gris-doux">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-base font-medium">
                {formatDate(workshop.date)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base">{workshop.location}</span>
            </div>
          </div>
          
          {/* Price and Seats */}
          <div className="flex justify-between items-center text-base text-gris-doux">
            <span className="font-bold text-2xl text-terracotta">
              {workshop.price}€
            </span>
            <span className="text-base text-gris-doux">
              {workshop.seats} places restantes
            </span>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-2">
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
            
            {workshop.priceStripeId && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({
                    id: workshop.slug,
                    title: workshop.title,
                    price: workshop.price,
                    priceId: workshop.priceStripeId!,
                  });
                }}
                className="w-full px-6 py-3 rounded-2xl bg-beige text-gris-doux hover:bg-rose-poudre transition-all duration-400 text-base font-medium"
              >
                Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
