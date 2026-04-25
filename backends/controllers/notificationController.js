import Notification from "../models/notificationModel.js";
import sendNotification from "../utils/sendNotification.js";

/* ================= CREATE ================= */
const addNotification = async (req, res) => {
  try {
    const {
      userId,
      title,
      message,
      type = "alert",
      orderId = null,
      productId = null,
    } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, title and message are required",
      });
    }

    const io = req.app.get("io");

    const notification = await sendNotification({
      io,
      userId,
      title,
      message,
      type,
      orderId,
      productId,
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= GET ALL ================= */
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= GET UNREAD COUNT ================= */
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= MARK SINGLE AS READ ================= */
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const unreadCount = await Notification.countDocuments({
      userId: notification.userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      notificationId,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= MARK ALL AS READ ================= */
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= DELETE ONE ================= */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const unreadCount = await Notification.countDocuments({
      userId: notification.userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= CLEAR ALL ================= */
const clearUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.deleteMany({ userId });

    res.status(200).json({
      success: true,
      unreadCount: 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  addNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearUserNotifications,
};