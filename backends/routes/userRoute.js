import express from "express";
import rateLimit from "express-rate-limit";

import {
  getActiveUsers,
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  updateUserRole,
  getSingleUser,

  deleteUser,

  searchUsers,
  refreshToken,
  getUploadSignature,
} from "../controllers/userController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// -------------------- Rate Limiters --------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// -------------------- Public routes --------------------
router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/password/forgot").post(authLimiter, forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(logout);

// Refresh token & upload signature
router.get("/get-signature", getUploadSignature);
router.route("/refresh-token").get(refreshToken);

// -------------------- Authenticated routes --------------------
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);


router
  .route("/admin/users/active")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getActiveUsers);

router.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.delete(
  "/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser
);
router.get("/users/search", searchUsers);
router.get("/users/:id", getSingleUser);

router.patch(
  "/users/:id/role",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUserRole
);
export default router;