"use client";

import React from "react";

export default function OrdersStatusPanelUI({
  orders,
  selected,
  bulkStatus,
  setBulkStatus,
  loading,
  allowedTransitions,
  rowStatus,
  toggleSelect,
  toggleSelectAll,
  updateStatus,
  handleRowStatusChange,
  getBulkOptions,
}) {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 min-h-screen">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 p-5 rounded-2xl shadow-lg mb-5 flex flex-col md:flex-row justify-between gap-4">

        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Orders Status Panel
        </h1>

        {/* BULK ACTION */}
        <div className="flex gap-3 items-center">

          {/* 🔥 ULTRA PREMIUM DROPDOWN */}
          <div className="relative group">
            <select
              className="
              appearance-none
              bg-gradient-to-br from-white to-gray-50
              border border-gray-300
              text-gray-700 text-sm font-medium
              px-4 py-2.5 pr-10
              rounded-xl
              shadow-sm

              hover:border-gray-400
              hover:shadow-md

              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
              focus:border-blue-500

              transition-all duration-200
              cursor-pointer
              "
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <option value="">Bulk Status</option>
              {getBulkOptions().map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* ICON */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-focus-within:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* GLOW EFFECT */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-blue-500/5 blur-sm pointer-events-none"></div>
          </div>

          <button
            onClick={() => updateStatus(selected, bulkStatus)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all"
          >
            Apply
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
              <tr>

                <th className="p-4">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selected.length > 0}
                    className="accent-blue-600 cursor-pointer"
                  />
                </th>

                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Update</th>
                <th className="p-4 text-left">Action</th>

              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {orders.map((order) => {
                const allowed =
                  allowedTransitions[order.orderStatus] || [];

                return (
                  <tr
                    key={order._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >

                    {/* CHECKBOX */}
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(order._id)}
                        onChange={() => toggleSelect(order._id)}
                        className="accent-blue-600 cursor-pointer"
                      />
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-gray-700">
                      {order.user?.email}
                    </td>

                    {/* ORDER ID */}
                    <td className="p-4 text-xs text-gray-400">
                      {order._id}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* 🔥 ROW PREMIUM DROPDOWN */}
                    <td className="p-4">
                      <div className="relative group w-44">
                        <select
                          className="
                          appearance-none w-full
                          bg-gradient-to-br from-white to-gray-50
                          border border-gray-300
                          text-gray-700 text-sm font-medium
                          px-3 py-2 pr-9
                          rounded-lg
                          shadow-sm

                          hover:border-gray-400
                          hover:shadow-md

                          focus:outline-none
                          focus:ring-2 focus:ring-green-500/40
                          focus:border-green-500

                          transition-all duration-200
                          cursor-pointer
                          "
                          value={rowStatus[order._id] || ""}
                          onChange={(e) =>
                            handleRowStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {allowed.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        {/* ICON */}
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-focus-within:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* HOVER GLOW */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-green-500/5 blur-sm pointer-events-none"></div>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="p-4">
                      <button
                        onClick={() =>
                          updateStatus(
                            [order._id],
                            rowStatus[order._id]
                          )
                        }
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow hover:shadow-lg hover:scale-[1.05] active:scale-95 transition-all"
                      >
                        Update
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}