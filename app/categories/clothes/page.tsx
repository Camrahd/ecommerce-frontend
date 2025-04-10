// app/categories/clothes/page.tsx
import Navbar from "@/components/Navbar";

export default function ClothesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Clothes</h1>
        <p className="text-gray-600">Clothing items will be displayed here.</p>
      </div>
    </div>
  );
}