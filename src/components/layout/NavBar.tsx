'use client';

import { useCart } from '@/store/cart';
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

  // Navigation selon les spécifications
  const leftNavLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/workshops', label: 'L\'atelier' },
    { href: '/shop', label: 'Boutique' }
  ];

  const rightNavLinks = [
    { href: '/testimonials', label: 'Nos souvenirs' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-amber-50/95 shadow-lg backdrop-blur-md' : 'bg-amber-50/90 backdrop-blur-sm'
    }`}>
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Navigation gauche - Desktop */}
          <div className="hidden lg:flex items-center space-x-12">
            {leftNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-amber-900 hover:text-amber-700 font-medium text-sm transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Logo centré - Style Chill & Good Time */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="text-center">
                <div className="text-xs font-light text-amber-800 tracking-widest uppercase mb-1">
                  Chill and
                </div>
                <div className="text-3xl font-serif font-bold text-amber-900 group-hover:text-amber-700 transition-colors duration-200 tracking-tight">
                  Yapha Creative
                </div>
                <div className="text-xs font-light text-amber-800 tracking-widest uppercase mt-1">
                  Studio
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation droite - Desktop */}
          <div className="hidden lg:flex items-center space-x-12">
            {rightNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-amber-900 hover:text-amber-700 font-medium text-sm transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Actions droite - Login & Cart */}
          <div className="flex items-center space-x-8">
            {/* Se connecter avec icône */}
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-amber-900 hover:text-amber-700 font-medium text-sm transition-all duration-200 group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Se connecter</span>
            </button>
            
            {/* Panier avec compteur */}
            <Link 
              href="/cart" 
              className="relative p-2 text-amber-900 hover:text-amber-700 transition-all duration-200 group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-amber-800 text-white text-xs font-bold px-2 py-0.5 min-w-[20px] h-[20px] shadow-lg">
                  {totalQty}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-amber-900 hover:text-amber-700 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>
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
            <div className="absolute top-full left-0 right-0 bg-amber-50 shadow-xl border-t border-amber-200 z-50">
              <div className="px-6 py-8 space-y-6">
                {/* Logo mobile */}
                <div className="text-center pb-6 border-b border-amber-200">
                  <Link 
                    href="/" 
                    className="text-xl font-serif font-bold text-amber-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Yapha Creative Studio
                  </Link>
                </div>

                {/* Navigation links */}
                <div className="space-y-3">
                  {[...leftNavLinks, ...rightNavLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Actions mobile */}
                <div className="pt-6 border-t border-amber-200 space-y-4">
                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-4 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Panier
                    </span>
                    {totalQty > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-amber-800 text-white text-xs font-bold px-2 py-0.5 min-w-[20px] h-[20px]">
                        {totalQty}
                      </span>
                    )}
                  </Link>
                  
                  <button className="flex items-center space-x-2 w-full text-left px-4 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
