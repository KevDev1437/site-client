import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();

    // Récupération de l'utilisateur courant via session cookie / header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les commandes avec les détails des produits/ateliers
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        currency,
        status,
        created_at,
        workshop:workshops(
          id,
          title,
          cover_url
        ),
        product:products(
          id,
          title,
          image_url
        ),
        items:order_items(
          id,
          quantity,
          unit_amount,
          currency,
          product:products(id, title, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération commandes:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des commandes' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      orders: orders || [] 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API commandes:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

