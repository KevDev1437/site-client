'use client';

import { useAuthModal } from '@/components/auth/AuthProvider';
import UserMenu from '@/components/auth/UserMenu';
import { useCart } from '@/store/cart';
import { Menu, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const { items } = useCart();
  const totalQty = items.reduce((acc, i) => acc + i.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/workshops', label: 'L\'atelier' },
    { href: '/shop', label: 'Boutique' },
    { href: '/testimonials', label: 'Prestations' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg backdrop-blur-md bg-blanc-creme/95' : 'backdrop-blur-sm bg-beige/80'
    }`}>
<nav className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Ligne du haut - Logo centré + Actions droite */}
        <div className="flex items-center justify-between h-20">
          {/* Espace vide à gauche pour équilibrer */}
          <div className="w-32"></div>
          
          {/* Logo centré */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Yapha Creative Studio"
                width={900}
                height={300}
                className="h-50 w-auto group-hover:scale-110 transition-all duration-300 ease-in-out"
                priority
              />
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-4">
            {/* Menu utilisateur ou bouton connexion - Desktop seulement */}
            <div className="hidden lg:block">
              <UserMenu onLogin={openAuthModal} />
            </div>
            
            {/* Panier avec compteur */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gris-doux hover:text-dore transition-colors duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-dore text-white text-xs font-medium px-2 py-0.5 min-w-[20px] h-[20px]">
                  {totalQty}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gris-doux hover:text-dore transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Ligne du bas - Navigation centrée */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-dore/20">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gris-doux hover:text-dore font-medium text-base transition-colors duration-300 relative group font-sans"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dore transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-white/30 z-50">
              <div className="px-6 py-8 space-y-6">
                {/* Logo mobile */}
                <div className="text-center pb-6 border-b border-gray-300">
                  <Link 
                    href="/" 
                    className="inline-block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src="/logo.png"
                      alt="Yapha Creative Studio"
                      width={600}
                      height={180}
                      className="h-40 w-auto mx-auto hover:scale-110 transition-all duration-300 ease-in-out"
                    />
                  </Link>
                </div>

                {/* Navigation links */}
                <div className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Actions mobile */}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  {/* Menu utilisateur mobile */}
                  <div className="px-4">
                    <UserMenu onLogin={openAuthModal} isMobileMenu={true} />
                  </div>
                  
                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5" />
                      Panier
                    </span>
                    {totalQty > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-gray-800 text-white text-xs font-bold px-2 py-0.5 min-w-[20px] h-[20px]">
                        {totalQty}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
