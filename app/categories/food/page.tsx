// app/categories/food/page.tsx
import Navbar from "@/components/Navbar";

export default function FoodPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Food</h1>
        <p className="text-gray-600">Food items will be displayed here.</p>
      </div>
    </div>
  );
}