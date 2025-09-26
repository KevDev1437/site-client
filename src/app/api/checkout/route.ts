import { supabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🔍 API Checkout appelée");
  
  if (!supabaseAdmin) {
    console.error("❌ Supabase Admin non configuré");
    return new Response(JSON.stringify({ error: "Supabase Admin not configured" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  let priceId, workshopSlug, lineItems, productName, productPrice, productId, userId, userEmail, successUrl, cancelUrl;
  
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
    userId = parsed.userId;
    userEmail = parsed.userEmail;
    successUrl = parsed.successUrl;
    cancelUrl = parsed.cancelUrl;
    
    console.log("🔍 Parsed URLs:", { 
      successUrl, 
      cancelUrl, 
      successUrlType: typeof successUrl, 
      cancelUrlType: typeof cancelUrl,
      successUrlLength: successUrl?.length,
      cancelUrlLength: cancelUrl?.length
    });
    console.log("👤 User info:", { userId, userEmail });
    
    console.log("📋 Parsed data:", { priceId, workshopSlug, lineItems, productName, productPrice, productId, successUrl, cancelUrl });
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
      metadata = { 
        type: "cart",
        userId: userId || "anonymous",
        userEmail: userEmail || "unknown"
      };
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
          type: "product",
          userId: userId || "anonymous",
          userEmail: userEmail || "unknown"
        };
        console.log("🛍️ Mode produit boutique:", { productName, productPrice, productId });
      } else if (workshopSlug) {
        // Mode atelier - récupérer l'ID de l'atelier
        const { data: workshop } = await supabaseAdmin
          .from('workshops')
          .select('id, seats, title')
          .eq('slug', workshopSlug)
          .single();

        if (!workshop) {
          console.error("❌ Atelier introuvable:", workshopSlug);
          return new Response(JSON.stringify({ error: "Workshop not found" }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        if (workshop.seats <= 0) {
          console.error("❌ Plus de places disponibles:", workshop.title);
          return new Response(JSON.stringify({ error: "No seats available" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        metadata = { 
          workshopId: workshop.id,
          workshopSlug, 
          type: "workshop",
          userId: userId || "anonymous",
          userEmail: userEmail || "unknown"
        };
        console.log("🎯 Mode atelier:", { priceId, workshopSlug, workshopId: workshop.id });
      } else {
        metadata = { 
          type: "single",
          userId: userId || "anonymous",
          userEmail: userEmail || "unknown"
        };
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
    
    // Déterminer les URLs de retour
    const finalSuccessUrl = successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cancel`;
    
    console.log("🔗 URLs de retour:", { 
      success: finalSuccessUrl, 
      cancel: finalCancelUrl,
      successUrlProvided: !!successUrl,
      cancelUrlProvided: !!cancelUrl,
      envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    // Vérifier que les URLs sont définies
    if (!finalSuccessUrl || !finalCancelUrl) {
      console.error("❌ URLs manquantes:", { 
        finalSuccessUrl, 
        finalCancelUrl,
        successUrlProvided: !!successUrl,
        cancelUrlProvided: !!cancelUrl
      });
      return new Response(JSON.stringify({ error: "Missing success or cancel URL" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Mode payment pour achats uniques
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: sessionLineItems,
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      payment_method_types: ["card", "bancontact", "sepa_debit"],
      metadata,
      // Configuration pour éviter les erreurs de sécurité
      automatic_tax: { enabled: false },
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'NL', 'DE'] },
    });

    console.log("✅ Stripe session created:", session.id);
    console.log("🔗 Session URL:", session.url);
    
    if (!session.url) {
      console.error("❌ Pas d'URL de session Stripe");
      return new Response(JSON.stringify({ error: "No session URL returned from Stripe" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
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
