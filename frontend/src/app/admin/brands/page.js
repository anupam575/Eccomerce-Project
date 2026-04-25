"use client"; // Must be at the top for client component

import React, { useState, useEffect } from "react";
import API from "../../../utils/axiosInstance"; // Your Axios instance (with baseURL & refresh logic)

const CreateBrand = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null); // file object
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch existing brands
  const loadBrands = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/brands");
      setBrands(data.brands);
    } catch (err) {
      console.error("Load Brands Error:", err);
      setMessage("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Handle form submit (with file upload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !logo) return setMessage("Name and logo are required");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("logo", logo); // Must match backend 'upload.single("logo")'

      const { data } = await API.post("/admin/brand", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`Brand "${data.brand.name}" created successfully!`);
      setName("");
      setLogo(null);

      loadBrands(); // Refresh brand list
    } catch (err) {
      console.error("Create Brand Error:", err);
      setMessage(err.response?.data?.message || "Failed to create brand");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Brand (Admin)</h1>

      {/* Message */}
      {message && (
        <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">
          {message}
        </div>
      )}

      {/* Brand Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-6 py-4 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          required
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Brand
        </button>
      </form>

      {/* Live Brand List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Existing Brands</h2>
        {loading ? (
          <p>Loading brands...</p>
        ) : brands.length === 0 ? (
          <p>No brands available.</p>
        ) : (
          <ul className="space-y-2">
            {brands.map((b) => (
              <li
                key={b._id}
                className="flex items-center gap-3 border p-2 rounded"
              >
                <img
                  src={b.logo?.url || b.logo} // Cloudinary: b.logo.url
                  alt={b.name}
                  className="w-10 h-10 object-contain"
                />
                <span>{b.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateBrand;
