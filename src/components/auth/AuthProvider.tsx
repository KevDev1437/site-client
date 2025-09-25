'use client';

import AuthModal from '@/components/auth/AuthModal';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthProvider');
  }
  return context;
}
