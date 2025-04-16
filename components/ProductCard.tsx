// components/ProductCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import axios, { AxiosError } from "axios";

type ProductCardProps = {
  id: number;
  name: string;
  amount: number;
  stock: number;
  image: string;
};

interface ErrorResponse {
  message?: string;
}

export default function ProductCard({ id, name, amount, stock, image }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login to add items to cart.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`, {
        userId: parseInt(userId),
        productId: id,
        quantity: 1,
      });
      alert(`${name} added to cart!`);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || "Failed to add to cart."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={(e) => {
          e.currentTarget.src = "/images/products/placeholder.jpg";
        }}
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">${amount.toFixed(2)}</p>
        <p className="text-gray-600">Stock: {stock}</p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
            isLoading || stock === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || stock === 0}
        >
          {isLoading ? "Adding..." : stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}