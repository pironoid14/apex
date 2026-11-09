import React, { useState, useMemo } from 'react';
import { Hero } from './Hero';
import { ProductFilters } from './ProductFilters';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { FilterState, Product } from '../types';
import { Cpu, ShieldCheck, Zap, RotateCcw, Wrench, CheckCircle } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { products } = useStore();

  const [filters, setFilters] = useState<FilterState>({
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCpu = p.specs.cpu.toLowerCase().includes(q);
          const matchGpu = p.specs.gpu.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchCpu && !matchGpu && !matchBrand && !matchCat) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // CPU Brand filter (AMD vs Intel)
        if (filters.cpuTypes.length > 0) {
          const cpuUpper = p.specs.cpu.toUpperCase();
          const matchesAnyCpu = filters.cpuTypes.some((type) =>
            cpuUpper.includes(type.toUpperCase())
          );
          if (!matchesAnyCpu) return false;
        }

        // RAM Min
        if (filters.ramMin > 0 && p.specs.ram < filters.ramMin) {
          return false;
        }

        // Price max
        if (p.price > filters.priceMax) {
          return false;
        }

        // In Stock only
        if (filters.inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'performance') {
          const scoreA = a.benchmarks.cinebenchR23 || 0;
          const scoreB = b.benchmarks.cinebenchR23 || 0;
          return scoreB - scoreA;
        }
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first, then in_stock
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.stock - a.stock;
      });
  }, [products, filters]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Campaign Section */}
      <Hero />

      {/* 2. Main Hardware Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">
            System Inventory
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            High-Performance Pre-Built & Custom Configurations
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            All desktops undergo 48 hours of uninterrupted thermal soak testing with individually verified benchmark logs.
          </p>
        </div>

        {/* Filter Controls Component */}
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          totalCount={products.length}
          filteredCount={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
            <h3 className="text-sm font-semibold text-white">No configurations match your filters</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting your RAM requirement, price ceiling, or processor architecture filter.
            </p>
            <button
              onClick={() =>
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
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Engineering & Craftsmanship Standards (Adjacent Proof §1.H) */}
      <section className="border-t border-b border-neutral-800/80 bg-neutral-950/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Cleanroom Precision Assembly</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Individually routed braided cabling, custom GPU anti-sag brackets, and EKWB acrylic liquid tubing crafted by certified master technicians.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">48-Hour Thermal Stress QA</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No system leaves our Austin lab without passing simultaneous Prime95 AVX2 CPU testing and FurMark 4K GPU thermal stabilization loops.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3-Year On-Site SLA Support</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct technician on-site hardware dispatch, zero telephone hold times, and lifetime North American support for all original buyers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
