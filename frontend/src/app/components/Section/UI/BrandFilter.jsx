"use client";

import React, { useEffect } from "react";
import API from "../../../utils/axiosInstance";

const BrandFilter = ({ brands, setBrands, selectedBrand, setSelectedBrand }) => {

  // ✅ Fetch brands from backend
  const fetchBrands = async () => {
    try {
      const { data } = await API.get("/brands");
      setBrands(data.brands || []);
      console.log("✅ Brands loaded:", data.brands);
    } catch (error) {
      console.error(
        "Brand load failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <h3 className="font-bold text-gray-800 mb-2 text-lg">Brand</h3>

      <div className="flex flex-col gap-2 mb-4">
        {/* ALL option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="brand"
            value=""
            checked={selectedBrand === ""}
            onChange={() => setSelectedBrand("")}
            className="w-4 h-4 text-blue-500 accent-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-300"
          />
          <span className="text-gray-700 font-medium">All</span>
        </label>

        {/* DYNAMIC BRANDS */}
        {brands.map((b) => (
          <label key={b._id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="brand"
              value={b._id}
              checked={selectedBrand === b._id}
              onChange={() => setSelectedBrand(b._id)}
              className="w-4 h-4 text-blue-500 accent-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-gray-700 font-medium">{b.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;
