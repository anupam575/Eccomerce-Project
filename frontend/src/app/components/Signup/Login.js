"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import AppButton from "../../components/Section/UI/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchUser } from "@/redux/slices/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await API.post("/login", formData);
      dispatch(fetchUser());
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
        Welcome Back
      </h2>

      <form onSubmit={loginHandler} className="space-y-5">

        {/* EMAIL */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white border border-gray-200
              text-gray-900
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-gray-300
              placeholder:text-gray-400
              transition
            "
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-white border border-gray-200
                text-gray-900
                shadow-sm
                focus:outline-none focus:ring-2 focus:ring-gray-300
                placeholder:text-gray-400
                transition
              "
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-gray-700
                transition
              "
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center">
          <AppButton
            type="submit"
            fullWidth
            loading={loading} // ✅ yaha state pass karo
          >
            {loading ? "Updating..." : "Login"}
          </AppButton>
        </div>

        {/* FORGOT PASSWORD */}
        <p
          onClick={() => router.push("/password/forgot")}
          className="
            text-center text-sm text-gray-500
            hover:text-gray-800 cursor-pointer
            transition
          "
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}