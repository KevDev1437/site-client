import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ error: "Supabase admin not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Mettre à jour tous les ateliers avec le nouveau price_id
    const newPriceId = process.env.STRIPE_PRICE_ID;
    if (!newPriceId) {
      return new Response(JSON.stringify({ error: "STRIPE_PRICE_ID not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('workshops')
      .update({ price_stripe_id: newPriceId })
      .neq('price_stripe_id', null);

    if (error) {
      console.error("❌ Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("✅ Prix mis à jour:", data);
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Prix mis à jour avec succès",
      updated: data 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
