"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/order/${id}`);
      setOrder(res.data.order || null);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to load order details";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen space-x-2 bg-gray-50">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-700 font-medium">Loading order details...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="text-red-600 font-medium">{error}</span>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="text-gray-700 font-medium">No order found.</span>
      </div>
    );

  const SectionCard = ({ title, children }) => (
    <div className="mb-6 shadow-md rounded-lg p-6 bg-white">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto -mt-20">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">Order Invoice</h1>

      {/* Shipping Info */}
      <SectionCard title="Shipping Info">
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Address:</span>{" "}
          {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state}, ${order.shippingInfo?.country} - ${order.shippingInfo?.pinCode}`}
        </p>
        <p className="text-gray-700"><span className="font-semibold">Phone:</span> {order.shippingInfo?.phoneNo}</p>
      </SectionCard>

      {/* User Info */}
      <SectionCard title="Customer Info">
        <p className="mb-2 text-gray-700"><span className="font-semibold">Name:</span> {order.user?.name}</p>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {order.user?.email}</p>
      </SectionCard>

      {/* Order Items */}
      {order.orderItems?.length > 0 && (
        <SectionCard title="Order Items">
          <div className="space-y-3">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex-1 mb-2 md:mb-0">
                  <p className="text-gray-700 font-medium">{item.name}</p>
                </div>
                <div className="flex gap-6 md:gap-8 text-gray-700">
                  <p><span className="font-semibold">Qty:</span> {item.quantity}</p>
                  <p><span className="font-semibold">Price:</span> {currencyFormatter.format(item.price)}</p>
                  <p><span className="font-semibold">Subtotal:</span> {currencyFormatter.format(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Payment Info */}
      <SectionCard title="Payment Info">
        <p className="mb-2 text-gray-700"><span className="font-semibold">Status:</span> {order.paymentInfo?.status || "N/A"}</p>
        <p className="text-gray-700"><span className="font-semibold">Paid At:</span> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}</p>
      </SectionCard>

      {/* Price Summary */}
      <SectionCard title="Price Summary">
        <p className="mb-2 text-gray-700"><span className="font-semibold">Items:</span> {currencyFormatter.format(order.itemsPrice)}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Tax:</span> {currencyFormatter.format(order.taxPrice)}</p>
        <p className="mb-2 text-gray-700"><span className="font-semibold">Shipping:</span> {currencyFormatter.format(order.shippingPrice)}</p>
        <p className="text-gray-800 font-semibold text-lg"><span className="font-semibold">Total:</span> {currencyFormatter.format(order.totalPrice)}</p>
      </SectionCard>

      {/* Order Status */}
      <SectionCard title="Order Status">
        <p className="mb-2 text-gray-700"><span className="font-semibold">Status:</span> {order.orderStatus}</p>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <p className="text-gray-700"><span className="font-semibold">Delivered At:</span> {new Date(order.deliveredAt).toLocaleString()}</p>
        )}
        {order.orderStatus === "Soon" && order.soonAt && (
          <p className="text-gray-700"><span className="font-semibold">Soon At:</span> {new Date(order.soonAt).toLocaleString()}</p>
        )}
        {order.orderStatus === "Cancelled" && order.cancelledAt && (
          <p className="text-gray-700"><span className="font-semibold">Cancelled At:</span> {new Date(order.cancelledAt).toLocaleString()}</p>
        )}
      </SectionCard>
    </div>
  );
};

export default OrderDetailPage;
