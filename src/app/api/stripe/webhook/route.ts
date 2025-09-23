import { supabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export const runtime = "nodejs";

// Lire le body brut
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
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("Webhook signature verification failed:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email || "unknown";
    const amount = session.amount_total || 0;
    const currency = session.currency || "eur";
    const workshopSlug = session.metadata?.workshopSlug;

    console.log("✅ Paiement confirmé:", { email, amount, currency, workshopSlug });

    if (workshopSlug) {
      try {
        // 1. Trouver l'atelier
        const { data: workshop } = await supabaseAdmin
          .from("workshops")
          .select("id,seats")
          .eq("slug", workshopSlug)
          .single();

        if (workshop) {
          // 2. Insérer la commande
          await supabaseAdmin.from("orders").insert({
            workshop_id: workshop.id,
            email,
            amount,
            currency,
            status: "paid",
            stripe_session_id: session.id,
          });

          // 3. Décrémenter les places
          await supabaseAdmin
            .from("workshops")
            .update({ seats: workshop.seats - 1 })
            .eq("id", workshop.id);

          console.log("✅ Commande enregistrée et places décrémentées");
        } else {
          console.error("❌ Atelier non trouvé:", workshopSlug);
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement:", error);
      }
    }
  } else {
    console.log("ℹ️ Event non géré:", event.type);
  }

  return new Response("ok", { status: 200 });
}
