// Utilitaires de formatage des erreurs Supabase
export function describeSupabaseError(e: unknown): string {
  if (!e) return '—';
  if (typeof e === 'string') return e;
  if (typeof e === 'object') {
    const anyErr = e as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof anyErr.message === 'string') parts.push(anyErr.message);
    if (typeof anyErr.code === 'string') parts.push(`code=${anyErr.code}`);
    if (typeof anyErr.hint === 'string') parts.push(`hint=${anyErr.hint}`);
    if (typeof anyErr.details === 'string') parts.push(`details=${anyErr.details}`);
    return parts.length ? parts.join(' | ') : '(erreur sans message)';
  }
  return String(e);
}

export interface SupabaseFetchMeta {
  table: string;
  filters?: Record<string, unknown>;
  count?: number;
}

export function logSupabaseFetch(meta: SupabaseFetchMeta, outcome: 'start' | 'success' | 'empty' | 'error', extra?: unknown) {
  const base = `[supabase:${meta.table}]`;
  switch (outcome) {
    case 'start':
      console.log(`${base} ▶️ fetch start`, meta.filters || '');
      break;
    case 'success':
      console.log(`${base} ✅ ${meta.count} lignes`);
      break;
    case 'empty':
      console.warn(`${base} ⚠️ 0 ligne retournée (pas d'erreur). Vérifiez seeding ou RLS.`);
      break;
    case 'error':
      console.error(`${base} ❌ erreur`, extra);
      break;
  }
}
