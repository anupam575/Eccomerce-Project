import mongoose from "mongoose";
import Category from "../models/categoryModel.js";

/**
 * Escape special regex characters (Security)
 */
export const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Build keyword filter for Product search
 * Matches:
 * - product name
 * - product description
 * - category name (via category collection)
 */
export const buildKeywordFilter = async (keyword) => {
  if (!keyword || !keyword.trim()) return {};

  const search = escapeRegex(keyword.trim());

  // 1️⃣ Find matching categories by name
  const matchedCategories = await Category.find({
    name: { $regex: search, $options: "i" },
  }).select("_id");

  const categoryIds = matchedCategories.map((c) => c._id);

  // 2️⃣ Build OR conditions safely
  const orConditions = [
    { name: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
  ];

  // 3️⃣ Only push category filter if categories exist
  if (categoryIds.length > 0) {
    orConditions.push({ category: { $in: categoryIds } });
  }

  return { $or: orConditions };
};


export const buildDynamicFilters = (query) => {
  const filters = {};

  // 1️⃣ Copy query & remove non-filter params
  const queryCopy = { ...query };
  const skipKeys = ["keyword", "page", "limit", "categoryId"];
  skipKeys.forEach((key) => delete queryCopy[key]);

  // 2️⃣ Allowed filter fields (Security)
  const allowedFields = ["price", "ratings", "stock", "brand", "color"];

  for (const key in queryCopy) {
    const value = queryCopy[key];

    // 3️⃣ Handle operators like price[gte]
    if (key.includes("[")) {
      const [field, operatorWithBracket] = key.split("[");
      const operator = operatorWithBracket.replace("]", "");

      // ❌ Skip unknown fields
      if (!allowedFields.includes(field)) continue;

      if (!filters[field]) filters[field] = {};

      // Convert numeric values safely
      const parsedValue = isNaN(value) ? value : Number(value);
      filters[field][`$${operator}`] = parsedValue;

    } else {
      // 4️⃣ Simple equality filter
      if (!allowedFields.includes(key)) continue;
      filters[key] = value;
    }
  }

  // 5️⃣ CategoryId filter (highest priority)
  if (query.categoryId && mongoose.Types.ObjectId.isValid(query.categoryId)) {
    filters.category = new mongoose.Types.ObjectId(query.categoryId);
  }

  return filters;
};
