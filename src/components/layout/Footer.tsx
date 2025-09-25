import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-white bg-brun-clair relative">
      
      {/* Contenu du footer */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Adresse */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Adresse</h3>
            <div className="space-y-2 text-gray-200">
              <p>123 Rue de la Créativité</p>
              <p>75001 Paris, France</p>
              <p>Métro : Châtelet-Les Halles</p>
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Téléphone</h3>
            <div className="space-y-2 text-gray-200">
              <p>+33 1 23 45 67 89</p>
              <p>Lun - Ven : 9h - 19h</p>
              <p>Sam - Dim : 10h - 18h</p>
            </div>
          </div>

          {/* E-mail */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">E-mail</h3>
            <div className="space-y-2 text-gray-200">
              <p>contact@yapha-studio.fr</p>
              <p>ateliers@yapha-studio.fr</p>
              <p>Réponse sous 24h</p>
            </div>
          </div>

          {/* Me suivre */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-serif">Me suivre</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-200 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="text-gray-200 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="text-gray-200 hover:text-white transition-colors duration-300"
                aria-label="TikTok"
              >
                🎵
              </a>
              <a 
                href="#" 
                className="text-gray-200 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                📺
              </a>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Suivez nos créations au quotidien
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-dore/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2024 Yapha Creative Studio. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Politique de confidentialité
              </Link>
              <Link 
                href="/cgv" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                CGV
              </Link>
              <Link 
                href="/mentions-legales" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
