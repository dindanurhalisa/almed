'use client';

import { Category } from '@/types/type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoFilterOutline, IoCloseOutline, IoChevronDownOutline, IoChevronUpOutline, IoRefreshOutline } from 'react-icons/io5';
import { MdOutlineSort } from 'react-icons/md';

type FilterProps = {
  category: Category[];
};

const Filter = ({ category }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('min') || '';
  const currentMaxPrice = searchParams.get('max') || '';

  // State for form values
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [selectedSort, setSelectedSort] = useState(currentSort);

  // State for UI
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Update state when URL params change
  useEffect(() => {
    setSelectedCategory(currentCategory);
    setSelectedSort(currentSort);
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setIsPriceFilterActive(!!currentMinPrice || !!currentMaxPrice);
  }, [currentCategory, currentSort, currentMinPrice, currentMaxPrice]);

  const applyFilter = () => {
    const params = new URLSearchParams();

    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    if (selectedSort && selectedSort !== 'newest') {
      params.set('sort', selectedSort);
    }

    if (minPrice) {
      params.set('min', minPrice);
    }

    if (maxPrice) {
      params.set('max', maxPrice);
    }

    // Preserve search term if it exists
    const searchTerm = searchParams.get('name');
    if (searchTerm) {
      params.set('name', searchTerm);
    }

    router.push(`/list?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue);
    setIsSortOpen(false);

    // Apply sort immediately
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    router.push(`/list?${params.toString()}`);
  };

  const clearFilter = () => {
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSort('newest');
    setIsPriceFilterActive(false);

    // Preserve search term if it exists
    const searchTerm = searchParams.get('name');
    if (searchTerm) {
      router.push(`/list?name=${searchTerm}`);
    } else {
      router.push('/list');
    }
  };

  // Check if any filter is active
  const isAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedSort !== 'newest' ||
    !!minPrice ||
    !!maxPrice;

  return (
    <div className="mt-8 mb-6">
      {/* Mobile Filter Button */}
      <motion.div
        className="flex items-center justify-between mb-4 md:hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          type="button"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <IoFilterOutline className="h-4 w-4 text-rose-500" />
          <span>Filter</span>
          {isFilterExpanded ? (
            <IoChevronUpOutline className="h-4 w-4" />
          ) : (
            <IoChevronDownOutline className="h-4 w-4" />
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdOutlineSort className="h-4 w-4 text-rose-500" />
          <span>Sort</span>
          {isSortOpen ? (
            <IoChevronUpOutline className="h-4 w-4" />
          ) : (
            <IoChevronDownOutline className="h-4 w-4" />
          )}
        </motion.button>

        {isAnyFilterActive && (
          <motion.button
            type="button"
            onClick={clearFilter}
            className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <IoRefreshOutline className="h-4 w-4" />
            <span>Reset</span>
          </motion.button>
        )}
      </motion.div>

      {/* Mobile Sort Dropdown */}
      <AnimatePresence>
        {isSortOpen && (
          <motion.div
            className="fixed inset-x-0 top-20 z-40 bg-white shadow-lg rounded-t-xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">Sort By</h3>
              <button onClick={() => setIsSortOpen(false)}>
                <IoCloseOutline className="h-6 w-6" />
              </button>
            </div>
            <div className="p-2">
              {[
                { value: 'newest', label: 'Terbaru' },
                { value: 'oldest', label: 'Terlama' },
                { value: 'price_asc', label: 'Harga Terendah' },
                { value: 'price_desc', label: 'Harga Tertinggi' }
              ].map(option => (
                <motion.button
                  key={option.value}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg p-3 text-left ${selectedSort === option.value ? 'bg-rose-50 text-rose-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSortChange(option.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-rose-500"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">All Categories</option>
                  {category.map((item: Category) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-neutral-700">Price Range</label>
                  <motion.button
                    type="button"
                    onClick={() => setIsPriceFilterActive(!isPriceFilterActive)}
                    className="text-xs text-rose-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPriceFilterActive ? 'Hide' : 'Show'}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isPriceFilterActive && (
                    <motion.div
                      className="mt-2 flex items-center gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.button
                  type="button"
                  onClick={applyFilter}
                  className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>

                {isAnyFilterActive && (
                  <motion.button
                    type="button"
                    onClick={clearFilter}
                    className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Reset
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filter */}
      <motion.div
        className="hidden md:flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <IoFilterOutline className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          {/* Category dropdown - styled like the sort dropdown */}
          <div className="relative inline-block text-left">
            <motion.button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              {isCategoryOpen ? (
                <IoChevronUpOutline className="h-4 w-4" />
              ) : (
                <IoChevronDownOutline className="h-4 w-4" />
              )}
            </motion.button>

            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  className="absolute left-0 z-10 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-1">
                    <motion.button
                      key="all"
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${selectedCategory === 'all' ? 'bg-rose-50 text-rose-500' : 'text-gray-700'}`}
                      onClick={() => handleCategoryChange('all')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>All Categories</span>
                      {selectedCategory === 'all' && (
                        <div
                          className="h-2 w-2 rounded-full bg-rose-500"
                        />
                      )}
                    </motion.button>

                    {category.map((item: Category) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${selectedCategory === item.name ? 'bg-rose-50 text-rose-500' : 'text-gray-700 hover:bg-neutral-100'}`}
                        onClick={() => handleCategoryChange(item.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{item.name}</span>
                        {selectedCategory === item.name && (
                          <div
                            className="h-2 w-2 rounded-full bg-rose-500"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="w-24 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="w-24 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={applyFilter}
            className="rounded-lg bg-rose-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply
          </motion.button>

          {isAnyFilterActive && (
            <motion.button
              type="button"
              onClick={clearFilter}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-500 hover:bg-rose-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <IoRefreshOutline className="h-4 w-4" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <MdOutlineSort className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium">Sort by:</span>
            <div className="relative inline-block text-left">
              <motion.button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedSort === 'newest' && 'Terbaru'}
                {selectedSort === 'oldest' && 'Terlama'}
                {selectedSort === 'price_asc' && 'Harga Terendah'}
                {selectedSort === 'price_desc' && 'Harga Tertinggi'}
                {isSortOpen ? (
                  <IoChevronUpOutline className="h-4 w-4" />
                ) : (
                  <IoChevronDownOutline className="h-4 w-4" />
                )}
              </motion.button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      {[
                        { value: 'newest', label: 'Terbaru' },
                        { value: 'oldest', label: 'Terlama' },
                        { value: 'price_asc', label: 'Harga Terendah' },
                        { value: 'price_desc', label: 'Harga Tertinggi' }
                      ].map(option => (
                        <motion.button
                          key={option.value}
                          type="button"
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${selectedSort === option.value ? 'bg-rose-50 text-rose-500' : 'text-gray-700 hover:bg-neutral-100'}`}
                          onClick={() => handleSortChange(option.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{option.label}</span>
                          {selectedSort === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-rose-500"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Filter;
