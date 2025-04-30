"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

type ProductCardProps = {
  id: number;
  name: string;
  amount: number;
  stock: number;
  categoryId: number;
  image: string;
};

interface ErrorResponse {
  message?: string;
}

export default function ProductCard({ id, name, amount, stock, categoryId, image }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity] = useState(1); // Backend doesn't handle quantity yet, default to 1

  console.log("ProductCard props:", { id, name, amount, stock, categoryId, image });

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login to add items to cart.");
      toast.error("Please login to add items to cart.", { position: "top-right" });
      return;
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      setError("Invalid user ID. Please login again.");
      toast.error("Invalid user ID. Please login again.", { position: "top-right" });
      return;
    }

    if (categoryId === undefined) {
      setError("Category ID is missing. Please try again.");
      toast.error("Category ID is missing. Please try again.", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending request to add to cart with payload:", {
        userId: parsedUserId,
        categoryId,
        productId: id,
        amount,
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          userId: parsedUserId,
          categoryId,
          productId: id,
          amount,
        }
      );

      addToCart({
        cartId: Date.now(),
        productId: id,
        name,
        cost: amount,
        quantity,
        categoryId,
      });

      toast.success(`${name} added to cart!`, { position: "top-right" });
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Failed to add to cart.";
      console.error("Error adding to cart:", axiosError.message, axiosError.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
      {/* Image Section */}
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-t-xl transition-opacity duration-300 hover:opacity-90"
          priority={false}
        />
        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight line-clamp-1">
          {name}
        </h3>

        {/* Price */}
        <p className="text-lg font-medium text-gray-700 mb-3">
          <span className="text-gray-500">Price: </span>
          <span className="text-blue-600">${amount.toFixed(2)}</span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 transform ${
            isLoading || stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
          }`}
          disabled={isLoading || stock === 0}
        >
          {isLoading ? "Adding..." : stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
    </div>
  );
}