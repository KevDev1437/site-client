export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-700">❌ Paiement annulé</h1>
      <p className="mt-4 text-gray-700">
        Votre paiement n&apos;a pas été finalisé. Vous pouvez réessayer ou choisir un autre atelier.
      </p>
      <a
        href="/workshops"
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Retour aux ateliers
      </a>
    </div>
  );
}