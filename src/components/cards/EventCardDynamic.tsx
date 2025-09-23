"use client";
import dynamic from 'next/dynamic';

// Désactiver SSR pour EventCard car il utilise Zustand
const EventCard = dynamic(
  () => import('./EventCard'),
  { ssr: false }
);

export default EventCard;
