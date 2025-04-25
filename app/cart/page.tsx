"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface CartItem {
  cartId: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  amount: number;
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, setCartItems } = useCartStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please login to view your cart.");
        return;
      }

      try {
        const response = await axios.get<CartItem[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`
        );
        if (typeof response.data === "string") {
          setCartItems([]);
          return;
        }
        const fetchedItems = response.data.map((item: CartItem) => ({
          cartId: item.cartId,
          productId: item.productId,
          name: item.productName,
          cost: item.amount,
          quantity: 1, // Backend doesn't return quantity yet
          categoryId: item.categoryId,
        }));
        setCartItems(fetchedItems);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to fetch cart items. Please try again.");
      }
    };

    fetchCart();
  }, [setCartItems]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Cart
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-center">
            {error}
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
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}