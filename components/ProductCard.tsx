"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image"; // Import the Image component

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
        cartId: Date.now(), // Backend response is just a string, so use timestamp as a temporary cartId
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
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <Image
        src={image}
        alt={name}
        width={400} // Adjust based on your design
        height={192} // Matches the previous h-48 (48 * 4 = 192px)
        className="w-full rounded-t-lg object-cover"
        priority={false} // Lazy load by default
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">Price: ${amount.toFixed(2)}</p>
        <p className={`text-sm ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
          Stock: {stock > 0 ? `${stock} available` : "Out of Stock"}
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform ${
            isLoading || stock === 0 ? "opacity-50 cursor-not-allowed scale-100" : "scale-100 hover:scale-105"
          }`}
          disabled={isLoading || stock === 0}
        >
          {isLoading ? "Adding..." : stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}