import { createClient } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

// Types partagés
interface SimpleErrorShape {
  message?: string;
  code?: string;
  hint?: string;
  details?: string;
  [k: string]: unknown;
}

interface TableDiag {
  count?: number;
  rows?: number;
  error?: SimpleErrorShape | string | null;
  errors?: {
    products?: SimpleErrorShape | null;
    workshops?: SimpleErrorShape | null;
    testimonials?: SimpleErrorShape | null;
    [k: string]: SimpleErrorShape | null | undefined;
  } | null;
}

// Endpoint de diagnostic Supabase (GET /api/diagnostics/supabase)
export async function GET() {
  const startedAt = Date.now();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const envReport = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `${anonKey.slice(0,6)}…${anonKey.slice(-4)}` : null,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  interface DiagnosticsResult {
    ok: boolean;
    env: typeof envReport;
    warnings: string[];
    anon: TableDiag | Record<string, unknown>;
    admin: TableDiag | Record<string, unknown>;
    durationMs?: number;
    [k: string]: unknown; // extension future
  }

  const result: DiagnosticsResult = {
    ok: true,
    env: envReport,
    warnings: [],
    anon: {},
    admin: {},
  };

  // Vérification client anonyme
  try {
    const anon = createClient();
    const [products, workshops, testimonials] = await Promise.all([
      anon.from('products').select('id', { count: 'exact' }),
      anon.from('workshops').select('id', { count: 'exact' }).eq('published', true),
      anon.from('testimonials').select('id', { count: 'exact' }),
    ]);

    result.anon = {
      products: { count: products.count ?? 0, rows: products.data?.length ?? 0 },
      workshops: { count: workshops.count ?? 0, rows: workshops.data?.length ?? 0 },
      testimonials: { count: testimonials.count ?? 0, rows: testimonials.data?.length ?? 0 },
      errors: {
        products: products.error ? formatErr(products.error) : null,
        workshops: workshops.error ? formatErr(workshops.error) : null,
        testimonials: testimonials.error ? formatErr(testimonials.error) : null,
      }
    };
  } catch (e) {
    result.ok = false;
    result.anon = { error: formatErr(e) };
  }

  // Vérification admin si service role disponible
  if (!supabaseAdmin) {
    result.warnings.push('supabaseAdmin indisponible (clé service role manquante ?)');
  } else {
    try {
      const [productsA, workshopsA, testimonialsA] = await Promise.all([
        supabaseAdmin.from('products').select('id', { count: 'exact' }),
        supabaseAdmin.from('workshops').select('id', { count: 'exact' }),
        supabaseAdmin.from('testimonials').select('id', { count: 'exact' }),
      ]);
      result.admin = {
        products: { count: productsA.count ?? 0, rows: productsA.data?.length ?? 0 },
        workshops: { count: workshopsA.count ?? 0, rows: workshopsA.data?.length ?? 0 },
        testimonials: { count: testimonialsA.count ?? 0, rows: testimonialsA.data?.length ?? 0 },
        errors: {
          products: productsA.error ? formatErr(productsA.error) : null,
          workshops: workshopsA.error ? formatErr(workshopsA.error) : null,
          testimonials: testimonialsA.error ? formatErr(testimonialsA.error) : null,
        }
      };
    } catch (e) {
      result.admin = { error: formatErr(e) };
    }
  }

  // Analyse rapide RLS
  if (result.anon && result.admin && !('error' in result.anon) && !('error' in result.admin)) {
    const diffs: string[] = [];
    const keys: Array<'products' | 'workshops' | 'testimonials'> = ['products', 'workshops', 'testimonials'];
    for (const key of keys) {
      const aEntry = (result.anon as Record<string, unknown>)[key];
      const bEntry = (result.admin as Record<string, unknown>)[key];
      const aCount = (aEntry && typeof aEntry === 'object' && 'count' in aEntry) ? (aEntry as TableDiag).count : undefined;
      const bCount = (bEntry && typeof bEntry === 'object' && 'count' in bEntry) ? (bEntry as TableDiag).count : undefined;
      if ((bCount ?? 0) > 0 && (aCount ?? 0) === 0) {
        diffs.push(`${key}: admin=${bCount} vs anon=0 (policy SELECT manquante ?)`);
      }
    }
    if (diffs.length) result.warnings.push('RLS suspecte: ' + diffs.join('; '));
  }

  result.durationMs = Date.now() - startedAt;
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

function formatErr(e: unknown): SimpleErrorShape | string | null {
  if (!e) return null;
  if (typeof e === 'string') return e;
  if (typeof e === 'object') {
    const candidate = e as Record<string, unknown>;
    const out: SimpleErrorShape = {};
    for (const k of ['message', 'code', 'hint', 'details'] as const) {
      const v = candidate[k];
      if (typeof v === 'string') out[k] = v;
    }
    return Object.keys(out).length ? out : (e as SimpleErrorShape);
  }
  return null;
}
