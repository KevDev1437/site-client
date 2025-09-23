import Stripe from "stripe";

export async function POST(req: Request) {
  const { priceId, workshopSlug, lineItems } = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

  // Déterminer les line_items selon le mode
  let sessionLineItems;
  let metadata = {};

  if (lineItems) {
    // Mode panier : utiliser les lineItems fournis
    sessionLineItems = lineItems;
    metadata = { type: "cart" };
  } else if (priceId) {
    // Mode atelier unique
    sessionLineItems = [{ price: priceId, quantity: 1 }];
    metadata = workshopSlug ? { workshopSlug, type: "single" } : { type: "single" };
  } else {
    return new Response(JSON.stringify({ error: "Missing priceId or lineItems" }), { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: sessionLineItems,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cancel`,
    payment_method_types: ["card", "bancontact", "sepa_debit"],
    metadata,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
}
