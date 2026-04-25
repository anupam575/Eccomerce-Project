"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// ✅ Validation Schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  avatar: yup.mixed().nullable(),
});

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 🔄 Sync Redux → Form
  useEffect(() => {
    if (loggedInUser) {
      reset({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        avatar: null,
      });
      setPreview(loggedInUser.avatar || "");
    }
  }, [loggedInUser, reset]);

  // ✅ File handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.warn("Only JPG / PNG images allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warn("Image must be less than 10MB");
      return;
    }

    setValue("avatar", file);
    setPreview(URL.createObjectURL(file));
  };

  // ☁️ Cloudinary upload
  const uploadToCloudinary = useCallback(async (file) => {
    const { signature, timestamp, folder, cloudName, apiKey } =
      await API.get("/get-signature").then((res) => res.data);

    const data = new FormData();
    data.append("file", file);
    data.append("api_key", apiKey);
    data.append("folder", folder);
    data.append("timestamp", timestamp);
    data.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();
    if (!result.secure_url) {
      throw new Error(result.error?.message || "Upload failed");
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }, []);

  // ✅ Submit
  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      let avatarData = null;

      if (formData.avatar) {
        avatarData = await uploadToCloudinary(formData.avatar);
      }

      await API.put("/me/update", {
        name: formData.name,
        email: formData.email,
        avatar: avatarData,
      });

      dispatch(fetchUser());
      toast.success("✅ Profile updated successfully!");
      reset({ ...formData, avatar: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Update Profile
        </h2>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 border rounded-lg"
          />
          <p className="text-red-500 text-xs">{errors.name?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-2.5 border rounded-lg"
          />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-blue-50 px-4 py-2 rounded-lg">
            <CloudUploadIcon />
            Upload Image
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <img
              src={preview}
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}