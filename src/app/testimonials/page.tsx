import SectionTitle from '@/components/ui/SectionTitle';

const testimonials = [
  {
    id: 1,
    name: "Marie L.",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    quote: "Un moment magique ! J'ai découvert la peinture à l'huile dans une ambiance incroyable. Sarah est une prof exceptionnelle."
  },
  {
    id: 2,
    name: "Thomas M.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "L'atelier crochet était parfait pour débuter. J'ai créé mon premier sac et j'en suis très fier !"
  },
  {
    id: 3,
    name: "Sophie D.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "L'ambiance est si chaleureuse ! On se sent tout de suite à l'aise. Je recommande vivement ces ateliers."
  },
  {
    id: 4,
    name: "Pierre R.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "La poterie m'a toujours fasciné. Grâce à cet atelier, j'ai pu enfin m'y mettre. Une expérience inoubliable !"
  },
  {
    id: 5,
    name: "Emma K.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    quote: "Le brunch peinture était parfait ! On mange bien, on crée, on rigole. Que demander de plus ?"
  },
  {
    id: 6,
    name: "Lucas B.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote: "La calligraphie moderne m'a ouvert de nouveaux horizons. Un art magnifique enseigné avec passion."
  }
];

export default function TestimonialsPage() {
  return (
    <div className="py-20">
      <SectionTitle 
        title="Nos souvenirs"
        subtitle="Découvrez les témoignages de nos participants et partagez leurs moments de bonheur créatif"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Quote */}
            <div className="mb-6">
              <svg className="w-8 h-8 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
            
            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center">
        <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Rejoignez notre communauté créative
          </h3>
          <p className="text-gray-600 mb-6">
            Partagez vos créations et vos moments de bonheur avec nous sur les réseaux sociaux
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#" 
              className="inline-flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              <span className="text-xl">📷</span>
              <span>Instagram</span>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <span className="text-xl">📘</span>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
