import express from "express";
import multer from "multer";
import {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Multer memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route: Get all brands (for filters, dropdowns)
router.get("/brands", getAllBrands);

// Admin route: Create Brand
router.post(
  "/admin/brand",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.single("logo"), // expects 'logo' file key from frontend
  createBrand
);

// Admin route: Update Brand
router.put(
  "/admin/brand/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateBrand
);

// Admin route: Delete / Deactivate Brand
router.delete(
  "/admin/brand/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteBrand
);

export default router;
