import { supabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";
import crypto from 'crypto';

// Type minimal pour PostgrestError (évite usage de any)
interface MinimalPostgrestError {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null; // ex: '23505' pour violation unique
}

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
  const secretRaw = process.env.STRIPE_WEBHOOK_SECRET || "";
  const secret = secretRaw.trim();

  // Logs de diagnostic minimisés (pas d'exposition du secret complet)
  const secretFingerprint = secret ? crypto.createHash('sha256').update(secret).digest('hex').slice(0,12) : 'missing';
  console.log('🔐 Webhook Debug:', {
    hasSignature: Boolean(sig),
    signatureLength: sig.length,
    secretProvided: !!secret,
    secretFingerprint,
    rawDiffers: secretRaw !== secret ? 'trimmed' : 'ok'
  });

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
      if (type === 'workshop' && !workshopId) {
        console.warn('⚠️ Type workshop sans workshopId dans metadata');
      }

      // Sécurité / validations basiques
      if (!userId || userId === 'anonymous') {
        console.warn("⚠️ userId manquant ou 'anonymous' dans la session – abandon du traitement");
        return new Response("Missing userId metadata", { status: 200 });
      }

      // Idempotence : si déjà traité, on sort immédiatement
      const { data: existingOrder, error: existingErr } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('stripe_session_id', session.id)
        .maybeSingle();

      if (existingErr) {
        console.error('❌ Erreur vérification idempotence:', existingErr);
      } else if (existingOrder) {
        console.log('🔁 Session déjà traitée – aucune action supplémentaire', existingOrder);
        return new Response('ok (already processed)', { status: 200 });
      }

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
        const { data: createdOrder, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          // Gestion duplicat (clé unique stripe_session_id)
          const pgErr = orderError as unknown as MinimalPostgrestError;
          if (pgErr.code === '23505') {
            console.warn('⚠️ Conflit unique (23505) sur orders – déjà créé.');
          } else {
            console.error("❌ Erreur création commande:", orderError);
            return new Response("Order creation failed", { status: 500 });
          }
        } else {
          console.log('🧾 Commande atelier créée:', createdOrder?.id);
        }

        // Créer la réservation
        const { data: createdReservation, error: reservationError } = await supabaseAdmin
          .from('reservations')
          .insert({
            user_id: userId,
            workshop_id: workshopId,
            stripe_session_id: session.id,
            status: 'confirmed'
          })
          .select()
          .single();

        if (reservationError) {
          const pgErr = reservationError as unknown as MinimalPostgrestError;
          if (pgErr.code === '23505') {
            console.warn('⚠️ Réservation déjà existante (duplicate)');
          } else {
            console.error("❌ Erreur création réservation:", reservationError);
          }
        } else {
          console.log('🧾 Réservation atelier créée:', createdReservation?.id);
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
        const { data: createdOrder, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          const pgErr = orderError as unknown as MinimalPostgrestError;
          if (pgErr.code === '23505') {
            console.warn('⚠️ Commande produit déjà existante (duplicate)');
          } else {
            console.error("❌ Erreur création commande:", orderError);
            return new Response("Order creation failed", { status: 500 });
          }
        } else {
          console.log('🧾 Commande produit créée:', createdOrder?.id);
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
        // Gestion du panier
        // On suppose que la session contient les line_items Stripe permet d'inférer les price -> product mapping côté base.
        // Ici simplification : on récupère les line_items via Stripe API pour extraire les price IDs.
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
          if (!lineItems.data.length) {
            console.warn('🛒 Aucun line item trouvé pour le panier');
            return new Response('No line items', { status: 200 });
          }

            // Créer l'ordre global (montant total déjà dans session.amount_total)
          const { data: createdCartOrder, error: cartOrderError } = await supabaseAdmin
            .from('orders')
            .insert({
              user_id: userId,
              stripe_session_id: session.id,
              amount: amountTotal,
              currency,
              status: 'paid'
            })
            .select()
            .single();

          if (cartOrderError) {
            const pgErr = cartOrderError as MinimalPostgrestError;
            if (pgErr.code === '23505') {
              console.warn('⚠️ Commande panier déjà existante');
              return new Response('ok (already processed)', { status: 200 });
            }
            console.error('❌ Erreur création commande panier:', cartOrderError);
            return new Response('Order (cart) creation failed', { status: 500 });
          }

          // Pour chaque line item, tenter de mapper vers un product via price_stripe_id
          const priceIds = lineItems.data
            .map(li => li.price?.id)
            .filter((p): p is string => Boolean(p));

          if (priceIds.length === 0) {
            console.warn('🛒 Pas de price ids exploitables dans le panier');
            return new Response('No price ids', { status: 200 });
          }

          // Récupérer les produits correspondants
          const { data: productsMatch, error: productsMatchError } = await supabaseAdmin
            .from('products')
            .select('id, price_stripe_id, stock, title')
            .in('price_stripe_id', priceIds);

          if (productsMatchError) {
            console.error('❌ Erreur récupération produits panier:', productsMatchError);
          }

          // Construire map price->product
          const productByPrice: Record<string, { id: string; stock: number; title: string }> = {};
          (productsMatch || []).forEach(p => { if (p.price_stripe_id) productByPrice[p.price_stripe_id] = { id: p.id, stock: p.stock, title: p.title }; });

          const orderItemsToInsert: Array<{ order_id: string; product_id: string; quantity: number; unit_amount: number; currency: string }> = [];
          const stockUpdates: Array<{ product_id: string; newStock: number }> = [];

          for (const li of lineItems.data) {
            const priceId = li.price?.id;
            if (!priceId) continue;
            const match = productByPrice[priceId];
            if (!match) {
              console.warn('⚠️ Price sans produit local correspondant:', priceId);
              continue;
            }
            const quantity = li.quantity || 1;
            // Stripe line item amount_subtotal est total pour la ligne; unit_amount_excluding_tax si présent
            const unitAmount = li.price?.unit_amount || Math.round(((li.amount_subtotal || 0) / (quantity || 1))); // fallback
            orderItemsToInsert.push({
              order_id: createdCartOrder.id,
              product_id: match.id,
              quantity,
              unit_amount: unitAmount || 0,
              currency: currency
            });

            const remaining = match.stock - quantity;
            if (remaining < 0) {
              console.warn('⚠️ Stock insuffisant détecté post-paiement pour', match.title);
            } else {
              stockUpdates.push({ product_id: match.id, newStock: remaining });
            }
          }

          if (orderItemsToInsert.length) {
            const { error: itemsError } = await supabaseAdmin
              .from('order_items')
              .insert(orderItemsToInsert);
            if (itemsError) {
              console.error('❌ Erreur insertion order_items:', itemsError);
            } else {
              console.log(`🧾 ${orderItemsToInsert.length} items insérés pour la commande panier ${createdCartOrder.id}`);
            }
          } else {
            console.warn('⚠️ Aucun order_item inséré (mapping vide)');
          }

          // Appliquer les décrémentations de stock en série
            for (const upd of stockUpdates) {
              const { error: stockError } = await supabaseAdmin
                .from('products')
                .update({ stock: upd.newStock })
                .eq('id', upd.product_id);
              if (stockError) {
                console.error('❌ Erreur mise à jour stock (cart):', stockError, upd);
              }
            }

          console.log('✅ Commande panier traitée:', { orderId: createdCartOrder.id, items: orderItemsToInsert.length });
        } catch (cartErr) {
          console.error('❌ Erreur traitement panier:', cartErr);
        }
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
