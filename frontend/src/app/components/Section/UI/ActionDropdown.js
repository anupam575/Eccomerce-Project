import { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ActionDropdown({ onUpdate, onView, onDelete }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🔹 Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 3-dot button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <MoreVertIcon className="w-5 h-5 text-gray-500" />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transform transition-all duration-150 ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Update */}
        {onUpdate && (
          <button
            onClick={() => {
              onUpdate();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <EditIcon className="w-4 h-4" />
            Update
          </button>
        )}

        {/* View */}
        {onView && (
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <VisibilityIcon className="w-4 h-4" />
            View
          </button>
        )}

        {/* Divider */}
        <div className="border-t my-1"></div>

        {/* Delete */}
        {onDelete && (
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <DeleteIcon className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}