"use client";

import EventCard from './EventCard';

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

interface EventCardWrapperProps {
  workshop: Workshop;
}

export default function EventCardWrapper({ workshop }: EventCardWrapperProps) {
  return <EventCard workshop={workshop} />;
}
