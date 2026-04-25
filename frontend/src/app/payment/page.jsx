"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import ProtectedRoute from "../components/ProtectedRoute";
import { CircularProgress } from "@mui/material";
import { fetchCart } from "../../redux/slices/cartSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const steps = ["Personal Info", "Shipping", "Payment"];

const TAX_RATE = 0.18; // 18% GST

/* =====================================================
// Checkout Form Component
===================================================== */
const CheckoutForm = ({ orderSummary, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo) || {};

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Filter only available items
  const availableCartItems = useMemo(() => {
    return cartItems.filter((item) => item.product && item.product.stock > 0);
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Stripe not ready");
      return;
    }

    if (!availableCartItems.length) {
      toast.error("No available items to pay for.");
      return;
    }

    setLoading(true);
    setPaymentError("");

    try {
      const card = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        toast.error(result.error.message);
        setPaymentError(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
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
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
          itemsPrice: orderSummary.itemsPrice,
          taxPrice: orderSummary.taxPrice,
          shippingPrice: orderSummary.shippingFee,
          totalPrice: orderSummary.totalPrice,
        };

        const { data } = await API.post("/order/new", orderData);

        toast.success("Payment successful & order placed!");
        router.replace(`/payment/order-success/${data.order._id}`);
      }
    } catch (error) {
      toast.error("Payment failed. Some items might be out of stock.");
      dispatch(fetchCart()); // Sync cart if backend rejects order
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {loading && (
        <div className="flex items-center gap-3 text-gray-700">
          <CircularProgress size={20} />
          <span>Processing payment...</span>
        </div>
      )}

      <div className="p-4 border rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="p-2 border rounded-md">
          <CardNumberElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry
          </label>
          <div className="p-2 border rounded-md">
            <CardExpiryElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <div className="p-2 border rounded-md">
            <CardCvcElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
        </div>
      </div>

      {paymentError && <p className="text-red-600 text-sm">{paymentError}</p>}

      <button
        type="submit"
        disabled={!stripe || loading || !availableCartItems.length}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-60"
      >
        Pay ₹{orderSummary?.totalPrice || 0}
      </button>
    </form>
  );
};

/* =====================================================
// Payment Page Component
===================================================== */
const PaymentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo) || {};

  const [orderSummary, setOrderSummary] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter only available items
  const availableCartItems = useMemo(() => {
    return cartItems.filter((item) => item.product && item.product.stock > 0);
  }, [cartItems]);

  useEffect(() => {
    if (!availableCartItems.length) {
      toast.error("Your cart is empty or items are out of stock.");
      router.replace("/cart");
      return;
    }

    if (!shippingInfo.address) {
      toast.error("Please complete shipping details.");
      router.replace("/shipping");
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const { data } = await API.post("/payment/process", {
          items: availableCartItems.map((item) => ({
            price: item.product?.price,
            quantity: item.quantity,
          })),
        });

        setClientSecret(data.client_secret);
        setOrderSummary(data.orderSummary);
      } catch (error) {
        toast.error("Failed to load payment details.");
        console.error("Payment Summary Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [availableCartItems, shippingInfo, router]);

  if (loading || !orderSummary) {
    return (
      <div className="flex justify-center mt-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-6xl mx-auto px-4 -mt-10 space-y-8">
        {/* Steps */}
        <div className="flex justify-between items-center border-b pb-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center text-sm font-medium ${
                idx === 2 ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="p-6 bg-white rounded-xl shadow-md">
            <CheckoutForm
              orderSummary={orderSummary}
              clientSecret={clientSecret}
            />
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            <div className="border-b border-gray-200 pb-2 flex justify-between">
              <span>Items</span>
              <span>₹{orderSummary.itemsPrice}</span>
            </div>
            <div className="border-b border-gray-200 pb-2 flex justify-between">
              <span>Tax</span>
              <span>₹{orderSummary.taxPrice}</span>
            </div>
            <div className="border-b border-gray-200 pb-2 flex justify-between">
              <span>Shipping</span>
              <span>₹{orderSummary.shippingFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-lg">
              <span>Total</span>
              <span>₹{orderSummary.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

/* =====================================================
// Protected Wrapper
===================================================== */
const PaymentProtectedPage = () => {
  return (
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  );
};

export default PaymentProtectedPage;
