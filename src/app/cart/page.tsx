"use client";
import CheckoutButton from "@/components/CheckoutButton";
import { useCart } from "@/store/cart";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des ateliers à votre panier pour commencer</p>
          <Link
            href="/workshops"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Voir les ateliers
          </Link>
        </div>
      </div>
    );
  }

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Votre panier</h1>
            <button
              onClick={clear}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Vider le panier
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.qty} × {item.price} € = {item.qty * item.price} €
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-900">Total :</span>
              <span className="text-2xl font-bold text-blue-600">{total} €</span>
            </div>
            
            <div className="flex space-x-4">
              <CheckoutButton isCart />
              <Link
                href="/workshops"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center font-medium"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
