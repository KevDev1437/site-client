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
      metadata: session.metadata, // utile pour slug atelier
    });

    // TODO : insertion Supabase + décrément seats
  }

  // Log tout le reste
  else {
    console.log("ℹ️ Autre event reçu:", event);
  }

  return new Response("ok", { status: 200 });
}
