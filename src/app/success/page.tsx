import Link from "next/link";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
      <h1 className="text-3xl font-bold text-green-700">🎉 Merci pour votre réservation !</h1>
      <p className="mt-4 text-gray-700">
        Votre paiement a bien été confirmé. Vous recevrez un email avec les détails de votre atelier.
      </p>
      {session_id && (
        <p className="mt-2 text-sm text-gray-500">Session ID: {session_id}</p>
      )}
      <Link
        href="/workshops"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Retour aux ateliers
      </Link>
    </div>
  );
}
