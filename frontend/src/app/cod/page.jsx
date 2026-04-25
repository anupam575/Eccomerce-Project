"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import API from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { fetchCart } from "../../redux/slices/cartSlice";

// MUI Icon
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const TAX_RATE = 0.18; // 18% GST

const CODPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo) || {};

  // ✅ Filter only available stock items
  const availableCartItems = useMemo(() => {
    return cartItems.filter((item) => item.product && item.product.stock > 0);
  }, [cartItems]);

  // ✅ Frontend Order Summary
  const itemsPrice = useMemo(() => {
    return availableCartItems.reduce(
      (acc, item) => acc + (item.product.price || 0) * (item.quantity || 0),
      0
    );
  }, [availableCartItems]);

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = +(itemsPrice * TAX_RATE).toFixed(2);
  const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

  // 🔹 Place COD Order
  const handleCOD = async () => {
    if (!availableCartItems.length) {
      toast.error("No items available to place order.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shippingInfo,
        orderItems: availableCartItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || "/placeholder.png",
          price: item.product.price,
          product: item.product._id,
        })),
        paymentInfo: {
          id: `COD_${Date.now()}`,
          status: "Cash on Delivery",
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await API.post("/order/new", orderData);

      toast.success("Order placed successfully!");
      router.push(`/cod/order-success/${data.order._id}`);
    } catch (error) {
      console.error("COD Error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to place order. Some items might be out of stock."
      );

      // 🔄 Sync cart in Redux with backend
      dispatch(fetchCart());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-15 bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl -mt-10 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8">

        {/* COD Icon & Heading */}
        <LocalShippingIcon className="text-blue-600" style={{ fontSize: 60 }} />
        <h2 className="text-3xl font-bold">Cash on Delivery</h2>
        <p className="text-gray-600 text-center">
          Review your details carefully before placing your order. You will pay when your order arrives.
        </p>

        {/* Order Summary */}
        <div className="w-2/3 bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
          <h3 className="text-xl font-bold text-center mb-4">Order Summary</h3>

          <Row label="Items" value={itemsPrice} />
          <Row label="Tax (18%)" value={taxPrice} />
          <Row label="Shipping" value={shippingPrice} />

          <div className="border-t border-gray-300 my-3"></div>

          <Row label="Total" value={totalPrice} bold large />
        </div>

        {/* Place Order Button */}
        <button
          onClick={handleCOD}
          disabled={loading || !availableCartItems.length}
          className={`w-2/3 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-lg rounded-2xl transition-all duration-300 disabled:opacity-60`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Placing Order...
            </div>
          ) : (
            `Place Order (₹${totalPrice})`
          )}
        </button>
      </div>
    </div>
  );
};

// Helper component for summary rows
const Row = ({ label, value, bold, large }) => (
  <div className={`flex justify-between ${bold ? "font-bold" : ""} ${large ? "text-xl" : ""}`}>
    <span>{label}</span>
    <span>₹{value || 0}</span>
  </div>
);

export default CODPage;
