import SectionTitle from '@/components/ui/SectionTitle';
import { photos } from '@/data/photos';
import Image from 'next/image';

export default function PhotoMosaic() {
  return (
    <section className="py-20">
      <SectionTitle 
        title="Nos moments de partage"
        subtitle="Un regard sur la beauté simple des instants vécus ensemble."
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden rounded-lg group cursor-pointer ${
              index === 0 ? 'md:col-span-2 md:row-span-2' : ''
            } ${index === 1 ? 'md:col-span-1' : ''} ${
              index === 2 ? 'md:col-span-1' : ''
            } ${index === 3 ? 'md:col-span-2' : ''} ${
              index === 4 ? 'md:col-span-1' : ''
            } ${index === 5 ? 'md:col-span-1' : ''} ${
              index === 6 ? 'md:col-span-1' : ''
            } ${index === 7 ? 'md:col-span-1' : ''}`}
          >
            <div className="aspect-square">
              <Image
                src={photo}
                alt={`Moment d&apos;atelier ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Instagram CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Suivez-nous sur Instagram pour plus de moments créatifs
        </p>
        <a 
          href="#" 
          className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors duration-200"
        >
          <span className="text-2xl">📷</span>
          <span className="font-medium">@yapha_creative_studio</span>
        </a>
      </div>
    </section>
  );
}
