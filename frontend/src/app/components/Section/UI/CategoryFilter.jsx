"use client";

import React, { useEffect } from "react";
import API from "../../../../utils/axiosInstance";

const CategoryFilter = ({
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  /* FETCH CATEGORIES */

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Category load failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full">

      {/* HEADING */}

      <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">
        Category
      </h3>

      {/* CATEGORY LIST */}

      <div className="flex flex-col gap-2 sm:gap-3 mb-4 max-h-60 sm:max-h-72 overflow-y-auto pr-1">

        {/* ALL OPTION */}

        <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base hover:text-blue-600 transition">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategory === ""}
            onChange={() => setSelectedCategory("")}
            className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-300"
          />
          <span className="text-gray-700 font-medium">
            All
          </span>
        </label>

        {/* DYNAMIC CATEGORIES */}

        {categories.map((cat) => (

          <label
            key={cat._id}
            className="flex items-center gap-2 cursor-pointer text-sm sm:text-base hover:text-blue-600 transition"
          >

            <input
              type="radio"
              name="category"
              value={cat._id}
              checked={selectedCategory === cat._id}
              onChange={() => setSelectedCategory(cat._id)}
              className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-300"
            />

            <span className="text-gray-700 font-medium break-words">
              {cat.name}
            </span>

          </label>

        ))}

      </div>

    </div>
  );
};

export default CategoryFilter;