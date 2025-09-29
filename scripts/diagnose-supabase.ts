#!/usr/bin/env ts-node
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function envFlag(name: string) {
  return process.env[name] ? '✅' : '❌';
}

async function main() {
  console.log('🔎 Diagnostic Supabase (CLI)');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('ENV:', {
    NEXT_PUBLIC_SUPABASE_URL: envFlag('NEXT_PUBLIC_SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `✅ (${anonKey.slice(0,6)}…${anonKey.slice(-4)})` : '❌',
    SUPABASE_SERVICE_ROLE_KEY: envFlag('SUPABASE_SERVICE_ROLE_KEY'),
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    console.error('⛔ Variables publiques manquantes, arrêt.');
    process.exit(1);
  }

  const client = createSupabaseClient(url, anon);
  const tables = ['products', 'workshops', 'testimonials'];
  for (const t of tables) {
    const { data, count, error } = await client.from(t).select('id', { count: 'exact' });
    if (error) {
      console.log(`❌ ${t}:`, summarizeError(error));
    } else {
      console.log(`📊 ${t}: count=${count ?? 0} rowsLoaded=${data?.length ?? 0} (anon)`);
    }
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createSupabaseClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    for (const t of tables) {
      const { data, count, error } = await admin.from(t).select('id', { count: 'exact' });
      if (error) {
        console.log(`(admin) ❌ ${t}:`, summarizeError(error));
      } else {
        console.log(`(admin) 📊 ${t}: count=${count ?? 0} rowsLoaded=${data?.length ?? 0}`);
      }
    }
  } else {
    console.log('⚠️ Pas de clé service role → partie admin ignorée.');
  }
}

function summarizeError(e: unknown) {
  if (typeof e === 'object' && e !== null) {
    const obj = e as Record<string, unknown>;
    return {
      message: typeof obj.message === 'string' ? obj.message : undefined,
      code: typeof obj.code === 'string' ? obj.code : undefined,
      hint: typeof obj.hint === 'string' ? obj.hint : undefined,
      details: typeof obj.details === 'string' ? obj.details : undefined,
    };
  }
  return { message: String(e) };
}

main().catch(err => {
  console.error('Erreur inattendue diagnostic:', err);
  process.exit(1);
});
