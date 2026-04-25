"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import AppButton from "../../components/Section/UI/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Must be positive")
    .required("Price is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  category: yup.string().required("Category is required"),
  images: yup
    .mixed()
    .test("required", "At least one image is required", (value) => value && value.length > 0),
});

const CreateProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- RHF ---------------- */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await API.get("/category");
        setCategories(res.data.categories || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
  /* ---------------- IMAGE HANDLER ---------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    const prev = [];

    files.forEach(file => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} must be JPG or PNG`);
        return;
      }
      valid.push(file);
      prev.push(URL.createObjectURL(file));
    });

    setValue("images", valid);
    setPreviews(prev);
  };

  /* ---------------- CLOUDINARY ---------------- */
  const uploadImagesToCloudinary = async (images) => {
    if (!images?.length) return [];
    const { data } = await API.get("/get-signature");
    const { signature, timestamp, folder, cloudName, apiKey } = data;
    const uploaded = [];

    for (const file of images) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });

      const img = await res.json();
      uploaded.push({ public_id: img.public_id, url: img.secure_url });
    }

    return uploaded;
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const cloudImages = await uploadImagesToCloudinary(formData.images);

      const { data } = await API.post("/admin/product/new", {
        ...formData,
        images: cloudImages,
      });

      if (data.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-2xl -mt-10 bg-white rounded-3xl p-10 shadow-lg space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Product Name" error={errors.name?.message}>
            <input {...register("name")} placeholder="Enter product name" />
          </Input>

          <Input label="Description" error={errors.description?.message}>
            <textarea {...register("description")} rows={5} placeholder="Enter description" />
          </Input>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" error={errors.price?.message}>
              <input type="number" {...register("price")} placeholder="0.00" step="0.01" />
            </Input>
            <Input label="Stock" error={errors.stock?.message}>
              <input type="number" {...register("stock")} placeholder="0" />
            </Input>
          </div>

          

<Input label="Category" error={errors.category?.message}>
  <select {...register("category")} className="bg-white">
    <option value="">Select category</option>

    {categories?.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</Input>


          {/* Images Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Product Images</label>
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-xl shadow hover:scale-105 transition-transform"
            >
              Upload Images
            </button>
            <input
              id="fileInput"
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previews.map((img, i) => (
                <img key={i} src={img} className="h-32 w-full object-cover rounded-xl border shadow-sm" />
              ))}
            </div>
          )}

          <AppButton
            type="submit"
            fullWidth
            loading={loading} // ✅ yaha state pass karo
          >
            {loading ? "Creating..." : "Create Product"}
          </AppButton>
        </form>
      </div>
    </div>
  );
};

/* ---------------- INPUT ---------------- */
const Input = ({ label, error, children }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    {React.cloneElement(children, {
      className:
        "w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all",
    })}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default CreateProduct;