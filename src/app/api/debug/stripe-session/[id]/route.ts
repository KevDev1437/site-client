import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

/*
  GET /api/debug/stripe-session/:id?includeLineItems=1
  SECURITE: à sécuriser / retirer en production !
*/
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing session id' }), { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' }), { status: 500 });
  }
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ error: 'Supabase admin not configured' }), { status: 500 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion) || '2025-08-27.basil'
    });

    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['customer'] });

    // Chercher une commande/order associée
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', id)
      .maybeSingle();

    const { data: reservation } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .eq('stripe_session_id', id)
      .maybeSingle();

    // Optionnel: line items
    let lineItems: Stripe.ApiList<Stripe.LineItem> | undefined;
    try {
      lineItems = await stripe.checkout.sessions.listLineItems(id, { limit: 100 });
    } catch { /* ignore */ }

    return new Response(JSON.stringify({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
        customer_email: session.customer_details?.email,
        mode: session.mode,
        created: session.created
      },
      db: {
        order,
        reservation
      },
      lineItems: lineItems?.data?.map(li => ({
        id: li.id,
        description: li.description,
        price: li.price?.id,
        quantity: li.quantity,
        amount_subtotal: li.amount_subtotal,
        amount_total: li.amount_total
      })) || []
    }, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
}
