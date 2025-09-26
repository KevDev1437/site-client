'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface UserMenuProps {
  onLogin: () => void;
  isMobileMenu?: boolean;
}

export default function UserMenu({ onLogin, isMobileMenu = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  // Debug pour voir l'état d'authentification
  console.log('🔍 UserMenu Debug:', { 
    user: user?.email || 'No user', 
    loading, 
    isMobileMenu,
    timestamp: new Date().toISOString()
  });

  // Utiliser l'instance exportée de supabase

  const handleLogout = async () => {
    console.log('🔄 Tentative de déconnexion...');
    
    if (!supabase) {
      console.error('❌ Supabase client non initialisé');
      alert('Erreur: Client Supabase non initialisé');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion: ' + error.message);
      } else {
        console.log('✅ Déconnexion réussie');
        // Forcer la mise à jour en rechargant la page
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      alert('Erreur lors de la déconnexion');
    }
    setIsOpen(false);
  };

  if (loading) {
    return (
      <>
        {/* Desktop */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300">
          <User className="w-5 h-5" />
          <span>Chargement...</span>
        </button>
        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 text-gray-800">
          <User className="w-5 h-5" />
          <span>Chargement...</span>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        {/* Desktop */}
        <button 
          onClick={onLogin}
          className="hidden lg:flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300"
        >
          <User className="w-5 h-5" />
          <span>Se connecter</span>
        </button>
        {/* Mobile - Version simplifiée pour le header */}
        <button 
          onClick={onLogin}
          className="lg:hidden flex items-center gap-2 px-2 py-2 text-gris-doux hover:text-dore transition-colors duration-300"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Se connecter</span>
        </button>
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="relative hidden lg:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300"
        >
          <User className="w-5 h-5" />
          <span>Mon compte</span>
        </button>

        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-[80]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu déroulant */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[90]">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Connecté</p>
              </div>
              
              <a 
                href="/profile"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Profil</span>
              </a>
              
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

      {/* Mobile - Version simplifiée pour le header */}
      <div className="relative lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-2 text-gris-doux hover:text-dore transition-colors duration-300"
        >
          <User className="w-5 h-5" />
        </button>

        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-[80]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu déroulant mobile - Position fixe pour éviter les problèmes de scroll */}
            <div className="fixed right-4 top-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[90]">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Connecté</p>
              </div>
              
              <a 
                href="/profile"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Profil</span>
              </a>
              
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

      {/* Mobile - Version pour le menu mobile */}
      {isMobileMenu && (
        <div className="lg:hidden space-y-3">
          {user ? (
            <>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Connecté</p>
              </div>
              
              <a 
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Profil</span>
              </a>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Se déconnecter</span>
              </button>
            </>
          ) : (
            <button 
              onClick={onLogin}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
            >
              <User className="w-5 h-5" />
              <span>Se connecter</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
