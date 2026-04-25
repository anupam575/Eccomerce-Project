"use client";

import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import CloseIcon from "@mui/icons-material/Close";

const AuthModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [closeModal]);

  return (
    /* OVERLAY */
    <div
      onClick={closeModal}
      className="
        fixed inset-0 z-50 flex items-center justify-center px-4
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        backdrop-blur-sm
      "
    >
      {/* SOFT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent)]"></div>

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="
          relative w-full max-w-lg
          rounded-3xl
          bg-white/80 backdrop-blur-xl
          border border-gray-200/60
          shadow-[0_10px_40px_rgba(0,0,0,0.12)]
          animate-fadeIn
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={closeModal}
          className="
            absolute top-4 right-4
            p-2 rounded-full
            bg-white shadow-sm
            hover:shadow-md hover:scale-105
            text-gray-600
            transition
          "
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* HEADER */}
        <div className="px-7 pt-7 pb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Access your account or create one
          </p>
        </div>

        {/* TABS */}
        <div className="px-6 mb-4">
          <div className="relative flex p-1 rounded-full bg-gray-100">
            
            {/* ACTIVE SLIDER */}
            <div
              className={`
                absolute top-1 bottom-1 w-1/2 rounded-full
                bg-white shadow-sm
                transition-all duration-300
                ${activeTab === "login" ? "left-1" : "left-1/2"}
              `}
            />

            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative z-10 flex-1 py-2.5 text-sm font-medium rounded-full
                  transition
                  ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
              >
                {tab === "login" ? "Login" : "Create Account"}
              </button>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mx-6 border-t border-gray-200"></div>

        {/* CONTENT */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {activeTab === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;