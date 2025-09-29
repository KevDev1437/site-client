import { createClient } from "@supabase/supabase-js";

// Diagnostic anti-spam
let warnedAdminEnv = false;

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if ((!supabaseUrl || !supabaseServiceKey) && !warnedAdminEnv) {
  warnedAdminEnv = true;
  const diagnostics = {
    SUPABASE_URL_defined: Boolean(process.env.SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_URL_defined: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY_present: supabaseServiceKey ? `yes(len=${supabaseServiceKey.length})` : 'no',
    NODE_ENV: process.env.NODE_ENV,
    loadedKeysSample: Object.keys(process.env || {}).filter(k => k.includes('SUPABASE') || k.startsWith('NEXT_PUBLIC_STRIPE')).slice(0,10)
  };
  console.warn("⚠️ Variables d'environnement Supabase Admin manquantes. Vérifiez votre configuration.", diagnostics);
}

// Client Supabase avec service role key pour les opérations admin (webhook)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
