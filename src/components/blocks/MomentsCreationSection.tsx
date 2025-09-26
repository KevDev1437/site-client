'use client';

import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MomentCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

export default function MomentsCreationSection() {
  const [moments, setMoments] = useState<MomentCard[]>([
    {
      id: 1,
      image: '/image1.jpg', // Image par défaut
      title: 'Imagine de nouvelles idées',
      description: 'Laisse libre cours à ton imagination dans nos ateliers d\'écriture créative'
    },
    {
      id: 2,
      image: '/image2.jpg', // Image par défaut
      title: 'Laisse courir ton pinceau',
      description: 'Découvre la peinture dans une ambiance détendue et bienveillante'
    },
    {
      id: 3,
      image: '/image3.jpg', // Image par défaut
      title: 'Libère ta créativité',
      description: 'Explore différentes techniques artistiques à ton rythme'
    },
    {
      id: 4,
      image: '/image4.jpg', // Image par défaut
      title: 'Crée en communauté',
      description: 'Partage tes créations et inspire-toi des autres dans nos ateliers collectifs'
    }
  ]);

  useEffect(() => {
    const fetchImagesFromSupabase = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer les URLs publiques des images depuis Supabase Storage
        const imageFiles = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
        const updatedMoments = [...moments];

        for (let i = 0; i < imageFiles.length; i++) {
          const { data } = supabase.storage
            .from('images')
            .getPublicUrl(imageFiles[i]);

          if (data?.publicUrl) {
            updatedMoments[i].image = data.publicUrl;
          }
        }

        setMoments(updatedMoments);
      } catch (error) {
        console.warn('Erreur lors du chargement des images depuis Supabase:', error);
        // En cas d'erreur, on garde les images par défaut
      }
    };

    fetchImagesFromSupabase();
  }, []);

  return (
    <section className="py-24 bg-beige-tres-clair px-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            Moments de création
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Plonge dans l&apos;ambiance chaleureuse de nos ateliers créatifs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {moments.map((moment) => (
            <div key={moment.id} className="text-center group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 card-elegant">
                <Image
                  src={moment.image}
                  alt={moment.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <h3 className="font-sans text-sm italic text-gray-500 mb-4">
                {moment.title}
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                {moment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
