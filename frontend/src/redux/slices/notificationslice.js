import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/utils/axiosInstance";

/* ================= THUNKS ================= */

/* FETCH ALL */
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (userId) => {
    const { data } = await API.get(`/user/${userId}`);
    return data;
  }
);

/* CLEAR ALL */
export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAll",
  async (userId) => {
    await API.delete(`/clear/${userId}`);
    return true;
  }
);

/* MARK ALL READ */
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (userId) => {
    const { data } = await API.put(`/mark-all-read/${userId}`);
    return data;
  }
);

/* DELETE */
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id) => {
    const { data } = await API.delete(`/delete/${id}`);
    return { id, unreadCount: data.unreadCount };
  }
);

/* MARK ONE READ */
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id) => {
    const { data } = await API.put(`/mark-read/${id}`);
    return { id, unreadCount: data.unreadCount };
  }
);

/* ================= SLICE ================= */

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /* RESET */
    resetState: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    /* SOCKET: ADD NOTIFICATION (WITH DUPLICATE CHECK) */
    addNotification: (state, action) => {
      const exists = state.notifications.find(
        (n) => n._id === action.payload._id
      );

      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    },

    /* SOCKET: SET COUNT */
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })

      /* CLEAR ALL */
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })

      /* MARK ALL READ */
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));

        state.unreadCount = action.payload?.unreadCount ?? 0;
      })

      /* DELETE */
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { id, unreadCount } = action.payload;

        state.notifications = state.notifications.filter(
          (n) => n._id !== id
        );

        state.unreadCount = unreadCount;
      })

      /* MARK ONE READ */
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { id, unreadCount } = action.payload;

        const notif = state.notifications.find((n) => n._id === id);
        if (notif) notif.read = true;

        state.unreadCount = unreadCount;
      });
  },
});

/* ✅ EXPORT ALL (FIXED) */
export const {
  resetState,
  addNotification,
  setUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;    