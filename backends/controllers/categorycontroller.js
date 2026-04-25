// categoryController.js
import Category from "../models/categoryModel.js";
import mongoose from "mongoose"; // ES6 import



// ✅ REGEX: only letters + space allowed
const nameRegex = /^[A-Za-z\s]+$/;

// ================= CREATE CATEGORY =================
export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    // ✅ 1. Required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();

    // ✅ 2. No special characters
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and spaces are allowed",
      });
    }

    // ✅ 3. Prevent duplicate (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // ✅ 4. Create
    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE CATEGORY =================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    // ✅ 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    // ✅ 2. Check category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ 3. Required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();

    // ✅ 4. No special characters
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and spaces are allowed",
      });
    }

    // ✅ 5. Same name check
    if (name === category.name) {
      return res.status(400).json({
        success: false,
        message: "New name must be different from current name",
      });
    }

    // ✅ 6. Duplicate check (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    // ✅ 7. Update
    category.name = name;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error("[UPDATE CATEGORY ERROR]:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // 2️⃣ Find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3️⃣ Success response
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("[GET CATEGORY BY ID ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    // 2. Find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3. Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE CATEGORY ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};