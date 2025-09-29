// No NextRequest import needed for simple help endpoint

export const runtime = 'nodejs';

/*
  Helper index route to document usage of the dynamic session debug endpoint.
  GET /api/debug/stripe-session  -> returns help JSON
  GET /api/debug/stripe-session/:id -> see [id]/route.ts
*/
export async function GET() {
  return new Response(JSON.stringify({
    help: 'Stripe Checkout Session debug endpoint',
    usage: [
      'GET /api/debug/stripe-session/{session_id}',
      'Optionally add ?includeLineItems=1 (déjà implicite, conservé pour compatibilité future)'
    ],
    example: '/api/debug/stripe-session/cs_test_12345',
    note: 'Si vous obtenez un 404 sur l\'URL avec un id, vérifiez que vous avez bien inclus le préfixe /api/ et que le serveur a redémarré après ajout du fichier. Sur un déploiement, redéployez pour inclure la nouvelle route.'
  }, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
