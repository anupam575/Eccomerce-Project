"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { useState } from "react";

const Panel = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Product" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className={`${darkMode ? "dark" : ""} w-full`}>
      {/* Fixed Header */}
      <header
        className={`  left-0  w-full h-12  px-6 flex items-center justify-between shadow-md transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-[#232f3e]"
        }`}
      >
        {/* Left – Navbar/Menu */}
        <div className="flex items-center z-50">
          <Navbar />
        </div>

        {/* Center – Nav Links */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span
                  className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1
                    after:h-[3px] after:rounded after:bg-white after:transition-all after:duration-300
                    hover:after:w-full ${isActive ? "after:w-full" : "after:w-0"}`}
                >
                  <span className="text-white font-semibold text-lg tracking-wide select-none">
                    {item.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right – Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm transition shadow-md"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 w-full"></div>
    </div>
  );
};

export default Panel;
