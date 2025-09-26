'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function CreeTonMomentSection() {
  const [backgroundVideo, setBackgroundVideo] = useState<string>(''); // Pas d'URL par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundVideo = async () => {
      try {
        const supabase = createClient();
        
        console.log('🎬 Tentative de récupération de la vidéo depuis Supabase...');
        
        // Récupérer l'URL publique de la vidéo depuis Supabase Storage
        const { data } = supabase.storage
          .from('videos') // Nom du bucket dans Supabase Storage
          .getPublicUrl('cree-ton-moment.mp4'); // Nom du fichier vidéo dans le bucket

        console.log('🎬 URL récupérée:', data?.publicUrl);

        if (data?.publicUrl) {
          setBackgroundVideo(data.publicUrl);
          console.log('✅ Vidéo configurée:', data.publicUrl);
        } else {
          console.warn('⚠️ Aucune URL vidéo trouvée');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la vidéo depuis Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundVideo();
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Vidéo en arrière-plan - seulement si URL disponible */}
      {backgroundVideo && (
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Fallback image si pas de vidéo */}
      {!backgroundVideo && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop')`,
          }}
        />
      )}
      
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
