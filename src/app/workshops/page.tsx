'use client';

import EventCard from '@/components/cards/EventCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { workshops } from '@/data/workshops';
import { useMemo, useState } from 'react';

export default function WorkshopsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedWorkshops = useMemo(() => {
    let filtered = workshops.filter(workshop => 
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [searchTerm, sortOrder]);

  return (
    <div className="py-20">
      <SectionTitle 
        title="Tous nos ateliers"
        subtitle="Découvrez l'ensemble de nos ateliers créatifs et trouvez celui qui vous correspond"
      />

      {/* Filters and Sort */}
      <div className="mb-12 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-6">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par titre ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Trier par date :
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="asc">Plus proche</option>
            <option value="desc">Plus lointain</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-8">
        <p className="text-gray-600">
          {filteredAndSortedWorkshops.length} atelier{filteredAndSortedWorkshops.length > 1 ? 's' : ''} trouvé{filteredAndSortedWorkshops.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Workshops Grid */}
      {filteredAndSortedWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedWorkshops.map((workshop) => (
            <EventCard key={workshop.slug} workshop={workshop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun atelier trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}
