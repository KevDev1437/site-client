import Stripe from "stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Session ID manquant" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Configuration Stripe manquante" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion) || "2025-08-27.basil"
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new Response(JSON.stringify({ error: "Session introuvable" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Extraire les informations de la session
    const amountTotal = session.amount_total || 0;
    const currency = session.currency || 'eur';
    const customerEmail = session.customer_details?.email || session.customer_email;
    const paymentStatus = session.payment_status;
    const metadata = session.metadata || {};

    // Déterminer le type d'achat et le nom du produit
    let productName = "Produit";
    if (metadata.type === "workshop" && metadata.workshopSlug) {
      productName = `Atelier ${metadata.workshopSlug}`;
    } else if (metadata.type === "product" && metadata.productName) {
      productName = metadata.productName;
    } else if (metadata.type === "cart") {
      productName = "Panier d'achats";
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        sessionId,
        amountTotal,
        currency,
        customerEmail,
        paymentStatus,
        productName,
        metadata
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Erreur récupération session Stripe:", error);
    return new Response(JSON.stringify({ 
      error: "Impossible de récupérer les informations du paiement" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

