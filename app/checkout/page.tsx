"use client";

import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string>("");

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.cost * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!address.trim()) {
      setError("Please provide a delivery address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      for (const item of cartItems) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
          {
            userId: parseInt(userId),
            productId: item.productId,
            address: address, // Changed from 'deliveryAddress' to 'address'
          }
        );
      }
      clearCart();
      setMessage("Order placed successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Checkout
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg text-center">
            {message}
          </div>
        )}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">Price: ${item.cost.toFixed(2)}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">
                      Subtotal: ${(item.cost * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                Order Summary
              </h2>
              <p className="text-gray-600 mt-2">
                Total Amount: ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                Delivery Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
              />
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}