"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";

// NAV SECTIONS
const NAV_SECTIONS = [
  {
    title: "Your Account",
    items: [
      { href: "/profile", label: "Your Profile", icon: AccountCircleIcon },
      { href: "/my-orders", label: "Your Orders", icon: Inventory2Icon },
    ],
  },
  {
    title: "Order Tracking",
    items: [
      { href: "/OrdersTracker", label: "Order Tracker" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

// 🔥 BEST AVATAR COMPONENT (NO NEXT IMAGE ERROR)
const TailwindAvatar = ({ src, alt }) => {
  const fallback =
    "https://placehold.co/150x150?text=" + (alt?.[0]?.toUpperCase() || "U");

  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src]);

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  const drawerRef = useRef(null);

  // ESC + Scroll Lock
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);

    document.body.style.overflow = isOpen ? "hidden" : "auto";

    if (isOpen) drawerRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* MENU BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="z-50 p-1 text-white"
      >
        <MenuIcon className="!text-[36px]" />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* DRAWER */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <TailwindAvatar
              src={user?.avatar}
              alt={user?.name || "User"}
            />
            <span className="font-semibold text-sm">
              Hello, {user?.name || "Guest"}
            </span>
          </div>

          <button onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto h-full pb-10">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="py-3">
              <h3 className="px-5 text-sm font-semibold text-gray-900 mb-2">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-2 text-sm
                      ${
                        active
                          ? "bg-gray-200 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {Icon && (
                        <Icon className="text-gray-600 text-[20px]" />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 h-px bg-gray-200" />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}