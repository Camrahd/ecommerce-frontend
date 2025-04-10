// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          eCommerce Store
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link href="/signup" className="text-white hover:text-gray-300">
            Sign Up
          </Link>
          <Link href="/cart" className="text-white hover:text-gray-300">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}