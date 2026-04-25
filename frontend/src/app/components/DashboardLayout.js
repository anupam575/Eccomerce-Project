"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  ExpandMore,
} from "@mui/icons-material";


const DashboardLayout = ({ children, menuItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({});

  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const toggleDarkMode = () => setDarkMode((p) => !p);

  const handleDropdown = (menu) =>
    setOpenDropdown((p) => ({ ...p, [menu]: !p[menu] }));

  return (
    <div className={`flex min-h-screen w-full ${darkMode ? "dark" : ""}`}>

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed left-0 top-0 z-50 h-full flex flex-col
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
          border-r border-gray-200 dark:border-gray-700
          ${sidebarOpen || hovered ? "w-64" : "w-20"}
          transition-all duration-300
        `}
      >

        {/* HEADER */}
        <div className={`flex items-center justify-between p-4 border-b
          ${darkMode ? "border-gray-800" : "border-gray-200"}`}>

          {(sidebarOpen || hovered) && (
            <span className="font-bold text-lg">
              Admin Dashboard
            </span>
          )}

          <button onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-2  overflow-y-auto scrollbar-thin">
          <ul className="space-y-2 px-2">

            {menuItems.map((item) => {
              const key = item.name.toLowerCase();
              const isDropdown = item.children;
              const activeDropdown = openDropdown[key];

              const isActive = isDropdown
                ? item.children.some((c) => pathname.startsWith(c.link))
                : pathname === item.link;

              return (
                <li key={item.name}>

                  {/* DROPDOWN */}
                  {isDropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdown(key)}
                        className={`
                          flex w-full items-center justify-between px-4 py-2 rounded-xl
                          ${isActive
                            ? darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-indigo-100 text-indigo-800"
                            : darkMode
                            ? "hover:bg-gray-800"
                            : "hover:bg-gray-100"}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {(sidebarOpen || hovered) && (
                            <span>{item.name}</span>
                          )}
                        </div>

                        {(sidebarOpen || hovered) && (
                          <ExpandMore
                            className={`transition ${
                              activeDropdown ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* DROPDOWN LIST */}
                      {activeDropdown && (sidebarOpen || hovered) && (
                        <ul className="pl-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.link}
                                className={`
                                  block px-3 py-2 rounded-lg text-sm
                                  ${pathname === child.link
                                    ? darkMode
                                      ? "bg-gray-700 text-white"
                                      : "bg-indigo-100 text-indigo-800"
                                    : darkMode
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100"}
                                `}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    // SINGLE ITEM
                    <Link
                      href={item.link}
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-xl
                        ${isActive
                          ? darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-indigo-100 text-indigo-800"
                          : darkMode
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"}
                      `}
                    >
                      {item.icon}
                      {(sidebarOpen || hovered) && (
                        <span>{item.name}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}

          </ul>
        </nav>

        {/* DARK MODE */}
        {(sidebarOpen || hovered) && (
          <div className={`mt-auto p-4 border-t
            ${darkMode ? "border-gray-800" : "border-gray-200"}`}>

            <button
              onClick={toggleDarkMode}
              className="w-full px-2 py-2 rounded-xl"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}

      </aside>

      {/* MAIN */}
      <main
        className={`
          flex-1 flex flex-col min-h-screen -mt-16
          ${sidebarOpen || hovered ? "ml-64" : "ml-20"}
          ${darkMode ? "bg-gray-900 text-white" : "bg-slate-50"}
        `}
      >
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;