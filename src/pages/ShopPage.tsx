import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, Sparkles, Check, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [categoryParam, initialSearch]);

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    const newParams = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catSlug);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSort('featured');
    setInStockOnly(false);
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesShort = product.shortDescription.toLowerCase().includes(query);
        const matchesCategory = product.categoryLabel.toLowerCase().includes(query);
        const matchesColor = product.colors.some((c) => c.name.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesShort && !matchesCategory && !matchesColor) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, inStockOnly, searchQuery, selectedSort]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F6F0E7] bg-crochet-pattern py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#6E3947] bg-[#F0C9CB]/40 px-3 py-1 rounded-full border border-[#D99AA3]/30">
            Artisanal Boutique Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#321923] font-semibold tracking-tight mt-2">
            The Crochet Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B54] mt-2">
            Each creation is sculpted stitch by stitch using premium cotton and wool yarns. Never mass-produced, always crafted with love.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-[#E6D7CD] shadow-xs mb-8 flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78816A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flower type, plushie, color or name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] text-xs sm:text-sm text-[#392923] placeholder:text-[#8E987E] focus:outline-none focus:ring-2 focus:ring-[#6E3947]/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E987E] hover:text-[#321923]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Category Pills for Desktop / Tablet */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#6E3947] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#392923] hover:bg-[#F0C9CB]/30 border border-[#E6D7CD]'
              }`}
            >
              All Creations
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#6E3947] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#392923] hover:bg-[#F0C9CB]/30 border border-[#E6D7CD]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:flex-initial">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="w-full md:w-auto appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] text-xs font-medium text-[#392923] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#78816A] pointer-events-none" />
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E6D7CD] text-xs font-medium text-[#392923] hover:bg-[#F0C9CB]/30 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E3947]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6E3947] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#8E987E]">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs text-[#6E3947] border border-[#D99AA3]/40 shadow-2xs">
                <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                <button onClick={() => handleCategoryChange('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs text-[#6E3947] border border-[#D99AA3]/40 shadow-2xs">
                <span>Ready to Ship Only</span>
                <button onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs text-[#6E3947] border border-[#D99AA3]/40 shadow-2xs">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#6E3947] hover:underline font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#6B5B54] mb-5">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'creation' : 'creations'}
          </span>
          <span className="text-[11px] font-mono text-[#78816A]">
            Catalog items are customizable
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E6D7CD] text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/30 text-[#6E3947] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8 text-[#D99AA3]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#321923] mb-1">
              No matching creations found
            </h3>
            <p className="text-xs text-[#6B5B54] mb-6">
              Try adjusting your search terms or clearing current category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-full bg-[#6E3947] text-white text-xs font-semibold hover:bg-[#522734] transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Mobile Bottom Sheet / Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-[#321923]/40 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF6F0] p-6 shadow-2xl flex flex-col justify-between border-l border-[#E6D7CD]">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E6D7CD]">
                  <h3 className="font-serif text-lg font-semibold text-[#321923] flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#6E3947]" />
                    <span>Filter Catalog</span>
                  </h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 text-[#6B5B54] hover:text-[#321923]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-semibold text-[#321923] uppercase tracking-wider mb-2.5">
                    Category
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-[#6E3947] text-white'
                          : 'bg-white text-[#392923] hover:bg-[#F0C9CB]/20 border border-[#E6D7CD]'
                      }`}
                    >
                      <span>All Products</span>
                      {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          selectedCategory === cat.slug
                            ? 'bg-[#6E3947] text-white'
                            : 'bg-white text-[#392923] hover:bg-[#F0C9CB]/20 border border-[#E6D7CD]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-xs font-semibold text-[#321923] uppercase tracking-wider mb-2.5">
                    Availability
                  </h4>
                  <label className="flex items-center gap-2.5 text-xs text-[#392923] cursor-pointer bg-white p-3 rounded-xl border border-[#E6D7CD]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-[#6E3947] focus:ring-[#6E3947] w-4 h-4"
                    />
                    <span>Ready-to-Ship / In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E6D7CD] flex items-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 rounded-full border border-[#D99AA3] text-[#6E3947] text-xs font-medium hover:bg-white"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#6E3947] text-white text-xs font-semibold shadow-md hover:bg-[#522734]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
