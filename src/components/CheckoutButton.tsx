"use client";
import { useState } from "react";

export default function CheckoutButton({ priceId, workshopSlug }: { priceId: string; workshopSlug?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, workshopSlug }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else console.error("Stripe error:", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50"
    >
      {loading ? "Redirection..." : "Acheter des billets"}
    </button>
  );
}
