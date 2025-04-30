"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  amount: number;
  stock: number;
  categoryId: number;
  description?: string;
}

export default function ElectronicsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElectronicsProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/catwiseproducts/1`);
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch electronics products. Please try again.");
        console.error("Error fetching electronics products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchElectronicsProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Electronics</h1>
        {products.length === 0 ? (
          <p className="text-gray-600">No electronics products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                amount={product.amount}
                stock={product.stock}
                categoryId={1} // Hardcoded since this page is for categoryId 1 (Electronics)
                image="/images/categories/electronics.jpg" // Use the placeholder image
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}