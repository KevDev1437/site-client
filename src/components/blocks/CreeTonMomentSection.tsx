'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function CreeTonMomentSection() {
  const [backgroundVideo, setBackgroundVideo] = useState<string>('/cree-ton-moment.jpg'); // Image par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundVideo = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer l'URL publique de la vidéo depuis Supabase Storage
        const { data } = supabase.storage
          .from('images') // Nom du bucket dans Supabase Storage
          .getPublicUrl('cree-ton-moment.mp4'); // Nom du fichier vidéo dans le bucket

        if (data?.publicUrl) {
          setBackgroundVideo(data.publicUrl);
        }
      } catch (error) {
        console.warn('Erreur lors du chargement de la vidéo depuis Supabase:', error);
        // En cas d'erreur, on garde l'image par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundVideo();
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Vidéo en arrière-plan */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        {/* Fallback image si la vidéo ne se charge pas */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/cree-ton-moment.jpg')`,
          }}
        />
      </video>
      
      {/* Overlay pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      
      <div className="relative z-20 text-center">
        <h2 className="font-serif text-4xl font-medium text-white text-center tracking-wide drop-shadow-lg">
          Crée ton moment 🕯
        </h2>
        <p className="font-sans text-base text-white mt-2 max-w-2xl mx-auto drop-shadow-md">
          Accorde-toi une pause, respire, et laisse émerger ton univers intérieur
        </p>
      </div>
    </section>
  );
}
