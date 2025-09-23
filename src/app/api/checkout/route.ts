import Stripe from "stripe";

export async function POST(req: Request) {
  const { priceId, workshopSlug } = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), { status: 500 });
  }
  if (!priceId) {
    return new Response(JSON.stringify({ error: "Missing priceId" }), { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cancel`,
    payment_method_types: ["card", "bancontact", "sepa_debit"],
    metadata: workshopSlug ? { workshopSlug } : {},
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
}
