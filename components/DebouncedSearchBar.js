// src/components/DebouncedSearchBar.js
"use client";

import { useState, useMemo, useEffect } from "react";
import { debounce } from "../utils"; // Import the debounce utility

const DebouncedSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the debounced function to ensure it doesn't change on every render
  // We want to debounce the actual search execution, not the state update.
  const debouncedSearch = useMemo(() => {
    // Debounce the call to the parent's onSearch handler by 300ms
    return debounce((value) => {
      onSearch(value);
    }, 300);
  }, [onSearch]); // onSearch should be stable, but included for completeness

  // Update the debounced function whenever the local state changes
  useEffect(() => {
    // Only call the debounced function if the search term changes
    debouncedSearch(searchTerm);

    // Cleanup function to cancel any pending debounce calls
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel(); // If your debounce supports cancel
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full py-2 pl-10 pr-4 rounded-full border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 text-sm dark:text-gray-100 placeholder-gray-500"
      />
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default DebouncedSearchBar;
