"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearError,
} from "../../redux/slices/cartSlice";
import { useRouter } from "next/navigation";

// MUI Icons
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: cartItems, status, error } = useSelector((state) => state.cart);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Auto clear error
  useEffect(() => {
    if (status === "failed") {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, dispatch]);

  // Filter out-of-stock or deleted products
  const availableCartItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    return cartItems.filter((item) => item.product && item.product.stock > 0);
  }, [cartItems]);

  // Total price calculation
  const totalPrice = useMemo(() => {
    if (!availableCartItems.length) return 0;
    return availableCartItems
      .reduce(
        (total, item) =>
          total + (Number(item.product?.price) || 0) * (Number(item.quantity) || 0),
        0
      )
      .toFixed(2);
  }, [availableCartItems]);

  // Buy now handler
  const handleBuyNow = () => {
    if (availableCartItems.length) router.push("/shipping");
  };

  // Increase quantity
  const handleIncrease = (id, quantity, stock) => {
    if (quantity < stock) {
      dispatch(updateCartItem({ cartItemId: id, quantity: quantity + 1 }));
    }
  };

  // Decrease quantity
  const handleDecrease = (id, quantity) => {
    const newQty = quantity - 1;
    newQty <= 0
      ? dispatch(removeCartItem(id))
      : dispatch(updateCartItem({ cartItemId: id, quantity: newQty }));
  };

  // Remove item
  const handleRemove = (id) => dispatch(removeCartItem(id));

  // Error message display
  const errorMessage =
    typeof error === "string" ? error : error?.message || error?.error || "Something went wrong";

  return (
    <div className="w-full min-h-screen p-6 -mt-16 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-gray-800">
        Your Cart
      </h1>

      {status === "failed" && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>
      )}

      {!availableCartItems || availableCartItems.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Your cart is empty!</h2>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* CART ITEMS */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {availableCartItems.map((item) => {
              const product = item.product || {};
              const imageUrl = product.images?.[0]?.url || "/placeholder.png";
              const productName = product.name || "Unknown Product";
              const productPrice = Number(product.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const stock = Number(product.stock) || 0;

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="sm:w-1/3 w-full h-40 sm:h-auto overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between p-5">
                    <div className="flex flex-col gap-2">
                      <h3
                        className="font-semibold text-lg line-clamp-2 break-words text-gray-800"
                        title={productName}
                      >
                        {productName}
                      </h3>
                      <p className="text-blue-600 font-bold text-lg">₹{productPrice.toFixed(2)}</p>

                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleDecrease(item._id, quantity)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                        >
                          <Remove fontSize="small" />
                        </button>
                        <span className="font-medium">{quantity}</span>
                        <button
                          onClick={() => handleIncrease(item._id, quantity, stock)}
                          className={`p-2 bg-gray-200 hover:bg-gray-300 rounded transition ${
                            quantity >= stock ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={quantity >= stock}
                        >
                          <Add fontSize="small" />
                        </button>
                      </div>

                      <p className="mt-2 font-medium text-gray-700">
                        Total: ₹{(productPrice * quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="self-start mt-3 flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                    >
                      <Delete fontSize="small" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-20 bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-bold text-xl text-gray-800">Order Summary</h2>
              <div className="border-b border-gray-200 pb-2 flex justify-between text-gray-700">
                <span>Items:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="border-b border-gray-200 pb-2 flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>₹{totalPrice > 500 ? 0 : 50}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 mt-2">
                <span>Total:</span>
                <span>₹{(Number(totalPrice) + (Number(totalPrice) > 500 ? 0 : 50)).toFixed(2)}</span>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={availableCartItems.length === 0}
                className={`mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 ${
                  availableCartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Proceed to Shipping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
