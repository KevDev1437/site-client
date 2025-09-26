'use client';

import { createClient } from '@/lib/supabase';
import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function DeleteAccountModal({ isOpen, onClose, userEmail }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmation !== 'SUPPRIMER MON COMPTE') {
      setError('Vous devez taper exactement "SUPPRIMER MON COMPTE"');
      return;
    }

    if (!password) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Vérifier le mot de passe en se reconnectant
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password
      });

      if (signInError) {
        setError('Mot de passe incorrect');
        setLoading(false);
        return;
      }

      // Supprimer le compte via l'API route avec suppression complète
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        setError('Session invalide');
        setLoading(false);
        return;
      }

      console.log('🔍 Envoi de la requête de suppression avec token:', session.session.access_token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/user/delete-account-complete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 Réponse de l\'API:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('🔍 Résultat de l\'API:', result);

      if (!response.ok) {
        setError(result.error || 'Erreur lors de la suppression du compte');
        setLoading(false);
        return;
      }

      // Se déconnecter et rediriger
      console.log('✅ Données utilisateur supprimées avec succès');
      setLoading(false);
      
      // Afficher le message de confirmation
      setShowConfirmation(true);
      
      // Se déconnecter et rediriger après 3 secondes
      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression du compte');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmation('');
    setError('');
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#8a5c3b] font-serif">
              Supprimer mon compte
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 font-sans text-sm mb-1">
                Attention ! Cette action est irréversible
              </h3>
              <p className="text-red-700 font-sans text-xs">
                Toutes vos données, réservations et achats seront définitivement supprimés.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a5c3b] focus:border-transparent font-sans"
                placeholder="Entrez votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-2">
              Confirmation
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a5c3b] focus:border-transparent font-sans"
              placeholder="Tapez: SUPPRIMER MON COMPTE"
              required
            />
            <p className="text-xs text-gray-500 font-sans mt-1">
              Tapez exactement : <span className="font-mono bg-gray-100 px-1 rounded">SUPPRIMER MON COMPTE</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 font-sans text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-sans transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !password || confirmation !== 'SUPPRIMER MON COMPTE'}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 font-sans transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Suppression...' : 'Supprimer définitivement'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Message de confirmation de suppression */}
      <DeleteConfirmationModal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
      />
    </div>
  );
}