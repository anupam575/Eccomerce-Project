"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

// ✅ MUI Icons only
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function UpdatePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.put(
        "/password/update",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      toast.success("✅ Password updated successfully!");
      router.push("/auth");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    {
      label: "Old Password",
      value: oldPassword,
      setValue: setOldPassword,
      show: showOld,
      toggle: () => setShowOld(!showOld),
    },
    {
      label: "New Password",
      value: newPassword,
      setValue: setNewPassword,
      show: showNew,
      toggle: () => setShowNew(!showNew),
    },
    {
      label: "Confirm Password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      show: showConfirm,
      toggle: () => setShowConfirm(!showConfirm),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Update Password
        </h2>

        {passwordFields.map((field) => (
          <div key={field.label} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>

            <div className="relative">
              <input
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                className="
                  w-full px-4 py-2.5 pr-11
                  border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition
                "
              />

              <button
                type="button"
                onClick={field.toggle}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-500 hover:text-gray-700
                "
              >
                {field.show ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-lg
              bg-blue-600 text-white font-semibold
              hover:bg-blue-700
              transition disabled:opacity-60
            "
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
