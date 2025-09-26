import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Debug des variables d'environnement (seulement en développement)
if (process.env.NODE_ENV === 'development') {
  console.log("🔑 SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🔑 SUPABASE_KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "MISSING");
}

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables d'environnement Supabase manquantes. Vérifiez votre configuration.");
}

// Créer le client Supabase seulement si les variables sont définies
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Utiliser PKCE pour une meilleure sécurité
      },
      global: {
        headers: {
          'X-Client-Info': 'yapha-creative-studio'
        }
      }
    })
  : null;

// Export de la fonction createClient pour les composants client
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables d\'environnement Supabase manquantes');
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce' // Utiliser PKCE pour une meilleure sécurité
    },
    global: {
      headers: {
        'X-Client-Info': 'yapha-creative-studio'
      }
    }
  });
};
