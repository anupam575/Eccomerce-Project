"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = ["Personal Info", "Shipping", "Payment"];

const OrderSuccessPage = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 -mt-16 py-12">
      
      {/* ✅ Top Stepper */}
      <div className="w-full max-w-4xl mb-12 -mt-10 flex justify-between items-center">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
              {idx + 1}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700 text-center">{step}</span>
            {idx < steps.length - 1 && (
              <div className="absolute top-5 right-0 w-full h-1 bg-gray-300 z-0" style={{ left: "50%", right: "-50%" }}></div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Success Card */}
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl hover:shadow-3xl transition-shadow duration-300 p-10 flex flex-col items-center text-center gap-6">
        
        {/* ✅ Success Icon */}
        <CheckCircleIcon className="text-green-600 animate-bounce" style={{ fontSize: 80 }} />

        {/* ✅ Success Message */}
        <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h1>

        <p className="text-gray-700 max-w-md">
          Thank you for your order. Your payment was successful, and your order is now being processed.
        </p>

        <div className="border-t border-gray-200 w-full max-w-sm my-4"></div>

        {/* ✅ Order ID */}
        <p className="text-sm text-gray-500">
          Order ID: <span className="font-semibold text-gray-800">{id}</span>
        </p>

        {/* ✅ Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-sm">
          <button
            onClick={() => router.push(`/my-orders/${id}`)}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-lg rounded-2xl transition-all duration-300"
          >
            View Order Details
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium text-lg rounded-2xl transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
