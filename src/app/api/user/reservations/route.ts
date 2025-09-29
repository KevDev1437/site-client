import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les réservations avec les détails de l'atelier
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        id,
        status,
        created_at,
        workshop:workshops(
          id,
          title,
          date,
          location,
          cover_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération réservations:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des réservations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      reservations: reservations || [] 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API réservations:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

