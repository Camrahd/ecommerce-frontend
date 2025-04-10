// app/categories/electronics/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  cost: number;
  stock: number;
  image: string;
}

export default function ElectronicsPage() {
  // Mock data for electronics (replace with API call later)
  const products: Product[] = [
    {
      id: 1,
      name: "Smartphone",
      cost: 999.99,
      stock: 10,
      image: "/images/products/electronics-phone.jpg",
    },
    {
      id: 2,
      name: "Laptop",
      cost: 1499.99,
      stock: 0, // Out of stock
      image: "/images/products/electronics-laptop.jpg",
    },
  ];

  // State to manage quantities for each product
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})
  );

  // State to manage cart items (for demo purposes)
//   const [cart, setCart] = useState<Product[]>([]);

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, prev[productId] + delta); // Minimum quantity is 1
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: Product) => {
    // Add product to cart (for demo purposes)
    // setCart((prev) => [...prev, { ...product }]);
    alert(`${product.name} added to cart!`);
    // Reset quantity after adding to cart (optional)
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Electronics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">${product.cost.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
                {product.stock > 0 && (
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">
                      {quantities[product.id]}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`mt-2 w-full px-4 py-2 text-white rounded-lg transition ${
                    product.stock > 0
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}