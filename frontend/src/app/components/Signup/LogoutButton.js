"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { clearUser } from "../../../redux/slices/authSlice";
import {  CircularProgress } from "@mui/material";
import AppButton from "../../components/Section/UI/Button"
const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      // 🔥 backend logout
      await API.post("/logout");

      dispatch(clearUser());

      toast.success("✅ Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppButton
      variant="contained"
      color="error"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
    </AppButton>
  );
};

export default LogoutButton;
