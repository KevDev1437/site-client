import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuration Supabase Admin manquante' }, { status: 500 });
    }
    
    // Récupérer l'utilisateur depuis le token d'authentification
    const authHeader = req.headers.get('authorization');
    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Token d\'authentification manquant' }, { status: 401 });
    }

    // Extraire le token du header Authorization
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Token length:', token.length);
    
    // Vérifier l'authentification avec le token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error('❌ Erreur d\'authentification:', authError);
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    console.log('🗑️ Suppression complète du compte utilisateur:', user.id);

    // Supprimer les données liées à l'utilisateur
    const { error: reservationsError } = await supabaseAdmin
      .from('reservations')
      .delete()
      .eq('user_id', user.id);

    if (reservationsError) {
      console.error('❌ Erreur suppression réservations:', reservationsError);
    }

    const { error: ordersError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('user_id', user.id);

    if (ordersError) {
      console.error('❌ Erreur suppression commandes:', ordersError);
    }

    const { error: profilesError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profilesError) {
      console.error('❌ Erreur suppression profil:', profilesError);
    }

    // Supprimer l'utilisateur de auth.users avec l'API Admin
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteUserError) {
      console.error('❌ Erreur suppression utilisateur:', deleteUserError);
      return NextResponse.json({ 
        error: 'Erreur lors de la suppression du compte: ' + deleteUserError.message 
      }, { status: 500 });
    }

    console.log('✅ Compte utilisateur supprimé avec succès:', user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Compte supprimé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du compte:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}
