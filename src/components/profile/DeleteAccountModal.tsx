'use client';

import { supabase } from '@/lib/supabase';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function DeleteAccountModal({ isOpen, onClose, userEmail }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const expectedText = 'SUPPRIMER MON COMPTE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (confirmText !== expectedText) {
      setMessage({ type: 'error', text: 'Veuillez taper exactement "SUPPRIMER MON COMPTE"' });
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe' });
      setLoading(false);
      return;
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client non initialisé');
      }

      // 1. Vérifier le mot de passe en se reconnectant
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password
      });

      if (signInError) {
        throw new Error('Mot de passe incorrect');
      }

      // 2. Supprimer le compte utilisateur avec la fonction corrigée
      const { error } = await supabase.rpc('delete_user_corrected');

      if (error) {
        throw new Error(error.message);
      }

      setMessage({ type: 'success', text: 'Compte supprimé avec succès. Redirection...' });
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        router.push('/');
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue lors de la suppression' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmText('');
    setPassword('');
    setMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-red-600">
            Supprimer mon compte
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Avertissement */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Attention !</h3>
                <p className="text-red-700 text-sm">
                  Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées :
                </p>
                <ul className="text-red-700 text-sm mt-2 ml-4 list-disc">
                  <li>Votre profil et informations personnelles</li>
                  <li>Vos achats et historique</li>
                  <li>Vos réservations d&apos;ateliers</li>
                  <li>Votre compte de connexion</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Saisissez votre mot de passe"
                required
              />
            </div>

            {/* Confirmation texte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pour confirmer la suppression, tapez exactement :
              </label>
              <p className="text-sm text-gray-600 mb-3 font-mono bg-gray-100 p-2 rounded">
                SUPPRIMER MON COMPTE
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Tapez le texte ci-dessus"
                required
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Email du compte :</strong> {userEmail}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || confirmText !== expectedText || !password.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer définitivement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
