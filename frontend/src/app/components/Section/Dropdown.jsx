"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector } from "react-redux";

export default function NotificationDropdown() {
  const unreadCount = useSelector(
    (state) => state.notifications?.unreadCount || 0
  );

  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // 🔒 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !buttonRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <div className="relative">
        <IconButton
          ref={buttonRef}
          onClick={() => setOpen((prev) => !prev)}
          className="!text-white hover:bg-white/10 transition-all"
        >
          <NotificationsIcon />
        </IconButton>

        {/* 🔴 Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 
            min-w-[18px] h-[18px] px-1
            flex items-center justify-center 
            text-[10px] font-bold text-white 
            bg-red-500 rounded-full shadow"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* 📦 Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-3 w-72 
          bg-white/90 backdrop-blur-xl 
          rounded-2xl shadow-xl border border-gray-200 
          overflow-hidden z-50
          animate-in fade-in zoom-in-95 duration-200"
        >
          {/* 🔝 Header */}
          <div className="px-4 py-3 flex justify-between items-center border-b">
            <span className="font-semibold text-gray-800">
              Notifications
            </span>

            {unreadCount > 0 && (
              <span className="text-xs text-red-500 font-medium">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* 🔔 Notification Link */}
          <Link
            href="/notification"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 
            hover:bg-gray-100 transition"
          >
            <div className="p-2 bg-gray-100 rounded-full">
              <NotificationsIcon className="text-gray-700 text-[20px]" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                View Notifications
              </span>
              <span className="text-xs text-gray-500">
                Check your latest updates
              </span>
            </div>
          </Link>

          {/* 👇 Empty State */}
          {unreadCount === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No new notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
}