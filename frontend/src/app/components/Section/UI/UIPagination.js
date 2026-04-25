"use client";

import React from "react";

function UIPagination({ totalPages = 1, page = 1, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Previous Button */}
      <button
        disabled={page === 1}
        onClick={() => onChange(null, page - 1)}
        className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(null, p)}
          className={`px-3 py-1 rounded ${
            page === p
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(null, page + 1)}
        className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default UIPagination;
