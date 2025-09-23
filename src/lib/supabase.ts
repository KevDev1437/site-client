import { createClient } from "@supabase/supabase-js";

// Debug des variables d'environnement
console.log("🔑 SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🔑 SUPABASE_KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "MISSING");

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables d'environnement Supabase manquantes. Vérifiez votre configuration.");
}

// Créer le client Supabase seulement si les variables sont définies
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
