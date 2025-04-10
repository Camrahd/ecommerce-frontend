// app/categories/page.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Link
            href="/categories/electronics"
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            Electronics
          </Link>
          <Link
            href="/categories/clothes"
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            Clothes
          </Link>
          <Link
            href="/categories/food"
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            Food
          </Link>
        </div>
      </div>
    </div>
  );
}