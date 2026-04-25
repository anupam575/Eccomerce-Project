"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { name: "Men's Fashion", image: "/images/men.jpg" },
  { name: "Women's Fashion", image: "/images/women.jpg" },
  { name: "Ashlesha", image: "/images/Ashlesha.jpg" },
  { name: "Home Appliances", image: "/images/fashion.jpg" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function CategorySection() {
  return (
    <div className="px-8 py-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Shop by Category
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            variants={card}
            whileHover={{ y: -8 }}
            className="group cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg"
          >
            {/* Image */}
            <div className="relative w-full h-100 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover object-center"
                />
              </motion.div>
            </div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 text-center"
            >
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition">
                Explore →
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default CategorySection;
