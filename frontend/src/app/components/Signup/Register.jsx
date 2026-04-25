"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import AppButton from "../../components/Section/UI/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// ✅ Yup Schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Must include uppercase, lowercase, number & special character"
    ),
  avatar: yup.mixed().nullable(),
});

export default function Register() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.warn("Only JPG/PNG allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warn("File size must be under 10MB");
      return;
    }

    setValue("avatar", file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      let avatarData = null;

      if (formData.avatar) {
        const { signature, timestamp, folder, cloudName, apiKey } =
          await API.get("/get-signature").then((res) => res.data);

        const fd = new FormData();
        fd.append("file", formData.avatar);
        fd.append("api_key", apiKey);
        fd.append("folder", folder);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: fd }
        );

        const data = await uploadRes.json();

        avatarData = {
          url: data.secure_url,
          public_id: data.public_id,
        };
      }

      const { data } = await API.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: avatarData,
      });

      toast.success(data.message || "Account created successfully");
      reset();
      setPreview(null);
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="block mb-1.5 text-sm text-gray-600">Name</label>
          <input
            {...register("name")}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white border border-gray-200
              text-gray-900
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-gray-300
              transition
            "
          />
          <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1.5 text-sm text-gray-600">Email</label>
          <input
            {...register("email")}
            type="email"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white border border-gray-200
              text-gray-900
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-gray-300
              transition
            "
          />
          <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1.5 text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="
                w-full px-4 py-3 rounded-xl
                bg-white border border-gray-200
                text-gray-900
                shadow-sm
                focus:outline-none focus:ring-2 focus:ring-gray-300
                transition
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
        </div>

        {/* AVATAR */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <CloudUploadIcon fontSize="small" />
            Upload Avatar
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="mt-3">
            {preview ? (
              <img
                src={preview}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 rounded-full">
                Preview
              </div>
            )}
          </div>
        </div>
<AppButton
  type="submit"
  fullWidth
  loading={loading} // ✅ yaha state pass karo
>
  {loading ? "Updating..." : "Regsiter"}
</AppButton>
      </form>
    </div>
  );
}