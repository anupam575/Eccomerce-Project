import express from "express";
import {
  getSingleOrder,
  newOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  getAllOrdersSearch,
  deleteOrders,
} from "../controllers/orderController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

//
// 🧾 USER ROUTES
//

// Create order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// Get logged-in user's orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Get single order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);


//
// 🔐 ADMIN ROUTES
//

// Get all orders + delete (bulk)
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrders);

// Search orders
router
  .route("/admin/orders/search")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersSearch);

// Update order status (single or bulk)
router
  .route("/admin/orders/update-status")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

export default router;