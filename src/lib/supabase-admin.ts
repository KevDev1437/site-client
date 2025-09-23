import { createClient } from "@supabase/supabase-js";

// Client Supabase avec service role key pour les opérations admin (webhook)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"
);
