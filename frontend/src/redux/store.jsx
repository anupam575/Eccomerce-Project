"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";

// slices
import productReducer from "@/redux/slices/productSlice";
import authReducer from "@/redux/slices/authSlice";
import searchReducer from "@/redux/slices/searchSlice";
import shippingReducer from "@/redux/slices/shippingSlice";
import suggestionsReducer from "@/redux/slices/suggestionsSlice";
import cartReducer from "@/redux/slices/cartSlice";

// ✅ ADD THIS
import notificationReducer from "./slices/notificationslice";

import { serializableFixMiddleware } from "./middleware/serializableFixMiddleware";

// root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  search: searchReducer,
  shipping: shippingReducer,
  product: productReducer,
  suggestions: suggestionsReducer,

  // ✅ IMPORTANT
  notifications: notificationReducer,
});

// store
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: [],
      },
    }).concat(serializableFixMiddleware),
});