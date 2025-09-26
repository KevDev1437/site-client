import { supabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export const runtime = "nodejs";

async function readRawBody(req: Request) {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];
  if (!reader) return Buffer.from([]);
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const rawBody = await readRawBody(req);
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Erreur de signature Webhook:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  console.log("📩 Event Stripe reçu:", event.type);

  // Cas 1 : Paiement validé
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Paiement confirmé:", {
      sessionId: session.id,
      email: session.customer_details?.email,
      amount: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });

    if (!supabaseAdmin) {
      console.warn("⚠️ Supabase Admin non configuré. Impossible de sauvegarder la commande.");
      return new Response("Supabase Admin not configured", { status: 500 });
    }

    try {
      const { type, userId, workshopId, productId } = session.metadata || {};
      const amountTotal = session.amount_total || 0;
      const currency = session.currency || 'eur';

      console.log("🔍 Métadonnées session:", { type, userId, workshopId, productId, amountTotal });

      // Créer l'enregistrement dans orders
      const orderData: {
        user_id: string;
        stripe_session_id: string;
        amount: number;
        currency: string;
        status: string;
        workshop_id?: string;
        product_id?: string;
      } = {
        user_id: userId,
        stripe_session_id: session.id,
        amount: amountTotal,
        currency: currency,
        status: 'paid'
      };

      if (type === "workshop" && workshopId && userId) {
        // Gestion d'un atelier
        orderData.workshop_id = workshopId;

        const { data: workshop } = await supabaseAdmin
          .from('workshops')
          .select('id, seats, title')
          .eq('id', workshopId)
          .single();

        if (!workshop) {
          console.error("❌ Atelier introuvable:", workshopId);
          return new Response("Workshop not found", { status: 404 });
        }

        if (workshop.seats <= 0) {
          console.error("❌ Plus de places disponibles pour l'atelier:", workshop.title);
          return new Response("No seats available", { status: 400 });
        }

        // Créer la commande
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          console.error("❌ Erreur création commande:", orderError);
          return new Response("Order creation failed", { status: 500 });
        }

        // Créer la réservation
        const { error: reservationError } = await supabaseAdmin
          .from('reservations')
          .insert({
            user_id: userId,
            workshop_id: workshopId,
            stripe_session_id: session.id,
            status: 'confirmed'
          });

        if (reservationError) {
          console.error("❌ Erreur création réservation:", reservationError);
        }

        // Décrémenter les places disponibles
        const { error: updateError } = await supabaseAdmin
          .from('workshops')
          .update({ seats: workshop.seats - 1 })
          .eq('id', workshopId);

        if (updateError) {
          console.error("❌ Erreur mise à jour places:", updateError);
        } else {
          console.log("✅ Réservation créée et places décrémentées pour:", workshop.title);
        }

      } else if (type === "product" && productId && userId) {
        // Gestion d'un produit
        orderData.product_id = productId;

        const { data: product } = await supabaseAdmin
          .from('products')
          .select('id, stock, title')
          .eq('id', productId)
          .single();

        if (!product) {
          console.error("❌ Produit introuvable:", productId);
          return new Response("Product not found", { status: 404 });
        }

        if (product.stock <= 0) {
          console.error("❌ Plus de stock disponible pour le produit:", product.title);
          return new Response("No stock available", { status: 400 });
        }

        // Créer la commande
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          console.error("❌ Erreur création commande:", orderError);
          return new Response("Order creation failed", { status: 500 });
        }

        // Décrémenter le stock
        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({ stock: product.stock - 1 })
          .eq('id', productId);

        if (updateError) {
          console.error("❌ Erreur mise à jour stock:", updateError);
        } else {
          console.log("✅ Achat créé et stock décrémenté pour:", product.title);
        }

      } else if (type === "cart" && userId) {
        // Gestion du panier (à implémenter selon vos besoins)
        console.log("🛒 Gestion panier à implémenter");
      } else {
        console.error("❌ Type de paiement non reconnu ou métadonnées manquantes:", { type, userId, workshopId, productId });
      }

    } catch (error) {
      console.error("❌ Erreur lors du traitement du paiement:", error);
    }
  }

  // Log tout le reste
  else {
    console.log("ℹ️ Autre event reçu:", event);
  }

  return new Response("ok", { status: 200 });
}
