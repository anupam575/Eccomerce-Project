import Notification from "../models/notificationModel.js";

const sendNotification = async ({
  io,
  userId,
  title,
  message,
  type = "alert",
  orderId = null,
  productId = null,
}) => {
  // ✅ Save notification
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    orderId,
    productId,
    read: false,
  });

  if (io) {
    // 🔔 send notification
    io.to(userId.toString()).emit("notification", notification);

    // 🔢 send updated count
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    io.to(userId.toString()).emit("notificationCount", {
      unreadCount,
    });
  }

  return notification;
};

export default sendNotification;