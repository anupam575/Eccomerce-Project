"use client";

import React from "react";

export const AppButton = ({
  children,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  loading = false, // ✅ NEW
  className = "",
  ...props
}) => {
  let baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 relative";

  if (fullWidth) {
    baseClasses += " w-full";
  }

  if (variant !== "text") {
    baseClasses += " shadow-md hover:shadow-lg active:scale-95";
  }

  let variantClasses = "";

  switch (variant) {
    case "contained":
      variantClasses =
        color === "error"
          ? "bg-red-500 text-white hover:bg-red-600"
          : color === "success"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-blue-600 text-white hover:bg-blue-700";
      baseClasses += " px-6 py-3";
      break;

    case "outlined":
      variantClasses =
        color === "error"
          ? "border border-red-500 text-red-500 hover:bg-red-50"
          : color === "success"
          ? "border border-green-500 text-green-500 hover:bg-green-50"
          : "border border-blue-600 text-blue-600 hover:bg-blue-50";
      baseClasses += " px-6 py-3";
      break;

    case "text":
      variantClasses =
        color === "error"
          ? "text-red-500 hover:underline"
          : color === "success"
          ? "text-green-500 hover:underline"
          : "text-blue-600 hover:underline";
      baseClasses += " px-2 py-1";
      break;

    case "auto":
      variantClasses =
        color === "error"
          ? "bg-red-500 text-white hover:bg-red-600"
          : color === "success"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-blue-600 text-white hover:bg-blue-700";

      baseClasses +=
        " px-4 py-2 text-sm md:text-base hover:scale-105 shadow-sm hover:shadow-md active:scale-95";
      break;

    default:
      break;
  }

  if ((variant === "contained" || variant === "auto") && color === "primary") {
    variantClasses =
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700";
  }

  return (
    <button
      {...props}
      disabled={loading} // ✅ disable when loading
      className={`${baseClasses} ${variantClasses} ${
        loading ? "cursor-not-allowed opacity-80" : ""
      } ${className}`}
    >
      {/* ✅ Spinner */}
      {loading && (
        <span className="absolute flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        </span>
      )}

      {/* ✅ Text (hide when loading) */}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
};

export default AppButton;