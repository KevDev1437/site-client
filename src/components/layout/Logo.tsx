'use client';

import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Logo() {
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png'); // Image par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogoFromSupabase = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer l'URL publique du logo depuis Supabase Storage
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl('logo.png');

        if (data?.publicUrl) {
          setLogoSrc(data.publicUrl);
        }
      } catch (error) {
        console.warn('Erreur lors du chargement du logo depuis Supabase:', error);
        // En cas d'erreur, on garde l'image par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchLogoFromSupabase();
  }, []);

  return (
    <Image
      src={logoSrc}
      alt="Yapha Creative Studio"
      width={200}
      height={80}
      className="h-20 w-auto object-contain"
      priority
    />
  );
}
