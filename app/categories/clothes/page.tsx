// app/categories/clothes/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  category: string;
  amount: number;
  stock: number;
  image: string;
}

export default function ClothesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClothesProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/catwiseproducts/2`); // Category ID 2 for clothes
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch clothes products. Please try again.");
        console.error("Error fetching clothes products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClothesProducts();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Clothes</h1>
        {products.length === 0 ? (
          <p className="text-gray-600">No clothes products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                amount={product.amount}
                stock={product.stock}
                image={product.image || "/images/products/placeholder.jpg"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}