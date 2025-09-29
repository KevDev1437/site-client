import type { PostgrestMaybeSingleResponse, PostgrestSingleResponse } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env.local')
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'yapha-creative-studio'
    }
  }
})

// Fonction helper pour les requêtes avec gestion d'erreur
// Permet d'accepter soit une fonction qui retourne directement une Promesse supabase
// soit une fonction qui retourne un PostgrestFilterBuilder (thenable) que l'on peut await.
// Le typage interne de supabase renvoie { data, error } avec des types spécifiques; on reste souple ici.
// Surcharges pour mieux typer les réponses classiques (liste ou single)
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<PostgrestSingleResponse<T>>
): Promise<{ data: T | null; error: unknown }>
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<PostgrestMaybeSingleResponse<T>>
): Promise<{ data: T | null; error: unknown }>
export async function safeSupabaseQuery<T>(
  // Fallback générique (any requête { data; error })
  queryFn: () => Promise<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: unknown }>
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>
) {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Erreur Supabase:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error('Erreur lors de la requête Supabase:', err);
    return { data: null, error: err };
  }
}
