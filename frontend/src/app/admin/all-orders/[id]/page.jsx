"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../utils/axiosInstance";

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
      <div className="flex justify-center  items-center min-h-screen space-x-2 bg-gray-50">
        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-700 font-medium">⏳ Loading order details...</span>
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-6">{error}</div>;

  if (!order)
    return <div className="text-center mt-6 text-gray-700">No order found.</div>;

  const SectionCard = ({ title, children }) => (
    <div className="mb-6 shadow-md rounded-lg bg-white border border-gray-100 p-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto w-full bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Order Invoice
      </h1>

      {/* Shipping Info */}
      <SectionCard title="Shipping Info">
        <p className="text-gray-700 mb-1">
          <strong>Address:</strong>{" "}
          {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state}, ${order.shippingInfo?.country} - ${order.shippingInfo?.pinCode}`}
        </p>
        <p className="text-gray-700"><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
      </SectionCard>

      {/* Customer Info */}
      <SectionCard title="Customer Info">
        <p className="text-gray-700 mb-1"><strong>Name:</strong> {order.user?.name}</p>
        <p className="text-gray-700"><strong>Email:</strong> {order.user?.email}</p>
      </SectionCard>

      {/* Order Items */}
      {order.orderItems?.length > 0 && (
        <SectionCard title="Order Items">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Product</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Qty</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Price</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{currencyFormatter.format(item.price)}</td>
                    <td className="px-4 py-2">{currencyFormatter.format(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg p-4">
                <p className="text-gray-700"><strong>Product:</strong> {item.name}</p>
                <p className="text-gray-700"><strong>Qty:</strong> {item.quantity}</p>
                <p className="text-gray-700"><strong>Price:</strong> {currencyFormatter.format(item.price)}</p>
                <p className="text-gray-700"><strong>Subtotal:</strong> {currencyFormatter.format(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Payment Info */}
      <SectionCard title="Payment Info">
        <p className="text-gray-700 mb-1"><strong>Status:</strong> {order.paymentInfo?.status || "N/A"}</p>
        <p className="text-gray-700"><strong>Paid At:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}</p>
      </SectionCard>

      {/* Price Summary */}
      <SectionCard title="Price Summary">
        <p className="text-gray-700 mb-1"><strong>Items:</strong> {currencyFormatter.format(order.itemsPrice)}</p>
        <p className="text-gray-700 mb-1"><strong>Tax:</strong> {currencyFormatter.format(order.taxPrice)}</p>
        <p className="text-gray-700 mb-1"><strong>Shipping:</strong> {currencyFormatter.format(order.shippingPrice)}</p>
        <p className="text-gray-800 font-semibold text-lg"><strong>Total:</strong> {currencyFormatter.format(order.totalPrice)}</p>
      </SectionCard>

      {/* Order Status */}
      <SectionCard title="Order Status">
        <p className="text-gray-700 mb-1"><strong>Status:</strong> {order.orderStatus}</p>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <p className="text-gray-700"><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
        )}
        {order.orderStatus === "Soon" && order.soonAt && (
          <p className="text-gray-700"><strong>Soon At:</strong> {new Date(order.soonAt).toLocaleString()}</p>
        )}
        {order.orderStatus === "Cancelled" && order.cancelledAt && (
          <p className="text-gray-700"><strong>Cancelled At:</strong> {new Date(order.cancelledAt).toLocaleString()}</p>
        )}
      </SectionCard>
    </div>
  );
};

export default OrderDetailPage;
