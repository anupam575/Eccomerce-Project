"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Star as StarIcon,
  ErrorOutline,
  CheckCircle,
  Cancel,
  ShoppingCart,
} from "@mui/icons-material";
import { Rating } from "@mui/material";

import { fetchProduct, clearProduct } from "../../../redux/slices/productSlice";
import { addCartItem } from "../../../redux/slices/cartSlice";
import ReviewSection from "../../components/Section/Reviewsection";
import ImageZoom from "../../components/Header/ImageZoom";

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  const [mainImage, setMainImage] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);

  const handleUpdateSummary = useCallback((avg, total) => {
    setRatingValue(avg);
    setNumOfReviews(total);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id))
        .unwrap()
        .then((data) => {
          setMainImage(data.mainImage || "/placeholder.png");
          setRatingValue(data.ratings || 0);
          setNumOfReviews(data.numOfReviews || 0);
        })
        .catch(() => toast.error("Failed to fetch product"));
    }
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(
        addCartItem({ productId: product._id, quantity: 1 })
      ).unwrap();
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-gray-600">Product not found.</p>;

  return (
    <div className="p-6 -mt-16 space-y-8">
      {/* Product Images + Info */}
      <div className="md:flex md:gap-8">
        {/* Left: Images */}
        <div className="md:w-1/2">
          {mainImage && <ImageZoom src={mainImage} />}
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {(product.thumbnails?.length || 0) > 0 ? (
              product.thumbnails.map((url, idx) => (
                <img
                  key={idx}
                  src={url || "/placeholder.png"}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    mainImage === url ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(url)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                alt="No image available"
                className="w-20 h-20 object-cover"
              />
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{product.name || "No Name"}</h2>

          <p className="text-gray-700">{product.description || "No Description Available"}</p>

          <div className="flex items-center space-x-2">
            <Rating value={ratingValue} precision={0.1} readOnly size="small" />
            <span className="text-gray-600">({numOfReviews} reviews)</span>
          </div>

          <p className="text-2xl font-bold text-blue-600">₹{product.price ?? 0}</p>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {product.category?.name || "Uncategorized"}
            </span>

            {product.inStock ? (
              product.lowStock ? (
                <span className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                  <ErrorOutline fontSize="small" /> Only {product.stock} left!
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  <CheckCircle fontSize="small" /> In Stock
                </span>
              )
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                <Cancel fontSize="small" /> Out of Stock
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              product.inStock
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            } flex items-center justify-center gap-2`}
          >
            <ShoppingCart /> {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12">
        <ReviewSection
          initialReviews={product.reviews || []}
          initialRating={product.ratings || 0}
          initialTotal={product.numOfReviews || 0}
          onUpdateSummary={handleUpdateSummary}
        />
      </div>
    </div>
  );
};

export default ProductDetails;