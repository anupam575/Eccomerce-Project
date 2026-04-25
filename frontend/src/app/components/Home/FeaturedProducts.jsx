"use client";

const categories = [
  { id: 1, name: "Headphones", image: "/images/Oneplus.jpg" },
  { id: 2, name: "Watches", image: "/images/product2.jpg" },
  { id: 3, name: "Shoes", image: "/images/laptop.jpg" },
  { id: 4, name: "Gaming", image: "/images/product4.jpg" },
];

export default function FeaturedProducts() {
  return (
    <div className="px-8 py-6">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

      {/* Grid layout: 1 row on mobile, 2 columns on sm, 4 on md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-84 object-cover"
            />
            <div className="p-4">
              <h3 className="text-center font-medium text-lg">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
