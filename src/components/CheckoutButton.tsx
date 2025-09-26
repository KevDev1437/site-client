"use client";
import { useAuthModal } from "@/components/auth/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleClick = async () => {
    // Vérifier l'authentification
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données de base
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/cancel`;
      
      console.log("🔗 URLs préparées:", { successUrl, cancelUrl, baseUrl });
      
      let requestBody;
      if (isCart) {
        // Mode panier : envoyer tous les items
        const lineItems = items.map((i) => ({
          price: i.priceId,
          quantity: i.qty,
        }));
        requestBody = { 
          lineItems,
          userId: user.id,
          userEmail: user.email,
          successUrl,
          cancelUrl
        };
      } else if (priceId) {
        // Mode atelier unique
        requestBody = { 
          priceId, 
          workshopSlug,
          userId: user.id,
          userEmail: user.email,
          successUrl,
          cancelUrl
        };
      } else {
        console.error("❌ Aucun priceId ou items dans le panier");
        return;
      }

      console.log("📤 Envoi vers API:", requestBody);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ API Error:", res.status, errorData);
        alert("Erreur lors de la création de la session de paiement. Veuillez réessayer.");
        return;
      }
      
      const data = await res.json();
      if (data?.url) {
        console.log("✅ Redirection vers Stripe:", data.url);
        window.location.href = data.url;
      } else {
        console.error("❌ Pas d'URL de redirection:", data);
        alert("Erreur lors de la création de la session de paiement.");
      }
    } catch (error) {
      console.error("❌ Erreur lors du checkout:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
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
