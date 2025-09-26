'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function CreeTonMomentSection() {
  const [backgroundImage, setBackgroundImage] = useState<string>('/cree-ton-moment.jpg'); // Image par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer l'URL publique de l'image depuis Supabase Storage
        const { data } = supabase.storage
          .from('images') // Nom du bucket dans Supabase Storage
          .getPublicUrl('cree-ton-moment.jpg'); // Nom du fichier dans le bucket

        if (data?.publicUrl) {
          setBackgroundImage(data.publicUrl);
        }
      } catch (error) {
        console.warn('Erreur lors du chargement de l\'image depuis Supabase:', error);
        // En cas d'erreur, on garde l'image par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
  }, []);

  return (
    <section 
      className="relative py-32 px-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/20"></div>
      
        <div className="relative z-10 text-center">
          <h2 className="font-serif text-4xl font-medium text-white text-center tracking-wide drop-shadow-lg">
            Crée ton moment <span className="flame-gentle">🕯</span>
          </h2>
        <p className="font-sans text-base text-white mt-2 max-w-2xl mx-auto drop-shadow-md">
          Accorde-toi une pause, respire, et laisse émerger ton univers intérieur
        </p>
      </div>
    </section>
  );
}
