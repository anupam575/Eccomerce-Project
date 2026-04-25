import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },

  description: {
    type: String,
    required: true,
    index: true,
  },

  price: {
    type: Number,
    required: true,
    max: [99999999, "Price too high"],
  },

  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],

  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },

  stock: {
    type: Number,
    required: true,
    default: 1,
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
