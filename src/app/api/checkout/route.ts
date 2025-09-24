import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🔍 API Checkout appelée");
  
  let priceId, workshopSlug, lineItems, productName, productPrice, productId;
  
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
    productName = parsed.productName;
    productPrice = parsed.productPrice;
    productId = parsed.productId;
    
    console.log("📋 Parsed data:", { priceId, workshopSlug, lineItems, productName, productPrice, productId });
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
      // Mode produit unique ou atelier unique
      sessionLineItems = [{ price: priceId, quantity: 1 }];
      
      if (productName && productPrice && productId) {
        // Mode produit boutique
        metadata = { 
          productName, 
          productPrice: productPrice.toString(), 
          productId,
          type: "product" 
        };
        console.log("🛍️ Mode produit boutique:", { productName, productPrice, productId });
      } else if (workshopSlug) {
        // Mode atelier
        metadata = { workshopSlug, type: "workshop" };
        console.log("🎯 Mode atelier:", { priceId, workshopSlug });
      } else {
        metadata = { type: "single" };
        console.log("🎯 Mode générique:", { priceId });
      }
    } else {
      console.error("❌ Missing priceId or lineItems");
      return new Response(JSON.stringify({ error: "Missing priceId or lineItems" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("💳 Creating Stripe session...");
    
    // Déterminer l'URL de base et nettoyer les slashes
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
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
      // Configuration pour éviter les erreurs de sécurité
      automatic_tax: { enabled: false },
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'NL', 'DE'] },
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
