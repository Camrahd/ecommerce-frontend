"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
// import Link from "next/link";

interface Order {
  orderId: number;
  userId: number;
  username: string;
  productId: number;
  productName: string;
  address: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please login to view your orders.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${userId}`
        );
        if (typeof response.data === "string") {
          setError(response.data);
        } else {
          setOrders(response.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Orders
        </h1>
        {isLoading && (
          <p className="text-center text-gray-600">Loading orders...</p>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-center">
            {error}
          </div>
        )}
        {orders.length === 0 && !error && !isLoading && (
          <p className="text-center text-gray-600">No orders found.</p>
        )}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center bg-white p-4 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h2>
                  <p className="text-gray-600">Product: {order.productName}</p>
                  <p className="text-gray-600">Product ID: {order.productId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}