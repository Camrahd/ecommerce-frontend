// app/page.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const categories = [
    {
      name: "Electronics",
      image: "/images/categories/electronics.jpg",
      link: "/categories/electronics",
    },
    {
      name: "Clothes",
      image: "/images/categories/clothes.jpg",
      link: "/categories/clothes",
    },
    {
      name: "Food",
      image: "/images/categories/food.jpg",
      link: "/categories/food",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our eCommerce Store
          </h1>
          <p className="text-lg text-gray-600">
            Discover the best deals on Electronics, Clothes, and Food!
          </p>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative w-full h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}