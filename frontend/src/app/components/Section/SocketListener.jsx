"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../../utils/socket";
import API from "../../../utils/axiosInstance";
import {
  addNotification,
  setUnreadCount,
} from "../../../redux/slices/notificationslice";

export default function NotificationsListener() {
  const dispatch = useDispatch();

  const { user, isAuthenticated, authChecked } = useSelector(
    (state) => state.auth
  );

  // ✅ SAFE userId (no memo needed)
  const userId = user?._id || user?.id || null;

  // 🟢 FETCH UNREAD COUNT
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await API.get(`/unread-count/${userId}`);
      dispatch(setUnreadCount(data?.unreadCount ?? 0));
    } catch (err) {
      console.log("❌ Count fetch error:", err.message);
    }
  }, [dispatch, userId]);

  // 🔁 INITIAL COUNT FETCH
  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated || !userId) return;

    fetchUnreadCount();
  }, [authChecked, isAuthenticated, userId, fetchUnreadCount]);

  // 📩 SOCKET HANDLER: NEW NOTIFICATION
  const handleNotification = useCallback(
    (notification) => {
      if (!notification?._id) return;
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  // 🔢 SOCKET HANDLER: UNREAD COUNT
  const handleUnreadCount = useCallback(
    (data) => {
      dispatch(setUnreadCount(data?.unreadCount ?? 0));
    },
    [dispatch]
  );

  // 🔌 SOCKET CONNECTION EFFECT
  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated || !userId) return;

    // set auth before connect
    socket.auth = { userId };

    if (!socket.connected) {
      socket.connect();
    }

    // 🧹 remove old listeners first (important)
    socket.off("notification");
    socket.off("notificationCount");

    // 🎯 attach listeners
    socket.on("notification", handleNotification);
    socket.on("notificationCount", handleUnreadCount);

    // 🧹 cleanup
    return () => {
      socket.off("notification", handleNotification);
      socket.off("notificationCount", handleUnreadCount);
    };
  }, [
    authChecked,
    isAuthenticated,
    userId,
    handleNotification,
    handleUnreadCount,
  ]);

  return null;
}