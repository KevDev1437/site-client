'use client';

import DeleteAccountModal from '@/components/profile/DeleteAccountModal';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { Edit, LogOut, Palette, ShoppingBag, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

interface Reservation {
  id: string;
  status: string;
  created_at: string;
  stripe_session_id?: string;
  workshop: {
    id: string;
    title: string;
    date: string;
    location: string;
    cover_url: string;
    price: number;
  };
}

interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  workshop?: { title: string; date: string } | null;
  product?: { title: string; price: number } | null;
  items?: Array<{
    id: string;
    quantity: number;
    unit_amount: number;
    currency: string;
    product?: { id: string; title: string; image_url?: string } | null;
  }>; // présent pour les commandes panier
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      const supabase = createClient();
      
      console.log('🔍 Récupération des données pour l\'utilisateur:', user.id);
      
      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.log('⚠️ Pas de profil trouvé, utilisation des métadonnées utilisateur');
      }
      
      setUserProfile(profile || {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        phone: user.user_metadata?.phone,
        avatar_url: user.user_metadata?.avatar_url
      });

      // Récupérer les réservations (requête simplifiée)
      console.log('🔍 Recherche des réservations...');
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id);

      if (reservationsError) {
        console.error('❌ Erreur réservations:', reservationsError.message);
        setReservations([]);
      } else {
        console.log('✅ Réservations trouvées:', reservationsData?.length || 0);
        setReservations(reservationsData || []);
      }

      // Récupérer les commandes avec les relations
      console.log('🔍 Recherche des commandes...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, workshop:workshops(title, date), product:products(title, price)')
        .eq('user_id', user.id);

      if (ordersError) {
        console.error('❌ Erreur commandes:', ordersError.message);
        setOrders([]);
      } else {
        console.log('✅ Commandes trouvées:', ordersData?.length || 0);
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && loading) {
      fetchUserData();
    }
  }, [user, loading, fetchUserData]); // Seulement quand l'ID utilisateur change

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleEditProfile = () => {
    // Rediriger vers une page d'édition ou ouvrir un modal
    alert('Fonctionnalité d\'édition à implémenter');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8ecdd] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-[#8a5c3b] mb-2 font-serif">
            Connexion requise
          </h1>
          <p className="text-gray-600 font-sans mb-4">
            Vous devez être connecté pour accéder à votre profil
          </p>
          <Link 
            href="/auth/login"
            className="bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-4 py-2 font-sans transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8ecdd] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a5c3b] mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8ecdd] pt-28 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8a5c3b] mb-2 font-serif">
            Mon Profil
          </h1>
          <p className="text-gray-600 font-sans">
            Gérez vos informations et consultez votre historique
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-[#8a5c3b] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#8a5c3b] font-serif">
                {userProfile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur'}
              </h2>
              <p className="text-gray-600 font-sans">{userProfile?.email || user.email}</p>
              {(userProfile?.phone || user.user_metadata?.phone) && (
                <p className="text-gray-500 font-sans text-sm">
                  📞 {userProfile?.phone || user.user_metadata?.phone}
                </p>
              )}
              <p className="text-gray-500 font-sans text-sm mt-1">
                ID: {user.id}
              </p>
            </div>
          </div>
          
          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-700 font-sans text-sm mb-2">Informations du compte</h3>
              <p className="text-xs text-gray-600 font-sans">Email vérifié: {user.email_confirmed_at ? '✅ Oui' : '❌ Non'}</p>
              <p className="text-xs text-gray-600 font-sans">Dernière connexion: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 font-sans text-sm mb-2">Statistiques</h3>
              <p className="text-xs text-gray-600 font-sans">Réservations: {reservations.length}</p>
              <p className="text-xs text-gray-600 font-sans">Achats: {orders.length}</p>
            </div>
          </div>
          
          {/* Actions utilisateur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleEditProfile}
              className="flex items-center justify-center gap-2 bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-4 py-3 font-sans transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier mon compte
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-3 font-sans transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer mon compte
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-3 font-sans transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Réservations et Achats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mes Réservations */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#8a5c3b] rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#8a5c3b] font-serif">
                Mes Réservations
              </h2>
            </div>
            
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold text-gray-700 font-serif mb-2">
                  Aucune réservation pour le moment
                </h3>
                <p className="text-gray-500 font-sans mb-6">
                  Découvrez nos ateliers créatifs et réservez votre place
                </p>
                <Link 
                  href="/workshops"
                  className="inline-block bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-6 py-3 font-sans transition-colors"
                >
                  Découvrir les ateliers
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 font-sans text-sm mb-1">
                          Réservation #{reservation.id.slice(0, 8)}
                        </h3>
                        <p className="text-xs text-gray-600 font-sans mb-1">
                          ID Atelier: {reservation.workshop.id}
                        </p>
                        <p className="text-xs text-gray-600 font-sans mb-2">
                          Session: {reservation.stripe_session_id?.slice(0, 20)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                          <span className="text-xs text-gray-500 font-sans">
                            {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mes Achats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#8a5c3b] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#8a5c3b] font-serif">
                Mes Achats
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-lg font-semibold text-gray-700 font-serif mb-2">
                  Aucun achat pour le moment
                </h3>
                <p className="text-gray-500 font-sans mb-6">
                  Découvrez notre boutique et trouvez vos outils créatifs
                </p>
                <Link 
                  href="/boutique"
                  className="inline-block bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-6 py-3 font-sans transition-colors"
                >
                  Découvrir la boutique
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {order.workshop ? '🎨' : '🛍️'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 font-sans text-sm mb-1">
                          Commande #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-xs text-gray-600 font-sans mb-1">
                          💰 {formatAmount(order.amount, order.currency)}
                        </p>
                        {order.workshop && (
                          <p className="text-xs text-gray-500 font-sans mb-1">
                            🎨 Atelier: {order.workshop.title}
                          </p>
                        )}
                        {order.product && (
                          <p className="text-xs text-gray-500 font-sans mb-1">
                            🛒 Produit: {order.product.title}
                          </p>
                        )}
                        {!order.workshop && !order.product && order.items && order.items.length > 0 && (
                          <div className="text-xs text-gray-500 font-sans mb-1 space-y-1">
                            <p className="font-semibold">🛍️ Panier ({order.items.length} article{order.items.length>1?'s':''}) :</p>
                            <ul className="list-disc ml-4 space-y-0.5">
                              {order.items.map(it => (
                                <li key={it.id} className="truncate">
                                  {it.product?.title || 'Produit'} x{it.quantity} — {formatAmount(it.unit_amount * it.quantity, it.currency)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {!order.workshop && !order.product && (
                          <p className="text-xs text-gray-500 font-sans mb-1">
                            📦 Commande générale
                          </p>
                        )}
                        <p className="text-xs text-gray-500 font-sans mb-2">
                          Session: {order.stripe_session_id?.slice(0, 20)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'paid' ? 'Payé' : 'En attente'}
                          </span>
                          <span className="text-xs text-gray-500 font-sans">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <Link 
            href="/boutique"
            className="bg-[#8a5c3b] hover:bg-[#a67c52] text-white rounded-lg px-8 py-3 font-medium font-sans transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>

      {/* Modal de suppression de compte */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={user?.email || ''}
      />
    </div>
  );
}