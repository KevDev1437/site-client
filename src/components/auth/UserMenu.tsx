'use client';

import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface UserMenuProps {
  onLogin: () => void;
}

export default function UserMenu({ onLogin }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } else {
        console.log('Déconnexion réussie');
        // Le hook useAuth va automatiquement détecter le changement
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    setIsOpen(false);
  };

  if (loading) {
    return (
      <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300">
        <User className="w-5 h-5" />
        <span>Chargement...</span>
      </button>
    );
  }

  if (!user) {
    return (
      <button 
        onClick={onLogin}
        className="hidden md:flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300"
      >
        <User className="w-5 h-5" />
        <span>Se connecter</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300"
      >
        <User className="w-5 h-5" />
        <span>Mon compte</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Connecté</p>
            </div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Profil</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
