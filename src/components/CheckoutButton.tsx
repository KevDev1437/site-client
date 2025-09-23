"use client";
import { useCart } from "@/store/cart";
import { useState } from "react";

export default function CheckoutButton({ 
  priceId, 
  workshopSlug, 
  isCart = false 
}: { 
  priceId?: string; 
  workshopSlug?: string; 
  isCart?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { items } = useCart();

  const handleClick = async () => {
    try {
      setLoading(true);
      
      let requestBody;
      if (isCart) {
        // Mode panier : envoyer tous les items
        const lineItems = items.map((i) => ({
          price: i.priceId,
          quantity: i.qty,
        }));
        requestBody = { lineItems };
      } else if (priceId) {
        // Mode atelier unique
        requestBody = { priceId, workshopSlug };
      } else {
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else console.error("Stripe error:", data);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = isCart 
    ? (loading ? "Redirection..." : "Payer maintenant") 
    : (loading ? "Redirection..." : "Acheter des billets");

  return (
    <button
      onClick={handleClick}
      disabled={loading || (isCart && items.length === 0)}
      className="w-full inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50"
    >
      {buttonText}
    </button>
  );
}
