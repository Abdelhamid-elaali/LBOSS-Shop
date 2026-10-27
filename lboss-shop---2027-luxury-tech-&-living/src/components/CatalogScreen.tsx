import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/mockData';
import { filterProducts, formatCurrency } from '../utils/shopLogic';

export const CatalogScreen: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    viewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    setCurrentScreen,
  } = useShop();

  const [categorySearch, setCategorySearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Apply filters using pure logic module
  const filteredProducts = useMemo(() => {
    const combinedFilters = {
      ...filters,
      searchQuery: categorySearch.trim() ? categorySearch : filters.searchQuery,
    };
    return filterProducts(ALL_PRODUCTS, combinedFilters);
  }, [filters, categorySearch]);

  const handleCategoryToggle = (catId: string) => {
    setFilters((prev) => {
      if (catId === 'all') {
        return { ...prev, selectedCategories: ['all'] };
      }
      let updated = prev.selectedCategories.filter((c) => c !== 'all');
      if (updated.includes(catId)) {
        updated = updated.filter((c) => c !== catId);
      } else {
        updated.push(catId);
      }
      if (updated.length === 0) updated = ['all'];
      return { ...prev, selectedCategories: updated };
    });
  };

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.selectedBrands.includes(brand);
      const updated = exists
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand];
      return { ...prev, selectedBrands: updated };
    });
  };

  const handleRemoveCriteria = (type: 'category' | 'price' | 'rating' | 'vault') => {
    setFilters((prev) => {
      switch (type) {
        case 'category':
          return { ...prev, selectedCategories: ['all'] };
        case 'price':
          return { ...prev, minPrice: 0, maxPrice: 6000 };
        case 'rating':
          return { ...prev, minRating: 0 };
        case 'vault':
          return { ...prev, vaultPrivilegeOnly: false };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Ambient Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#f5b700]/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-80 left-10 w-[420px] h-[420px] bg-[#4816cb]/5 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pb-20 pt-6 flex flex-col gap-8">
          {/* Top Utility Header: Breadcrumb & Title */}
          <div className="flex flex-col gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#d4c5ac] font-['JetBrains_Mono'] text-xs">
              <button
                onClick={() => setCurrentScreen('home')}
                className="hover:text-[#ffd88a] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-[#504532]">/</span>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, selectedCategories: ['all'] }))}
                className="hover:text-[#ffd88a] transition-colors cursor-pointer"
              >
                All Collections
              </button>
              <span className="text-[#504532]">/</span>
              <span className="text-[#ffd88a] font-semibold">2027 Apex Catalog</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#272a32] text-[#ffd88a] font-['JetBrains_Mono'] text-xs tracking-wide border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5b700] animate-pulse"></span>
                    ACTIVE VAULT FEED
                  </span>
                  <span className="text-[#9c8f78] text-xs font-['JetBrains_Mono']">•</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">PROTOCOL V4.2</span>
                </div>
                <h1 className="font-['Sora'] text-3xl md:text-4xl text-[#e0e2ed] tracking-tight font-bold">
                  Apex Catalog{' '}
                  <span className="font-['Sora'] text-2xl text-[#ffd88a] font-normal">
                    ({filteredProducts.length} Items)
                  </span>
                </h1>
                <p className="font-['Manrope'] text-sm text-[#d4c5ac] mt-1 max-w-2xl">
                  Filter by category, technical specifications, hyper-dense materials, and verified executive rating.
                </p>
              </div>

              {/* Status Ticker */}
              <div className="flex items-center gap-4 bg-[#181b24] px-6 py-3 rounded-xl border border-white/5 shadow-sm">
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">CURRENT VAULT STATUS</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                    SECURE • QUANTUM ALLOCATED
                  </span>
                </div>
                <div className="w-px h-8 bg-[#32353d]"></div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffd88a] text-xl">bolt</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed]">
                    Tier 1 Express Dispatch Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: 2-Column (Sidebar + Grid Canvas) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Filter Sidebar */}
            <aside className="lg:col-span-3 flex flex-col gap-6 bg-[#181b24]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl sticky top-24">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffd88a] text-xl">tune</span>
                  <span className="font-['Sora'] text-lg text-[#e0e2ed] font-bold tracking-tight">Filters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac] hover:text-[#ffd88a] transition-colors underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Collections Filter */}
              <div className="flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold uppercase tracking-wider">
                  Collections
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  {[
                    { id: 'all', label: 'All Categories', count: 148 },
                    { id: 'electronics', label: 'Electronics', count: 42 },
                    { id: 'cyber-fashion', label: 'Cyber Fashion', count: 38 },
                    { id: 'precision-living', label: 'Precision Living', count: 26 },
                    { id: 'audio', label: 'Audio & Acoustics', count: 24 },
                    { id: 'vault-exclusives', label: 'Vault Exclusives', count: 18 },
                  ].map((cat) => {
                    const isChecked = filters.selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between group p-1.5 rounded-lg hover:bg-[#1c1f28] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="w-4 h-4 rounded bg-[#272a32] text-[#f5b700] focus:ring-0 accent-[#f5b700] cursor-pointer"
                          />
                          <span
                            className={`font-['Manrope'] text-xs transition-colors ${
                              isChecked ? 'text-[#ffd88a] font-semibold' : 'text-[#d4c5ac] group-hover:text-white'
                            }`}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <span
                          className={`font-['JetBrains_Mono'] text-xs px-2 py-0.5 rounded-full ${
                            isChecked
                              ? 'bg-[#1c1f28] text-[#ffd88a] font-bold border border-[#f5b700]/30'
                              : 'text-[#9c8f78]'
                          }`}
                        >
                          {cat.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-3 bg-[#1c1f28]/60 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold uppercase tracking-wider">
                    Price Range
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a]">USD ($)</span>
                </div>

                <div className="relative w-full py-2">
                  <div className="w-full h-1.5 bg-[#32353d] rounded-full overflow-hidden relative">
                    <div className="absolute left-[15%] right-[25%] h-full bg-gradient-to-r from-[#f5b700] to-[#cabeff]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col bg-[#272a32] px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] uppercase">Min</span>
                    <div className="flex items-center text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-bold">
                      <span>$</span>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) || 0 }))
                        }
                        className="w-full bg-transparent text-[#ffd88a] focus:outline-none ml-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#272a32] px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] uppercase">Max</span>
                    <div className="flex items-center text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-bold">
                      <span>$</span>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) || 0 }))
                        }
                        className="w-full bg-transparent text-[#ffd88a] focus:outline-none ml-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Atelier / Brand */}
              <div className="flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold uppercase tracking-wider">
                  Atelier / Brand
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  {[
                    { name: 'LBOSS LABS', count: 64 },
                    { name: 'AETHER ACOUSTICS', count: 28 },
                    { name: 'MONOLITH CORP', count: 32 },
                    { name: 'CIPHER WEAR', count: 24 },
                  ].map((brand) => {
                    const isChecked = filters.selectedBrands.includes(brand.name);
                    return (
                      <label
                        key={brand.name}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1c1f28] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBrandToggle(brand.name)}
                            className="w-4 h-4 rounded bg-[#272a32] text-[#f5b700] accent-[#f5b700] cursor-pointer"
                          />
                          <span
                            className={`font-['Manrope'] text-xs transition-colors ${
                              isChecked ? 'text-[#ffd88a] font-semibold' : 'text-[#d4c5ac]'
                            }`}
                          >
                            {brand.name}
                          </span>
                        </div>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">{brand.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Executive Rating */}
              <div className="flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold uppercase tracking-wider">
                  Executive Rating
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1c1f28] cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rating-radio"
                        checked={filters.minRating === 5.0}
                        onChange={() => setFilters((prev) => ({ ...prev, minRating: 5.0 }))}
                        className="w-4 h-4 accent-[#f5b700] cursor-pointer"
                      />
                      <div className="flex items-center text-[#ffd88a] text-xs">
                        {'★'.repeat(5)}
                        <span className="ml-1.5 font-['JetBrains_Mono'] text-xs text-[#e0e2ed]">5.0 Apex</span>
                      </div>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">54</span>
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1c1f28] cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rating-radio"
                        checked={filters.minRating === 4.0}
                        onChange={() => setFilters((prev) => ({ ...prev, minRating: 4.0 }))}
                        className="w-4 h-4 accent-[#f5b700] cursor-pointer"
                      />
                      <div className="flex items-center text-[#ffd88a] text-xs">
                        {'★'.repeat(4)}
                        <span className="text-[#9c8f78]">★</span>
                        <span className="ml-1.5 font-['JetBrains_Mono'] text-xs text-[#e0e2ed]">4.0 &amp; Up</span>
                      </div>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">112</span>
                  </label>
                </div>
              </div>

              {/* Availability Status */}
              <div className="flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold uppercase tracking-wider">
                  Availability Status
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  <label className="flex items-center justify-between p-1.5 rounded-lg cursor-pointer">
                    <span className="font-['Manrope'] text-xs text-[#e0e2ed]">In Stock Only</span>
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                      className="w-4 h-4 rounded bg-[#1c1f28] accent-[#f5b700] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-lg cursor-pointer">
                    <span className="font-['Manrope'] text-xs text-[#e0e2ed]">Pre-order 2027</span>
                    <input
                      type="checkbox"
                      checked={filters.preorder2027Only}
                      onChange={(e) => setFilters((prev) => ({ ...prev, preorder2027Only: e.target.checked }))}
                      className="w-4 h-4 rounded bg-[#1c1f28] accent-[#f5b700] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#e6deff]"></span>
                      <span className="font-['Manrope'] text-xs text-[#e6deff]">Vault Privilege Only</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.vaultPrivilegeOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, vaultPrivilegeOnly: e.target.checked }))}
                      className="w-4 h-4 rounded bg-[#1c1f28] accent-[#cabeff] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full py-3 px-4 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-xs font-bold shadow-[0_8px_20px_-6px_rgba(245,183,0,0.5)] hover:bg-[#ffd88a] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Apply Telemetry</span>
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1c1f28] text-[#d4c5ac] font-['JetBrains_Mono'] text-xs hover:text-white hover:bg-[#272a32] transition-colors cursor-pointer border border-white/5"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Right Main Content: Controls & Product Grid */}
            <main className="lg:col-span-9 flex flex-col gap-6">
              {/* Control Bar */}
              <div className="flex flex-col gap-4 bg-[#181b24] p-4 rounded-2xl border border-white/5 shadow-md">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Category Search input */}
                  <div className="relative flex-1 max-w-lg flex items-center bg-[#1c1f28] rounded-xl px-4 py-2.5 border border-white/5 focus-within:ring-2 focus-within:ring-[#cabeff]">
                    <span className="material-symbols-outlined text-[#9c8f78] mr-2 text-xl select-none">
                      search
                    </span>
                    <input
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full bg-transparent font-['Manrope'] text-xs text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none"
                      placeholder="Search within electronics, model codes, materials..."
                      type="text"
                    />
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] bg-[#272a32] px-2 py-0.5 rounded">
                      Filter
                    </span>
                  </div>

                  {/* View Toggles & Sort Menu */}
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 bg-[#1c1f28] px-3 py-2 rounded-xl border border-white/5">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] hidden sm:inline">SORT BY:</span>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value as any,
                          }))
                        }
                        className="bg-transparent text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="featured" className="bg-[#272a32] text-white">
                          Featured Apex
                        </option>
                        <option value="price-desc" className="bg-[#272a32] text-white">
                          Price: High to Low
                        </option>
                        <option value="price-asc" className="bg-[#272a32] text-white">
                          Price: Low to High
                        </option>
                        <option value="top-rated" className="bg-[#272a32] text-white">
                          Top Rated
                        </option>
                        <option value="newest" className="bg-[#272a32] text-white">
                          Newest 2027
                        </option>
                      </select>
                    </div>

                    {/* View Switchers */}
                    <div className="flex items-center bg-[#1c1f28] p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'grid-4' }))}
                        aria-label="4-Column Grid View"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          filters.viewMode === 'grid-4'
                            ? 'bg-[#f5b700] text-[#402d00] shadow-sm font-bold'
                            : 'text-[#d4c5ac] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
                      </button>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'grid-2' }))}
                        aria-label="2-Column Wide View"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          filters.viewMode === 'grid-2'
                            ? 'bg-[#f5b700] text-[#402d00] shadow-sm font-bold'
                            : 'text-[#d4c5ac] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg leading-none">view_agenda</span>
                      </button>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'list' }))}
                        aria-label="List View"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          filters.viewMode === 'list'
                            ? 'bg-[#f5b700] text-[#402d00] shadow-sm font-bold'
                            : 'text-[#d4c5ac] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg leading-none">view_headline</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Criteria Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase mr-1">
                    Active Criteria:
                  </span>

                  {filters.selectedCategories.length > 0 && !filters.selectedCategories.includes('all') && (
                    <button
                      onClick={() => handleRemoveCriteria('category')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1f28] font-['JetBrains_Mono'] text-xs text-[#e0e2ed] border border-white/5 hover:border-[#f5b700]/40 transition-colors cursor-pointer group"
                    >
                      <span className="text-[#ffd88a] font-semibold capitalize">
                        {filters.selectedCategories.join(', ')}
                      </span>
                      <span className="material-symbols-outlined text-xs text-[#9c8f78] group-hover:text-[#ffd88a]">
                        close
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveCriteria('price')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1f28] font-['JetBrains_Mono'] text-xs text-[#e0e2ed] border border-white/5 hover:border-[#f5b700]/40 transition-colors cursor-pointer group"
                  >
                    <span className="text-[#d4c5ac]">
                      ${filters.minPrice} – ${filters.maxPrice}
                    </span>
                    <span className="material-symbols-outlined text-xs text-[#9c8f78] group-hover:text-[#ffd88a]">
                      close
                    </span>
                  </button>

                  {filters.minRating > 0 && (
                    <button
                      onClick={() => handleRemoveCriteria('rating')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1f28] font-['JetBrains_Mono'] text-xs text-[#e0e2ed] border border-white/5 hover:border-[#f5b700]/40 transition-colors cursor-pointer group"
                    >
                      <span className="text-[#ffd88a]">{filters.minRating}.0★ &amp; Above</span>
                      <span className="material-symbols-outlined text-xs text-[#9c8f78] group-hover:text-[#ffd88a]">
                        close
                      </span>
                    </button>
                  )}

                  {filters.vaultPrivilegeOnly && (
                    <button
                      onClick={() => handleRemoveCriteria('vault')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4816cb]/30 font-['JetBrains_Mono'] text-xs text-[#e6deff] border border-[#cabeff]/20 hover:border-[#cabeff] transition-colors cursor-pointer group"
                    >
                      <span>Vault Exclusives</span>
                      <span className="material-symbols-outlined text-xs text-[#cabeff] group-hover:text-white">
                        close
                      </span>
                    </button>
                  )}

                  <button
                    onClick={resetFilters}
                    className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] hover:text-[#ffd88a] ml-auto transition-colors underline cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              {/* Products Display (Grid or List based on viewMode) */}
              {filteredProducts.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#181b24] text-center flex flex-col items-center justify-center gap-3 border border-white/5">
                  <span className="material-symbols-outlined text-4xl text-[#9c8f78]">search_off</span>
                  <h3 className="font-['Sora'] text-xl font-bold text-[#e0e2ed]">
                    No hardware found for active telemetry
                  </h3>
                  <p className="font-['Manrope'] text-sm text-[#9c8f78]">
                    Try loosening price brackets or resetting domain categories.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    filters.viewMode === 'grid-4'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
                      : filters.viewMode === 'grid-2'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className={`group relative flex bg-[#181b24] rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-white/5 ${
                        filters.viewMode === 'list'
                          ? 'flex-col sm:flex-row items-center p-4 gap-6'
                          : 'flex-col'
                      }`}
                    >
                      {/* Image Chamber */}
                      <div
                        onClick={() => viewProduct(prod.id)}
                        className={`relative bg-[#0b0e16] overflow-hidden flex items-center justify-center p-4 cursor-pointer ${
                          filters.viewMode === 'list'
                            ? 'w-full sm:w-48 h-48 shrink-0 rounded-xl'
                            : 'w-full aspect-square'
                        }`}
                      >
                        <img
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          alt={prod.name}
                          src={prod.image}
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {prod.badge && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-bold ${
                                prod.badgeClass || 'bg-white/10 text-white'
                              }`}
                            >
                              {prod.badge}
                            </span>
                          )}
                          {prod.discountPercent && (
                            <span className="px-2 py-0.5 rounded bg-[#0b0e16]/80 backdrop-blur-md text-[#ffd88a] font-['JetBrains_Mono'] text-[10px] font-bold">
                              -{prod.discountPercent}%
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod.id);
                          }}
                          aria-label="Add to wishlist"
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#181b24]/80 backdrop-blur-md flex items-center justify-center text-[#d4c5ac] hover:text-[#ffb4ab] hover:scale-110 transition-all shadow-sm cursor-pointer border border-white/10"
                        >
                          <span
                            className="material-symbols-outlined text-lg"
                            style={{
                              fontVariationSettings: wishlist.includes(prod.id) ? "'FILL' 1" : "'FILL' 0",
                              color: wishlist.includes(prod.id) ? '#ffb4ab' : undefined,
                            }}
                          >
                            favorite
                          </span>
                        </button>
                      </div>

                      {/* Content Chassis */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3 w-full">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase tracking-wider font-semibold">
                              {prod.atelier}
                            </span>
                            <span className="font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded-full bg-[#1c1f28] text-emerald-400 font-medium">
                              In Stock
                            </span>
                          </div>

                          <h3
                            onClick={() => viewProduct(prod.id)}
                            className="font-['Sora'] text-base text-[#e0e2ed] font-bold leading-snug group-hover:text-[#ffd88a] transition-colors line-clamp-1 cursor-pointer"
                          >
                            {prod.name}
                          </h3>

                          {filters.viewMode === 'list' && (
                            <p className="font-['Manrope'] text-xs text-[#d4c5ac] line-clamp-2 mt-1">
                              {prod.description}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex text-[#ffd88a] text-xs">
                              {'★'.repeat(Math.floor(prod.rating))}
                            </div>
                            <span className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac] font-semibold">
                              {prod.rating.toFixed(1)}
                            </span>
                            <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                              ({prod.reviewCount})
                            </span>
                          </div>
                        </div>

                        {/* Price Block & Action Button */}
                        <div className="pt-2 flex flex-col gap-2">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="font-['JetBrains_Mono'] text-lg text-[#ffd88a] font-bold">
                                {formatCurrency(prod.price, false)}
                              </span>
                              {prod.originalPrice && (
                                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through">
                                  {formatCurrency(prod.originalPrice, false)}
                                </span>
                              )}
                            </div>
                            <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">
                              Tier 1 Freight
                            </span>
                          </div>

                          <button
                            onClick={() => addToCart(prod)}
                            className="w-full py-2.5 px-3 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-xs font-bold shadow-[0_4px_16px_-4px_rgba(245,183,0,0.4)] hover:bg-[#ffd88a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">shopping_bag</span>
                            <span>Acquire Hardware</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination & Catalog Counter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 bg-[#181b24]/60 p-4 rounded-2xl border border-white/5 shadow-sm mt-4">
                <div className="font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">
                  Showing <span className="font-bold text-[#ffd88a]">1–{filteredProducts.length}</span> of{' '}
                  <span className="font-bold text-[#e0e2ed]">148</span> items cataloged
                </div>

                <div className="flex items-center gap-1.5 font-['JetBrains_Mono']">
                  <button
                    onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                    aria-label="Previous Page"
                    className="px-3 py-2 rounded-xl bg-[#1c1f28] text-[#d4c5ac] hover:text-white hover:bg-[#272a32] transition-colors flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <button
                    onClick={() => setActivePage(1)}
                    className={`w-9 h-9 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      activePage === 1
                        ? 'bg-[#f5b700] text-[#402d00] shadow-sm'
                        : 'bg-[#1c1f28] text-[#d4c5ac] hover:bg-[#272a32]'
                    }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setActivePage(2)}
                    className={`w-9 h-9 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      activePage === 2
                        ? 'bg-[#f5b700] text-[#402d00] shadow-sm'
                        : 'bg-[#1c1f28] text-[#d4c5ac] hover:bg-[#272a32]'
                    }`}
                  >
                    2
                  </button>
                  <button
                    onClick={() => setActivePage(3)}
                    className={`w-9 h-9 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      activePage === 3
                        ? 'bg-[#f5b700] text-[#402d00] shadow-sm'
                        : 'bg-[#1c1f28] text-[#d4c5ac] hover:bg-[#272a32]'
                    }`}
                  >
                    3
                  </button>

                  <span className="px-1 text-[#9c8f78] text-xs select-none">...</span>

                  <button
                    onClick={() => setActivePage(12)}
                    className="w-9 h-9 rounded-xl bg-[#1c1f28] text-[#d4c5ac] hover:text-white hover:bg-[#272a32] font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer"
                  >
                    12
                  </button>

                  <button
                    onClick={() => setActivePage((p) => Math.min(12, p + 1))}
                    aria-label="Next Page"
                    className="px-3 py-2 rounded-xl bg-[#1c1f28] text-[#d4c5ac] hover:text-white hover:bg-[#272a32] transition-colors flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                  <span>Items / Page:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#1c1f28] text-[#ffd88a] font-bold border border-white/5">
                    8
                  </span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
