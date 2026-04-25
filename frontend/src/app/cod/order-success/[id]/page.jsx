"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const steps = ["Personal Info", "Shipping", "Confirmation"];

const OrderSuccessPage = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

  return (
    <div className="flex flex-col -mt-15 items-center justify-center min-h-screen bg-gray-50 px-4 py-12">

      {/* ✅ TOP SUCCESS STEPPER */}
      <ol className="flex items-center justify-between -mt-10 w-full max-w-3xl mb-12 relative">
        {steps.map((step, idx) => (
          <li key={idx} className="flex-1 flex flex-col items-center relative z-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-full 
              {idx < 2 ? 'bg-green-600 text-white' : 'bg-blue-500 text-white'}">
              {idx < 2 ? <CheckCircleIcon /> : <RadioButtonCheckedIcon />}
            </div>
            <span className="mt-2 text-sm sm:text-base font-medium text-gray-700 text-center">
              {step}
            </span>

            {/* Step connecting line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-5 right-0 w-full h-1 bg-gray-300 z-0 hidden sm:block" 
                   style={{ left: "50%", right: "-50%" }}></div>
            )}
          </li>
        ))}
      </ol>

      {/* ✅ SUCCESS CARD */}
      <div className="max-w-lg w-full bg-white shadow-3xl rounded-3xl hover:shadow-4xl transition-shadow duration-300 flex flex-col items-center text-center gap-6 p-10">
        
        {/* SUCCESS ICON */}
        <CheckCircleIcon className="text-green-600 animate-bounce" style={{ fontSize: 80 }} />

        {/* SUCCESS MESSAGE */}
        <h2 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h2>

        {id ? (
          <>
            <p className="text-gray-700">
              Your order ID: <span className="font-semibold text-gray-900">{id}</span>
            </p>

            {/* VIEW ORDER DETAILS BUTTON */}
            <button
              onClick={() => router.push(`/my-orders/${id}`)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-lg rounded-2xl transition-all duration-300"
            >
              View Order Details
            </button>
          </>
        ) : (
          <p className="text-red-600">Order ID not found. Redirecting...</p>
        )}

        {/* BACK TO HOME BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-2 py-3 border border-gray-300 text-gray-700 font-medium text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
