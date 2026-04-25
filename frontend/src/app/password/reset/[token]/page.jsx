"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/utils/axiosInstance";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useParams(); // capture dynamic token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.put(`/password/reset/${token}`, {
        password,
        confirmPassword,
      });

      toast.success("🎉 Password reset successful!");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center  dark:bg-gray-900 px-4">
      <form
        onSubmit={resetPasswordHandler}
        className="w-full max-w-md  dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
