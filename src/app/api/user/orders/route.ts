import { createClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // Récupérer l'utilisateur depuis les headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
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
        )
      `)
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
