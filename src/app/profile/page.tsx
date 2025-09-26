'use client';

import Button from '@/components/ui/Button';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import DeleteAccountModal from '@/components/profile/DeleteAccountModal';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import { supabase } from '@/lib/supabase';
import { Calendar, Edit, Heart, Key, LogOut, Mail, Phone, ShoppingBag, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

interface Purchase {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  purchase_date: string;
  status: string;
}

interface WorkshopBooking {
  id: string;
  workshop_name: string;
  workshop_date: string;
  booking_date: string;
  status: string;
  price: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; created_at?: string; email_confirmed_at?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [bookings, setBookings] = useState<WorkshopBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        console.error('Supabase client non initialisé');
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Récupérer le profil depuis la table profiles
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Erreur lors de la récupération du profil:', error);
        } else {
          setProfile(profileData);
        }

        // Récupérer les achats
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('user_id', session.user.id)
          .order('purchase_date', { ascending: false });

        if (purchasesError) {
          console.error('Erreur lors de la récupération des achats:', purchasesError);
        } else {
          setPurchases(purchasesData || []);
        }

        // Récupérer les réservations d'ateliers
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('workshop_bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('workshop_date', { ascending: false });

        if (bookingsError) {
          console.error('Erreur lors de la récupération des réservations:', bookingsError);
        } else {
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Écouter les changements d'authentification
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event) => {
          if (event === 'SIGNED_OUT') {
            setIsLoggedOut(true);
            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [router]);

  const handleLogout = async () => {
    if (!supabase) {
      console.error('Supabase client non initialisé');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } else {
        setIsLoggedOut(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProfileUpdate = async () => {
    // Recharger les données du profil
    if (!supabase) {
      console.error('Supabase client non initialisé');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }

      setUser(session.user);

      // Récupérer le profil depuis la table profiles
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du profil:', error);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-clair flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-beige-clair flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-rose-poudre/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <User className="w-10 h-10 text-terracotta" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Accès restreint
          </h1>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à votre profil.
          </p>
          <Button 
            href="/" 
            className="bg-terracotta hover:bg-rose-poudre text-white rounded-full px-6 py-2"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-beige-clair flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <LogOut className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Déconnexion réussie
          </h1>
          <p className="text-gray-600">
            Vous allez être redirigé vers la page d&apos;accueil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-clair py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Mon Profil
          </h1>
          <p className="text-gray-600">
            Gérez vos informations et vos réservations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Informations */}
                <div className="flex-1">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    {profile?.full_name || 'Nom non renseigné'}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="font-sans">{user.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="font-sans">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.bio && (
                    <p className="text-gray-600 font-sans leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      console.log('🔍 Clic sur Modifier le profil', { showEditModal, profile });
                      setShowEditModal(true);
                    }}
                    className="bg-terracotta hover:bg-rose-poudre text-white rounded-lg px-4 py-2 font-sans transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier le profil
                  </button>
                  
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-4 py-2 font-sans transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Changer le mot de passe
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-sans transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer le compte
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-sans transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>

            {/* Mes Ateliers Réservés */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-terracotta" />
                <h3 className="text-xl font-serif font-semibold text-gray-900">
                  Mes Ateliers Réservés ({bookings.length})
                </h3>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-sans">
                    Aucun atelier réservé pour le moment
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Découvrez nos ateliers créatifs
                  </p>
                  <Button 
                    href="/workshops" 
                    className="mt-4 bg-terracotta hover:bg-rose-poudre text-white rounded-full px-6 py-2"
                  >
                    Voir les ateliers
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.workshop_name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.workshop_date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Réservé le {new Date(booking.booking_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-terracotta">{booking.price}€</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmé' :
                             booking.status === 'pending' ? 'En attente' :
                             booking.status === 'cancelled' ? 'Annulé' :
                             booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mes Achats */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-terracotta" />
                <h3 className="text-xl font-serif font-semibold text-gray-900">
                  Mes Achats ({purchases.length})
                </h3>
              </div>
              
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-sans">
                    Aucun achat pour le moment
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Découvrez notre boutique
                  </p>
                  <Button 
                    href="/shop" 
                    className="mt-4 bg-terracotta hover:bg-rose-poudre text-white rounded-full px-6 py-2"
                  >
                    Voir la boutique
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{purchase.product_name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantité: {purchase.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Acheté le {new Date(purchase.purchase_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-terracotta">
                            {(purchase.product_price * purchase.quantity).toFixed(2)}€
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                            purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            purchase.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {purchase.status === 'completed' ? 'Terminé' :
                             purchase.status === 'pending' ? 'En attente' :
                             purchase.status === 'cancelled' ? 'Annulé' :
                             purchase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
                Informations du compte
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-sans">Membre depuis</p>
                  <p className="text-gray-900 font-sans">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long'
                    }) : 'Non disponible'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 font-sans">Statut</p>
                  <p className="text-green-600 font-sans font-medium">
                    {user.email_confirmed_at ? 'Compte vérifié' : 'En attente de vérification'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {profile && user && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => {
            console.log('🔍 Fermeture du modal');
            setShowEditModal(false);
          }}
          profile={profile}
          user={user}
          onUpdate={handleProfileUpdate}
        />
      )}

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={user?.email || ''}
      />
    </div>
  );
}
