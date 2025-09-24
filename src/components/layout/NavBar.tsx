'use client';

import { useCart } from '@/store/cart';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { href: '/testimonials', label: 'Nos souvenirs' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-neutral-50/95 shadow-lg backdrop-blur-md' : 'bg-neutral-50/90 backdrop-blur-sm'
    }`}>
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Ligne du haut - Logo centré + Actions droite */}
        <div className="flex items-center justify-between h-64">
          {/* Espace vide à gauche pour équilibrer */}
          <div className="w-32"></div>
          
          {/* Logo centré */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Yapha Creative Studio"
                width={800}
                height={240}
                className="h-48 w-auto group-hover:opacity-80 transition-opacity duration-200"
                priority
              />
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-4">
            {/* Se connecter avec icône */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-gray-600 font-medium text-sm transition-colors duration-200">
              <User className="w-5 h-5" />
              <span>Se connecter</span>
            </button>
            
            {/* Panier avec compteur */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-gray-800 text-white text-xs font-bold px-2 py-0.5 min-w-[20px] h-[20px]">
                  {totalQty}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Ligne du bas - Navigation centrée */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-800 hover:text-gray-600 font-medium text-sm transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-200 group-hover:w-full"></span>
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
            <div className="absolute top-full left-0 right-0 bg-neutral-50 shadow-xl border-t border-gray-200 z-50">
              <div className="px-6 py-8 space-y-6">
                {/* Logo mobile */}
                <div className="text-center pb-6 border-b border-gray-200">
                  <Link 
                    href="/" 
                    className="inline-block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src="/logo.png"
                      alt="Yapha Creative Studio"
                      width={500}
                      height={150}
                      className="h-32 w-auto mx-auto"
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
                  
                  <button className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-800 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200">
                    <User className="w-5 h-5" />
                    <span>Se connecter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
