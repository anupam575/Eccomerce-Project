"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";

const ForgotPassword = () => {
  const router = useRouter();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const token = loggedInUser?.token;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/password/forgot", { email });

      toast.success(data.message || "Reset link sent successfully!");

      if (data.resetToken) {
        router.push(`/password/reset/${data.resetToken}`);
      } else {
        toast.info("📧 Please check your email for the password reset link.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error(error.response?.data?.message || "❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  dark:bg-gray-900 px-4">
      <form
        onSubmit={forgotPasswordHandler}
        className="w-full max-w-md  dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
