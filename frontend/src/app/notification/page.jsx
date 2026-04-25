"use client";

import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Notifications,
  Delete,
  ClearAll,
  DoneAll,
} from "@mui/icons-material";

/* ================= THUNKS ================= */
import {
  fetchNotifications,
  clearAllNotifications,
  deleteNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../redux/slices/notificationslice";

function NotificationsPage() {
  const dispatch = useDispatch();

  /* ================= AUTH ================= */
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  /* ================= REDUX ================= */
  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  /* ================= INIT FETCH ================= */
  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [userId, isAuthenticated, dispatch]);

  /* ================= GROUPING ================= */
  const getSection = (ts) => {
    if (!ts) return "Earlier";

    const today = new Date();
    const d = new Date(ts);

    if (d.toDateString() === today.toDateString()) return "Today";
    if ((today - d) / 86400000 <= 7) return "This Week";
    return "Earlier";
  };

  const grouped = useMemo(() => {
    const group = { Today: [], "This Week": [], Earlier: [] };

    (notifications || []).forEach((n) => {
      if (!n?._id) return;
      group[getSection(n.createdAt)].push(n);
    });

    return group;
  }, [notifications]);

  /* ================= ACTIONS ================= */

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications(userId));
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  /* 🔥 NEW: MARK ALL READ */
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead(userId));
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-400 animate-pulse">
        Loading notifications...
      </p>
    );
  }

  const hasNotifications =
    Object.values(grouped).some((arr) => arr.length > 0);

  if (!hasNotifications) {
    return (
      <p className="text-center mt-20 text-gray-400">
        No notifications found.
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl -mt-15 mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Notifications ({unreadCount})
        </h1>

        <div className="flex gap-3">

          {/* 🔥 MARK ALL READ BUTTON */}
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white"
          >
            <DoneAll fontSize="small" />
            Mark All Read
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white"
          >
            <ClearAll fontSize="small" />
            Clear All
          </button>

        </div>
      </div>

      {/* GROUPS */}
      {["Today", "This Week", "Earlier"].map((sec) =>
        grouped[sec].length > 0 && (
          <div key={sec} className="mb-12">
            <h2 className="mb-5 text-sm font-bold text-gray-500">
              {sec}
            </h2>

            <div className="flex flex-col gap-4">
              {grouped[sec].map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkRead(n._id)}
                  className={`p-5 rounded-3xl cursor-pointer bg-white shadow ${
                    n.read ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-500">
                      <Notifications className="text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{n.type}</p>
                      <p className="text-sm text-gray-600">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n._id);
                      }}
                      className="text-red-500"
                    >
                      <Delete fontSize="small" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default NotificationsPage;