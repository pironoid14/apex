import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState } from '../types';

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount
}) => {
  const categories = [
    { id: 'all', label: 'All Systems' },
    { id: 'gaming', label: 'Custom Gaming' },
    { id: 'workstation', label: 'Studio Workstations' },
    { id: 'mini-itx', label: 'Mini-ITX' },
    { id: 'laptop', label: 'Mobile Workstations' },
    { id: 'server', label: 'Deep Learning & Servers' }
  ];

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      brands: [],
      cpuTypes: [],
      gpuTypes: [],
      ramMin: 0,
      priceMin: 0,
      priceMax: 12000,
      inStockOnly: false,
      sortBy: 'featured'
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.brands.length > 0 ||
    filters.cpuTypes.length > 0 ||
    filters.gpuTypes.length > 0 ||
    filters.ramMin > 0 ||
    filters.priceMax < 12000 ||
    filters.inStockOnly;

  return (
    <div className="space-y-4">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by model, CPU, RTX 4090, DDR5, brand..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="text-xs text-neutral-400 font-mono">
            Showing <span className="text-white font-semibold">{filteredCount}</span> of {totalCount} systems
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-xs text-neutral-400 shrink-0">Sort by:</label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy']
                }))
              }
              className="bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured">Featured Builds</option>
              <option value="performance">Highest Performance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-amber-400 border border-neutral-800 hover:border-neutral-700 rounded-lg bg-neutral-900/60 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Segmented Category Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        {/* Quick in-stock filter */}
        <button
          onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
          className={`ml-auto px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
            filters.inStockOnly
              ? 'bg-emerald-950/60 border border-emerald-600/80 text-emerald-300'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              filters.inStockOnly ? 'bg-emerald-400' : 'bg-neutral-600'
            }`}
          />
          <span>In Stock Only</span>
        </button>
      </div>

      {/* Advanced Quick Filters: RAM and Max Price */}
      <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* RAM Minimum Selector */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Min RAM:</span>
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            {[0, 32, 64, 128].map((ram) => (
              <button
                key={ram}
                onClick={() => setFilters((prev) => ({ ...prev, ramMin: ram }))}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  filters.ramMin === ram
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {ram === 0 ? 'Any' : `${ram}GB+`}
              </button>
            ))}
          </div>
        </div>

        {/* Price Cap Filter */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Max Price:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2000"
              max="12000"
              step="500"
              value={filters.priceMax}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceMax: Number(e.target.value) }))
              }
              className="w-24 sm:w-32 accent-amber-400 bg-neutral-800 cursor-pointer"
            />
            <span className="font-mono text-white font-medium tabular-nums">
              ${filters.priceMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Platform Architecture */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Processor:</span>
          <div className="flex items-center gap-1">
            {['AMD', 'Intel'].map((brand) => {
              const isSelected = filters.cpuTypes.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      cpuTypes: isSelected
                        ? prev.cpuTypes.filter((b) => b !== brand)
                        : [...prev.cpuTypes, brand]
                    }))
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/50 text-amber-300 font-medium'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
