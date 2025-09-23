import SectionTitle from '@/components/ui/SectionTitle';

export default function ContactTiles() {
  const contactItems = [
    {
      icon: '📍',
      title: 'Adresse',
      content: '123 Rue de la Créativité',
      subtitle: '75001 Paris, France',
      action: 'Voir sur la carte',
      href: '#'
    },
    {
      icon: '📞',
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      subtitle: 'Lun-Ven : 9h-19h',
      action: 'Appeler',
      href: 'tel:+33123456789'
    },
    {
      icon: '✉️',
      title: 'E-mail',
      content: 'contact@yapha-studio.fr',
      subtitle: 'Réponse sous 24h',
      action: 'Écrire',
      href: 'mailto:contact@yapha-studio.fr'
    },
    {
      icon: '📱',
      title: 'Réseaux',
      content: 'Suivez-nous',
      subtitle: 'Instagram, TikTok, YouTube',
      action: 'Découvrir',
      href: '#'
    }
  ];

  return (
    <section className="py-20">
      <SectionTitle 
        title="On se rencontre ?"
        subtitle="Plusieurs façons de nous contacter et de rester connectés"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="text-4xl mb-4">
              {item.icon}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            
            {/* Content */}
            <div className="space-y-2 mb-4">
              <p className="text-gray-900 font-medium">
                {item.content}
              </p>
              <p className="text-gray-600 text-sm">
                {item.subtitle}
              </p>
            </div>
            
            {/* Action button */}
            <a
              href={item.href}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              {item.action}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        ))}
      </div>
      
      {/* Additional info */}
      <div className="mt-12 text-center">
        <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Besoin d'aide pour choisir ?
          </h3>
          <p className="text-gray-600 mb-4">
            Notre équipe est là pour vous conseiller et vous aider à trouver 
            l'atelier qui vous correspond le mieux.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Demander conseil
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
