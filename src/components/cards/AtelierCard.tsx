import { Atelier } from '@/types/atelier';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface AtelierCardProps {
  atelier: Atelier;
  onAddToCart?: (atelier: Atelier) => void;
}

export default function AtelierCard({ atelier, onAddToCart }: AtelierCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isComplet = atelier.seats === 0;
  
  // Calculer le nombre de jours restants
  const calculateDaysRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining(atelier.date);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        await onAddToCart(atelier);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105">
      {/* Image avec overlay */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={atelier.cover_url}
          alt={atelier.title}
          width={300}
          height={160}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay doux */}
        <div className="absolute inset-0 bg-gradient-to-t from-terracotta/20 to-transparent"></div>
        
        {/* Titre sur l'image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-white text-sm font-semibold drop-shadow-lg line-clamp-2">
            {atelier.title}
          </h3>
        </div>

        {/* Icône panier flottante */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="absolute top-3 right-3 bg-white/80 hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Contenu de la carte */}
      <div className="p-4 space-y-3">
        {/* Infos date, heure et lieu */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🗓</span>
            <span>{new Date(atelier.date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>⌚</span>
            <span>{new Date(atelier.date).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{atelier.location}</span>
          </div>
        </div>

        {/* Première ligne : Prix et jours restants */}
        <div className="flex items-center justify-between">
          <span className={`font-serif font-bold text-base ${
            isComplet ? 'text-gray-400 line-through' : 'text-terracotta'
          }`}>
            {atelier.price}€
          </span>
          
          {isComplet ? (
            <span className="bg-red-500 text-white rounded px-2 py-0.5 text-xs font-medium">
              Complet
            </span>
          ) : (
            <span className="text-gray-600 text-sm">
              {daysRemaining > 0 ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}` : 'Aujourd\'hui'}
            </span>
          )}
        </div>


        {/* Barre de progression basée sur les places restantes */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            {atelier.seats} places restantes
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 bg-green-500"
              style={{ 
                width: `${Math.min(100, Math.max(0, (atelier.seats / atelier.total_seats) * 100))}%` // Jauge basée sur places restantes / places totales
              }}
            ></div>
          </div>
        </div>

        {/* Bouton principal */}
        <Link
          href={isComplet ? '#' : `/workshops/${atelier.slug}`}
          className={`block w-full text-center font-medium py-2 px-4 rounded-lg transition-colors ${
            isComplet 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-terracotta hover:bg-rose-poudre text-white'
          }`}
        >
          {isComplet ? 'Atelier complet' : 'Réserver ma place'}
        </Link>
      </div>
    </div>
  );
}
