import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🔍 API Checkout appelée");
  
  let priceId, workshopSlug, lineItems;
  
  try {
    const body = await req.text();
    console.log("📦 Request body:", body);
    
    if (!body) {
      console.error("❌ Empty request body");
      return new Response(JSON.stringify({ error: "Empty request body" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const parsed = JSON.parse(body);
    priceId = parsed.priceId;
    workshopSlug = parsed.workshopSlug;
    lineItems = parsed.lineItems;
    
    console.log("📋 Parsed data:", { priceId, workshopSlug, lineItems });
  } catch (error) {
    console.error("❌ JSON parsing error:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY");
    return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  console.log("🔑 Stripe key present, initializing Stripe...");
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
      apiVersion: (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion) || "2025-08-27.basil" 
    });
    console.log("✅ Stripe initialized");

    // Déterminer les line_items selon le mode
    let sessionLineItems;
    let metadata = {};

    if (lineItems) {
      // Mode panier : utiliser les lineItems fournis
      sessionLineItems = lineItems;
      metadata = { type: "cart" };
      console.log("🛒 Mode panier:", lineItems);
    } else if (priceId) {
      // Mode atelier unique
      sessionLineItems = [{ price: priceId, quantity: 1 }];
      metadata = workshopSlug ? { workshopSlug, type: "single" } : { type: "single" };
      console.log("🎯 Mode atelier unique:", { priceId, workshopSlug });
    } else {
      console.error("❌ Missing priceId or lineItems");
      return new Response(JSON.stringify({ error: "Missing priceId or lineItems" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("💳 Creating Stripe session...");
    
    // Déterminer l'URL de base
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      console.error("❌ Missing NEXT_PUBLIC_SITE_URL");
      return new Response(JSON.stringify({ error: "Missing NEXT_PUBLIC_SITE_URL" }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }
    console.log("🌐 Base URL:", baseUrl);
    
    // Mode payment pour achats uniques
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: sessionLineItems,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      payment_method_types: ["card", "bancontact", "sepa_debit"],
      metadata,
    });

    console.log("✅ Stripe session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("❌ Stripe error:", error);
    return new Response(JSON.stringify({ error: "Stripe error: " + (error as Error).message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
