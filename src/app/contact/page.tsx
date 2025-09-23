'use client';

import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    service: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.");
      setFormData({
        name: '',
        email: '',
        message: '',
        service: '',
        budget: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="py-20">
      <SectionTitle 
        title="Contactez-nous"
        subtitle="Une question ? Un projet ? N&apos;hésitez pas à nous écrire, nous serons ravis de vous répondre"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Envoyez-nous un message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom et prénom"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Type de prestation
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez une option</option>
                <option value="atelier-individuel">Atelier individuel</option>
                <option value="atelier-groupe">Atelier de groupe</option>
                <option value="evenement-prive">Événement privé</option>
                <option value="formation-entreprise">Formation entreprise</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget approximatif
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez une fourchette</option>
                <option value="0-50">0 - 50€</option>
                <option value="50-100">50 - 100€</option>
                <option value="100-200">100 - 200€</option>
                <option value="200-500">200 - 500€</option>
                <option value="500+">500€ et plus</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Votre message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez votre projet ou posez votre question..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Nos coordonnées
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📍</div>
                <div>
                  <h4 className="font-medium text-gray-900">Adresse</h4>
                  <p className="text-gray-600">
                    123 Rue de la Créativité<br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📞</div>
                <div>
                  <h4 className="font-medium text-gray-900">Téléphone</h4>
                  <p className="text-gray-600">+33 1 23 45 67 89</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">✉️</div>
                <div>
                  <h4 className="font-medium text-gray-900">E-mail</h4>
                  <p className="text-gray-600">contact@yapha-studio.fr</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Horaires d&apos;ouverture
            </h3>
            
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span className="font-medium">9h - 19h</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span className="font-medium">10h - 18h</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span className="font-medium">10h - 17h</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-pink-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Suivez-nous
            </h3>
            
            <div className="flex space-x-4">
              <a href="#" className="text-3xl hover:scale-110 transition-transform duration-200">
                📷
              </a>
              <a href="#" className="text-3xl hover:scale-110 transition-transform duration-200">
                📘
              </a>
              <a href="#" className="text-3xl hover:scale-110 transition-transform duration-200">
                🎵
              </a>
              <a href="#" className="text-3xl hover:scale-110 transition-transform duration-200">
                📺
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
