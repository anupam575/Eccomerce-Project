"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../utils/axiosInstance";
import AppButton from "../../../components/Section/UI/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* ---------------- SCHEMA ---------------- */
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
    .min(0)
    .required("Stock is required"),
  category: yup.string().required("Category is required"),
  images: yup.mixed().nullable(),
});

const UpdateProduct = () => {
  const router = useRouter();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- RHF ---------------- */
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/admin/product/${id}`);
        const p = data.product;

        reset({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          category: p.category?._id || "",
          stock: p.stock || "",
          images: null,
        });

        setOldImages(p.images || []);
      } catch {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, reset]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (data.success) {
          setCategories(
            data.categories.map((c) => ({
              id: c._id,
              name: c.name,
            }))
          );
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    const prev = [];

    files.forEach((file) => {
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

  /* ---------------- REMOVE IMAGE ---------------- */
  const removeImage = (index) => {
    if (previews.length) {
      const newPreviews = [...previews];
      const newFiles = [...(Array.from(document.getElementById("fileInput").files) || [])];
      newPreviews.splice(index, 1);
      newFiles.splice(index, 1);
      setPreviews(newPreviews);
      setValue("images", newFiles);
    } else {
      const newOldImages = [...oldImages];
      newOldImages.splice(index, 1);
      setOldImages(newOldImages);
    }
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

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );

      const img = await res.json();

      uploaded.push({
        public_id: img.public_id,
        url: img.secure_url,
      });
    }

    return uploaded;
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      let finalImages = oldImages;

      if (formData.images && formData.images.length > 0) {
        const newUploaded = await uploadImagesToCloudinary(formData.images);
        finalImages = newUploaded;
      }

      await API.put(`/admin/product/${id}`, {
        ...formData,
        images: finalImages,
      });

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-50  py-12 px-4">
      <div className="mx-auto max-w-3xl -mt-10 bg-white rounded-3xl p-10 shadow-lg space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Update Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <Input label="Product Name" error={errors.name?.message}>
            <input {...register("name")} placeholder="Enter product name" />
          </Input>

          {/* Description */}
          <Input label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Enter product description"
            />
          </Input>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" error={errors.price?.message}>
              <input
                type="number"
                {...register("price")}
                placeholder="0.00"
                step="0.01"
              />
            </Input>

            <Input label="Stock" error={errors.stock?.message}>
              <input type="number" {...register("stock")} placeholder="0" />
            </Input>
          </div>

          {/* Category */}
          <Input label="Category" error={errors.category?.message}>
            <select {...register("category")} className="bg-white">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Input>

          {/* Images Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Images
            </label>
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
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(previews.length ? previews : oldImages.map((img) => img.url)).map(
              (src, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                >
                  <img src={src} className="h-32 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
<AppButton
  type="submit"
  fullWidth
  loading={loading} // ✅ yaha state pass karo
>
  {loading ? "Updating..." : "Update Product"}
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

export default UpdateProduct;