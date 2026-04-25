"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchKeyword,
  clearSearchKeyword,
} from "../../../redux/slices/searchSlice";
import {
  fetchSuggestions,
  clearSuggestions,
} from "../../../redux/slices/suggestionsSlice";
import { useRouter } from "next/navigation";

/* MUI ICONS ONLY */
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useSelector((state) => state?.suggestions?.list) || [];
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch suggestions with debounce
  useEffect(() => {
    if (keyword.trim()) {
      const timer = setTimeout(() => dispatch(fetchSuggestions(keyword)), 300);
      return () => clearTimeout(timer);
    } else {
      dispatch(clearSuggestions());
    }
  }, [keyword, dispatch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }

    if (e.key === "Escape") {
      dispatch(clearSuggestions());
      setActiveIndex(-1);
    }
  };

  // Form submit (search)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    dispatch(setSearchKeyword(keyword.trim()));
    dispatch(clearSuggestions());
    router.push(`/product?keyword=${keyword.trim()}`);
  };

  // Select a suggestion
  const handleSelectSuggestion = (sugg) => {
    const searchTerm = sugg.name;
    setKeyword(searchTerm);
    dispatch(setSearchKeyword(searchTerm));
    dispatch(clearSuggestions());
    setActiveIndex(-1);
    router.push(`/product?keyword=${searchTerm}`);
  };

  // Clear input
  const clearInput = () => {
    setKeyword("");
    dispatch(clearSearchKeyword());
    dispatch(clearSuggestions());
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="
          flex items-center h-12
          rounded-2xl overflow-hidden
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-xl
        "
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          autoComplete="off"
          className="
            flex-1 h-full px-4
            bg-transparent
            text-sm text-gray-900
            placeholder-gray-500
            outline-none
          "
        />

        {/* CLEAR */}
        {keyword && (
          <button
            type="button"
            onClick={clearInput}
            className="h-full px-3 text-gray-700 hover:text-black transition"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}

        {/* SEARCH */}
        <button
          type="submit"
          className="h-full px-4 bg-amber-400/80 hover:bg-amber-400 text-black transition"
        >
          <SearchIcon fontSize="small" />
        </button>
      </form>

      {/* GLASS DROPDOWN */}
      {suggestions.length > 0 && (
        <ul
          className="
            absolute z-50 w-full mt-2
            max-h-64 overflow-y-auto
            rounded-2xl
            bg-white/20 backdrop-blur-2xl
            ring-1 ring-white/30
            shadow-2xl
            scrollbar-hide
          "
        >
          {suggestions.map((sugg, index) => (
            <li
              key={sugg._id}
              onClick={() => handleSelectSuggestion(sugg)}
              className={`
                px-4 py-2 cursor-pointer
                text-sm text-gray-900
                transition rounded-xl
                ${index === activeIndex ? "bg-white/40" : "hover:bg-white/30"}
              `}
            >
              {/* Product Name */}
              <span className="font-semibold">{sugg.name}</span>

              {/* Brand + Category */}
              <span className="text-xs text-gray-500 ml-2">
                {sugg.brandName ? `Brand: ${sugg.brandName}` : ""}
                {sugg.categoryName ? ` | Category: ${sugg.categoryName}` : ""}
              </span>

              {/* Description */}
              {sugg.description && (
                <p className="text-xs text-gray-400 truncate">{sugg.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
