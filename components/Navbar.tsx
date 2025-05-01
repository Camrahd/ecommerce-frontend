"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCartStore();
  const [user, setUser] = useState<{ userId: string | null; username: string | null }>({
    userId: null,
    username: null,
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    setUser({ userId, username });
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser({ userId: null, username: null });
    router.push("/login");
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          eCommerce Store
        </Link>
        <div className="space-x-4">
          {user.userId ? (
            <>
              <span className="text-white">Welcome, {user.username}</span>
              <Link href="/orders" className="text-white hover:text-gray-300">
                My Orders
              </Link>
              <Link href="/cart" className="text-white hover:text-gray-300">
                Cart ({cartItemCount})
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link href="/signup" className="text-white hover:text-gray-300">
                Sign Up
              </Link>
              <Link href="/cart" className="text-white hover:text-gray-300">
                Cart ({cartItemCount})
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}