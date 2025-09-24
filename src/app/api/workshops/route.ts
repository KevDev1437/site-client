import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { data: workshops, error } = await supabase
      .from("workshops")
      .select("id, slug, title, date, location, price, seats, price_stripe_id, cover_url, excerpt")
      .order("date", { ascending: true });

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ workshops });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
