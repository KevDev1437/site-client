'use client';

import { supabase } from '@/lib/supabase';
import { Camera, Mail, Phone, User, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    phone: string | null;
  };
  user: {
    email?: string;
  };
  onUpdate: () => void;
}

export default function ProfileEditModal({ isOpen, onClose, profile, user, onUpdate }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    phone: profile.phone || '',
    email: user.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      if (!supabase) {
        console.error('Supabase client non initialisé');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('🔄 Upload avatar:', { fileName, filePath, fileSize: file.size });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('❌ Erreur upload avatar:', uploadError);
        // Si le bucket n'existe pas, on peut essayer de le créer ou utiliser une URL temporaire
        if (uploadError.message.includes('Bucket not found')) {
          console.warn('⚠️ Bucket avatars non trouvé, utilisation d\'une URL temporaire');
          return URL.createObjectURL(file);
        }
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('✅ Avatar uploadé:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('❌ Erreur upload avatar:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client non initialisé');
      }

      // Upload avatar si nouveau fichier
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        console.log('🔄 Upload en cours...');
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          console.log('✅ Avatar uploadé avec succès:', uploadedUrl);
        } else {
          console.warn('⚠️ Échec de l\'upload, conservation de l\'avatar actuel');
          // On continue avec l'avatar actuel si l'upload échoue
        }
      }

      // Mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          phone: formData.phone || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Mettre à jour l'email si changé
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) {
          throw new Error(emailError.message);
        }
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      onUpdate();
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  console.log('🔍 ProfileEditModal render:', { isOpen, profile: profile?.id, user: user?.email });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Modifier mon profil
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-terracotta text-white rounded-full p-2 cursor-pointer hover:bg-rose-poudre transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Cliquez sur l'icône pour changer votre photo</p>
            </div>

            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            {/* Biographie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent transition-colors resize-none"
                placeholder="Parlez-nous de vous..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-terracotta hover:bg-rose-poudre text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mise à jour...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
