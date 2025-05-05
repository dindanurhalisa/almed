"use client";

import { useRouter } from "next/navigation";
import { IoSearch, IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const Searchbar = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/list?name=${encodeURIComponent(searchValue)}#filter`);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`flex bg-white w-full items-center justify-between rounded-full border transition-all duration-300 ${isFocused ? 'border-rose-500 bg-white shadow-md' : 'border-gray-200 bg-gray-100'} p-2 pr-3`}
      initial={{ opacity: 0.9, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex w-full items-center gap-2 pl-2">
        <motion.div
          animate={{ rotate: isFocused ? 360 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <IoSearch className={`h-4 w-4 ${isFocused ? 'text-rose-500' : 'text-gray-500'}`} />
        </motion.div>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full min-w-0 flex-1 text-sm outline-none"
        />
        {searchValue && (
          <motion.button
            type="button"
            onClick={clearSearch}
            className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoCloseOutline className="h-4 w-4 text-gray-500" />
          </motion.button>
        )}
      </div>
      <motion.button
        type="submit"
        className={`flex-shrink-0 ml-2 rounded-full ${searchValue ? 'bg-rose-500 text-white px-3 py-1 text-xs' : 'text-transparent'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!searchValue}
      >
        {searchValue ? 'Search' : ''}
      </motion.button>
    </motion.form>
  );
};

export default Searchbar;