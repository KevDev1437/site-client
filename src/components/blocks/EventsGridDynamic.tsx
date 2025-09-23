"use client";
import dynamic from 'next/dynamic';

// Désactiver SSR pour EventsGrid car il utilise Zustand
const EventsGrid = dynamic(
  () => import('./EventsGrid'),
  { ssr: false }
);

export default EventsGrid;
