"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

const UserSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-xl group">
        
        {/* Background Glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

        {/* Input Container */}
        <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-md">
          
          {/* Icon */}
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />

          {/* Input */}
          <input
            type="text"
            placeholder="Search by Name, Email, ID, or Created Date..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              onSearch(value);
            }}
            className="
              w-full pl-11 pr-4 py-3
              bg-transparent
              text-sm text-gray-700
              placeholder-gray-400
              outline-none
              rounded-xl
              focus:ring-2 focus:ring-blue-500/40
              transition-all duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearch;