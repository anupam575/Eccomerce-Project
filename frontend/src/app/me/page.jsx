"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../components/Signup/LogoutButton";

/* helpers */

// ✅ UPDATED: handle role object
const formatRole = (role) => {
  if (!role) return "Not assigned";

  return role.name
    ? role.name.charAt(0).toUpperCase() + role.name.slice(1)
    : "Unknown";
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
};

export default function MyProfile() {
  const { user, isAuthenticated, authChecked } = useSelector(
    (state) => state.auth
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ⏳ Auth check
  if (!authChecked) {
    return (
      <p className="text-center mt-8 text-gray-700">Loading profile...</p>
    );
  }

  // ❌ Not logged in
  if (!isAuthenticated || !user) {
    return (
      <p className="text-center mt-8 text-red-500">
        ⚠️ You are not logged in
      </p>
    );
  }

  return (
    <div className="-mt-16 flex justify-center items-start p-6">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
        
        {/* Heading */}
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          My Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center my-6">
          {user.avatar ? (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-40 h-40 rounded-full cursor-pointer shadow-xl hover:scale-105 transition-transform duration-300"
                onClick={() => setIsModalOpen(true)}
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/150?text=${getInitials(
                    user.name
                  )}`;
                }}
              />

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                  <div className="relative bg-white rounded-xl p-4 shadow-2xl max-w-sm w-full">
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ✖
                    </button>
                    <img
                      src={user.avatar}
                      alt="Full Avatar"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-40 h-40 rounded-full bg-blue-600 text-white text-5xl flex items-center justify-center shadow-xl">
              {getInitials(user.name)}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-gray-700 mb-6">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* ✅ Updated Role Display */}
          <p>
            <strong>Role:</strong> {formatRole(user.role)}
          </p>

          {/* ✅ Extra: role key (important for debugging / RBAC) */}
          <p>
            <strong>Role Key:</strong> {user.role?.key || "N/A"}
          </p>
        </div>

        {/* Logout */}
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}