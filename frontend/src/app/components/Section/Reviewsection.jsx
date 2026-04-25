"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchReviews,
  fetchReviewStats,
  submitReview,
  deleteReviewById,
} from "../../../utils/reviewApi";
import { AlertDialogModal } from "../../components/Section/UI/AlertDialogModal";
import { Rating } from "@mui/material";

const ReviewSection = ({
  initialReviews = [],
  initialRating = 0,
  initialTotal = 0,
  onUpdateSummary,
}) => {
  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.product.product);
  const productId = product?._id;

  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [breakdown, setBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const currentUserId = (user?._id || user?.id)?.toString();

const currentUserRole =
  typeof user?.role === "number"
    ? user.role
    : (user?.role || "").toLowerCase();
  const updateRatingSummary = useCallback(
    (reviewsList) => {
      if (!reviewsList) return;
      const total = reviewsList.length;
      const avg = total
        ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;
      const bd = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewsList.forEach((r) => {
        bd[r.rating] = (bd[r.rating] || 0) + 1;
      });

      setAverageRating(avg);
      setTotalReviews(total);
      setBreakdown(bd);

      if (onUpdateSummary) onUpdateSummary(avg, total);
    },
    [onUpdateSummary]
  );

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await fetchReviews(productId);
      if (data?.success) {
        setReviews(data.reviews || []);
        updateRatingSummary(data.reviews || []);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, updateRatingSummary]);

  const loadStats = useCallback(async () => {
    if (!productId) return;
    try {
      const { data } = await fetchReviewStats(productId);
      if (data?.success) {
        setAverageRating(data.average || 0);
        setTotalReviews(data.total || 0);
        setBreakdown(data.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch {
      console.error("Failed to load stats");
    }
  }, [productId]);

  const loadAllReviewData = useCallback(async () => {
    await Promise.all([loadReviews(), loadStats()]);
  }, [loadReviews, loadStats]);

  useEffect(() => {
    if (!productId) return;
    loadAllReviewData();
  }, [productId, loadAllReviewData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!rating || !comment.trim()) {
        toast.warn("Please provide rating & comment");
        return;
      }
      setLoading(true);
      try {
        const { data } = await submitReview({ productId, rating, comment });
        if (data?.success) {
          toast.success("Review submitted successfully");
          setRating(0);
          setComment("");
          await loadAllReviewData();
        }
      } catch {
        toast.error("Failed to submit review");
      } finally {
        setLoading(false);
      }
    },
    [productId, rating, comment, loadAllReviewData]
  );

  const handleDelete = useCallback(
    async () => {
      if (!reviewToDelete) return;
      setLoading(true);
      try {
        const { data } = await deleteReviewById({ productId, reviewId: reviewToDelete });
        if (data?.success) {
          toast.success("Review deleted successfully");
          await loadAllReviewData();
        }
      } catch {
        toast.error("Failed to delete review");
      } finally {
        setReviewToDelete(null);
        setShowConfirm(false);
        setLoading(false);
      }
    },
    [productId, reviewToDelete, loadAllReviewData]
  );

  if (!productId) return <p className="text-gray-600">Loading product info...</p>;

  return (
    <div className="mt-10 space-y-6">
      {/* Section Header */}
      <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>

      {/* Summary */}
      <div className="p-4 bg-gray-50 rounded-md border">
        <div className="flex items-center space-x-4">
          <Rating value={averageRating} precision={0.1} readOnly />
          <span className="font-semibold">{averageRating.toFixed(1)} out of 5</span>
          <span className="text-gray-500">({totalReviews} reviews)</span>
        </div>

        {/* Breakdown */}
        <div className="mt-4 space-y-2">
          {[5,4,3,2,1].map((star) => {
            const percent = totalReviews ? (breakdown[star] * 100) / totalReviews : 0;
            return (
              <div key={star} className="flex items-center space-x-3">
                <span className="w-12 text-sm font-medium">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-6 text-sm text-gray-600">{breakdown[star]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Review Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border rounded-md space-y-3"
        >
          <label className="font-medium">Rating:</label>
          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
          />

          <label className="font-medium">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500"
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="text-gray-600">Please login to submit a review.</p>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-md"></div>
          ))
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map((rev) => {
            const revUserId = (rev.user?._id || rev.user?.id)?.toString();
            const canDelete = currentUserRole === "admin" || revUserId === currentUserId;

            return (
              <div key={rev._id} className="p-4 bg-white border rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{rev.user?.name || "Anonymous"}</span>
                  <Rating value={rev.rating} readOnly size="small" />
                </div>
                <p className="text-gray-700">{rev.comment}</p>

                {canDelete && (
                  <button
                    onClick={() => {
                      setReviewToDelete(rev._id);
                      setShowConfirm(true);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AlertDialogModal */}
      <AlertDialogModal
        open={showConfirm}
        message="Are you sure you want to delete this review?"
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
        confirmText="Delete"
      />
    </div>
  );
};

export default ReviewSection;
