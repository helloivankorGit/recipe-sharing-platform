"use client";

import { useState } from "react";

interface RecipeToolbarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onDifficultyFilter: (difficulty: string) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  categories: string[];
}

export function RecipeToolbar({
  onSearch,
  onCategoryFilter,
  onDifficultyFilter,
  searchQuery,
  selectedCategory,
  selectedDifficulty,
  categories,
}: RecipeToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch.trim());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    // Real-time search with debouncing effect
    if (value.trim() === "") {
      onSearch("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(localSearch.trim());
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Search Field */}
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={localSearch}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pl-10 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm font-medium text-zinc-700">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="difficulty" className="text-sm font-medium text-zinc-700">
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => onDifficultyFilter(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || selectedCategory || selectedDifficulty) && (
          <button
            onClick={() => {
              setLocalSearch("");
              onSearch("");
              onCategoryFilter("");
              onDifficultyFilter("");
            }}
            className="text-sm text-zinc-600 underline hover:text-zinc-900"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
