"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUser } from "@/redux/slices/authSlice";
import NotificationsListener from "./components/Section/SocketListener"; 

import ButtonAppBar from "./components/Header/Header";
import Panel from "./components/Header/Panel";
import { ToastContainer } from "react-toastify";

// 👉 IMPORT Providers
import Providers from "./QueryClientProvider"; // path apne project ke hisaab se adjust karo

export default function ClientLayout({ children }) {
  const dispatch = useDispatch();

  const { authChecked, loading } = useSelector((state) => state.auth);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && !authChecked) {
      hasFetchedRef.current = true;
      dispatch(fetchUser());
    }
  }, [authChecked, dispatch]);

  return (
    <Providers> {/* ✅ Yaha wrap kiya */}
      {/* 🔔 GLOBAL SOCKET LISTENER */}
      <NotificationsListener />

      {/* 🔝 HEADER */}
      <ButtonAppBar />
      <Panel />

      {/* 📄 MAIN CONTENT */}
      <main>
        {!authChecked && loading ? (
          <div style={{ padding: "20px" }}>Loading...</div>
        ) : (
          children
        )}
      </main>

      {/* 🔔 TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="colored"
      />
    </Providers>
  );
}