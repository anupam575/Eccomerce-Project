"use client";

import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

/* helpers */

// ✅ NEW: Role formatter (object based)
const formatRole = (role) => {
  if (!role) return "Not assigned";

  // capitalize first letter
  return role.name
    ? role.name.charAt(0).toUpperCase() + role.name.slice(1)
    : "Unknown";
};

export default function GetUser() {
  const { user, loading, error, authChecked } = useSelector(
    (state) => state.auth
  );

  // ⏳ Auth checking
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center gap-2 my-10">
        <div className="animate-spin border-4 border-gray-200 border-t-blue-500 rounded-full w-6 h-6"></div>
        <span>Checking auth...</span>
      </div>
    );
  }

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center gap-2 my-10">
        <div className="animate-spin border-4 border-gray-200 border-t-blue-500 rounded-full w-6 h-6"></div>
        <span>Loading user...</span>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  // ❌ No user
  if (!user) {
    return (
      <p className="text-gray-500 text-center mt-6">No user found</p>
    );
  }

  // 📅 Format date
  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-800">
          User Details
        </h2>

        {/* Avatar */}
        <img
          src={user.avatar || "https://via.placeholder.com/150?text=User"}
          alt={user.name}
          className="w-28 h-28 rounded-full mx-auto object-cover"
        />

        {/* Info rows */}
        <div className="space-y-3 text-gray-700">

          <div className="flex items-center gap-2">
            <PersonIcon className="w-5 h-5 text-blue-500" />
            <span>
              <strong>Name:</strong> {user.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EmailIcon className="w-5 h-5 text-green-500" />
            <span>
              <strong>Email:</strong> {user.email}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeIcon className="w-5 h-5 text-purple-500" />
            <span>
              <strong>Role:</strong> {formatRole(user.role)}
            </span>
          </div>

          {/* ✅ EXTRA: show role key also (debug / admin logic clarity) */}
          <div className="flex items-center gap-2">
            <BadgeIcon className="w-5 h-5 text-indigo-500" />
            <span>
              <strong>Role Key:</strong>{" "}
              {user.role?.key || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarMonthIcon className="w-5 h-5 text-orange-500" />
            <span>
              <strong>Joined:</strong>{" "}
              {user.createdAt ? formatDate(user.createdAt) : "N/A"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}