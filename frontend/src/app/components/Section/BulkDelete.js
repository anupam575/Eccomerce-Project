"use client";

import React from "react";

const BulkSelectionTable = ({
  data = [],
  selected = [],
  setSelected,
  renderRow,
}) => {

  // ✅ TOGGLE SINGLE
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ✅ SELECT ALL
  const toggleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((item) => item._id));
    }
  };

  return (
    <div className="w-full  rounded-xl border border-gray-200 bg-white shadow-sm">

      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
          <tr className="text-xs uppercase tracking-wider">

            {/* SELECT ALL */}
            <th className="px-4 py-3 border border-gray-200 text-left font-semibold">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                checked={
                  selected.length === data.length && data.length > 0
                }
                onChange={toggleSelectAll}
              />
            </th>

            {/* CUSTOM HEAD */}
            {renderRow("head")}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id}
              className={`
                transition-all duration-150
                ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                hover:bg-blue-50
              `}
            >

              {/* CHECKBOX */}
              <td className="px-4 py-3 border border-gray-200">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  checked={selected.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                />
              </td>

              {/* CUSTOM ROW */}
              {renderRow("body", item)}
            </tr>
          ))}
        </tbody>

      </table>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="p-6 text-center text-gray-400 text-sm">
          No data available
        </div>
      )}
    </div>
  );
};

export default BulkSelectionTable;