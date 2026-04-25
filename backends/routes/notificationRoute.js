import express from "express";
import notificationController from "../controllers/notificationController.js";

const {
  addNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearUserNotifications,
} = notificationController;

const router = express.Router();

/* ================= CREATE ================= */
router.post("/add", addNotification);

/* ================= GET ALL ================= */
router.get("/user/:userId", getUserNotifications);

/* ================= GET UNREAD COUNT ================= */
router.get("/unread-count/:userId", getUnreadCount);

/* ================= MARK SINGLE READ ================= */
router.put("/mark-read/:notificationId", markAsRead);

/* ✅ FIXED (removed extra /notifications) */
router.put("/mark-all-read/:userId", markAllAsRead);

/* ================= DELETE ONE ================= */
router.delete("/delete/:notificationId", deleteNotification);

/* ================= CLEAR ALL ================= */
router.delete("/clear/:userId", clearUserNotifications);

export default router;