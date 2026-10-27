import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
} from 'lucide-react';
import {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} from '../features/api/apiSlice';
import { ProductCard } from '../components/common/ProductCard';
import { ProductSkeleton } from '../components/common/ProductSkeleton';
import { Button } from '../components/ui/Button';
import type { Product, SortOption } from '../types';

const ITEMS_PER_PAGE = 12;

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'default';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const minRatingParam = searchParams.get('rating') || '';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParam);

  useEffect(() => {
    document.title = categoryParam
      ? `${categoryParam.replace(/-/g, ' ').toUpperCase()} — LBOSS 2027`
      : searchParam
      ? `Search: "${searchParam}" — LBOSS 2027`
      : '2027 Apex Catalog — LBOSS SHOP';
  }, [categoryParam, searchParam]);

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  const getSortParams = (sort: SortOption) => {
    switch (sort) {
      case 'price-asc':
        return { sortBy: 'price', order: 'asc' as const };
      case 'price-desc':
        return { sortBy: 'price', order: 'desc' as const };
      case 'rating-desc':
        return { sortBy: 'rating', order: 'desc' as const };
      case 'title-asc':
        return { sortBy: 'title', order: 'asc' as const };
      default:
        return {};
    }
  };

  const sortParams = getSortParams(sortParam);
  const { data: categories = [] } = useGetCategoriesQuery();

  const isSearching = Boolean(searchParam);
  const isCategoryFilter = Boolean(categoryParam) && !isSearching;

  const searchQuery = useSearchProductsQuery(
    {
      q: searchParam,
      limit: 100,
      skip: 0,
      ...sortParams,
    },
    { skip: !isSearching }
  );

  const categoryQuery = useGetProductsByCategoryQuery(
    {
      category: categoryParam,
      limit: 100,
      skip: 0,
      ...sortParams,
    },
    { skip: !isCategoryFilter }
  );

  const genericQuery = useGetProductsQuery(
    {
      limit: 100,
      skip: 0,
      ...sortParams,
    },
    { skip: isSearching || isCategoryFilter }
  );

  const activeQuery = isSearching
    ? searchQuery
    : isCategoryFilter
    ? categoryQuery
    : genericQuery;

  const { data: responseData, isLoading, isFetching } = activeQuery;

  // Filter products client-side
  const filteredProducts = useMemo(() => {
    if (!responseData?.products) return [];
    let list: Product[] = [...responseData.products];

    if (minPriceParam) {
      const min = parseFloat(minPriceParam);
      if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (maxPriceParam) {
      const max = parseFloat(maxPriceParam);
      if (!isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (minRatingParam) {
      const r = parseFloat(minRatingParam);
      if (!isNaN(r)) list = list.filter((p) => p.rating >= r);
    }
    if (inStockParam) {
      list = list.filter((p) => p.stock > 0);
    }

    if (sortParam === 'discount-desc') {
      list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return list;
  }, [responseData, minPriceParam, maxPriceParam, minRatingParam, inStockParam, sortParam]);

  const totalFiltered = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const currentPage = Math.min(pageParam, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    if (!('page' in updates)) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: localSearch.trim() || null });
  };

  const resetAllFilters = () => {
    setSearchParams({});
    setLocalSearch('');
  };

  const hasActiveFilters = Boolean(
    categoryParam ||
      searchParam ||
      minPriceParam ||
      maxPriceParam ||
      minRatingParam ||
      inStockParam ||
      sortParam !== 'default'
  );

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8 lg:py-12 flex flex-col gap-8">
      {/* Top Utility Header: Breadcrumb & Title */}
      <div className="flex flex-col gap-3 pb-6 border-b border-white/5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#d4c5ac] font-['JetBrains_Mono'] text-xs">
          <Link to="/" className="hover:text-[#ffd88a] transition-colors">
            Home
          </Link>
          <span className="text-[#504532]">/</span>
          <button
            onClick={() => updateParams({ category: null })}
            className="hover:text-[#ffd88a] transition-colors cursor-pointer"
          >
            All Collections
          </button>
          <span className="text-[#504532]">/</span>
          <span className="text-[#ffd88a] font-semibold">2027 Apex Catalog</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-['Sora'] font-black text-2xl sm:text-4xl text-[#e0e2ed] capitalize">
              {categoryParam
                ? categoryParam.replace(/-/g, ' ')
                : searchParam
                ? `Results for "${searchParam}"`
                : '2027 Apex Catalog'}
            </h1>
            <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-1">
              INDEXED {paginatedProducts.length} OF {totalFiltered} BESPOKE ASSETS
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-['JetBrains_Mono'] font-semibold bg-[#1c1f28] text-[#e0e2ed]"
            >
              <Filter className="w-4 h-4 text-[#f5b700]" />
              <span>Telemetry Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#f5b700]" />
              )}
            </button>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#9c8f78] hidden sm:block" />
              <select
                value={sortParam}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="h-11 px-3 pr-8 rounded-xl text-xs font-['JetBrains_Mono'] bg-[#1c1f28] border border-white/10 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
              >
                <option value="default">Sort: Keynote Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Patron Verified Rating</option>
                <option value="discount-desc">Highest VIP Privilege</option>
                <option value="title-asc">Designation: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">Active Criteria:</span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 capitalize">
              Department: {categoryParam.replace(/-/g, ' ')}
              <button onClick={() => updateParams({ category: null })}>
                <X className="w-3 h-3 text-[#ffd88a]" />
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30">
              Query: "{searchParam}"
              <button onClick={() => updateParams({ q: null })}>
                <X className="w-3 h-3 text-[#ffd88a]" />
              </button>
            </span>
          )}
          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#1c1f28] text-[#d4c5ac] border border-white/5">
              Price: ${minPriceParam || '0'} - ${maxPriceParam || 'Max'}
              <button onClick={() => updateParams({ minPrice: null, maxPrice: null })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {minRatingParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#1c1f28] text-[#d4c5ac] border border-white/5">
              {minRatingParam}+ Stars
              <button onClick={() => updateParams({ rating: null })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#1c1f28] text-[#d4c5ac] border border-white/5">
              Available Only
              <button onClick={() => updateParams({ inStock: null })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="font-['JetBrains_Mono'] text-xs text-[#ffb4ab] hover:underline flex items-center gap-1 ml-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 rounded-2xl bg-[#14171f] border border-white/5 p-6 space-y-6 sticky top-28 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="font-['Sora'] font-bold text-sm text-[#e0e2ed] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#f5b700]" />
              <span>Telemetry Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search within page */}
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#9c8f78] mb-2 uppercase tracking-wider">
              Asset Designation
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full h-10 pl-8 pr-3 rounded-xl font-['Manrope'] text-xs bg-[#1c1f28] border border-white/10 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9c8f78]" />
            </form>
          </div>

          {/* Categories */}
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#9c8f78] mb-2 uppercase tracking-wider">
              Department
            </label>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 font-['Manrope'] text-xs">
              <button
                onClick={() => updateParams({ category: null })}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  !categoryParam
                    ? 'bg-[#f5b700]/15 text-[#ffd88a] font-bold border border-[#f5b700]/30'
                    : 'text-[#d4c5ac] hover:bg-[#1c1f28]'
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => updateParams({ category: cat.slug })}
                  className={`w-full text-left px-3 py-2 rounded-xl capitalize transition-colors cursor-pointer ${
                    categoryParam === cat.slug
                      ? 'bg-[#f5b700]/15 text-[#ffd88a] font-bold border border-[#f5b700]/30'
                      : 'text-[#d4c5ac] hover:bg-[#1c1f28]'
                  }`}
                >
                  {cat.name || cat.slug.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#9c8f78] mb-2 uppercase tracking-wider">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPriceParam}
                onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
                className="h-10 px-3 rounded-xl font-['JetBrains_Mono'] text-xs bg-[#1c1f28] border border-white/10 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPriceParam}
                onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
                className="h-10 px-3 rounded-xl font-['JetBrains_Mono'] text-xs bg-[#1c1f28] border border-white/10 text-[#e0e2ed] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#9c8f78] mb-2 uppercase tracking-wider">
              Minimum Verification
            </label>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() =>
                    updateParams({
                      rating: minRatingParam === stars.toString() ? null : stars.toString(),
                    })
                  }
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    minRatingParam === stars.toString()
                      ? 'bg-[#f5b700]/15 text-[#ffd88a] font-bold border border-[#f5b700]/30'
                      : 'text-[#d4c5ac] hover:bg-[#1c1f28]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#f5b700]">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="font-['JetBrains_Mono'] text-[#e0e2ed] ml-1">
                      &amp; up
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-2 border-t border-white/5">
            <label className="flex items-center gap-2.5 font-['JetBrains_Mono'] text-xs text-[#d4c5ac] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) =>
                  updateParams({ inStock: e.target.checked ? 'true' : null })
                }
                className="w-4 h-4 rounded text-[#f5b700] focus:ring-[#f5b700]"
              />
              <span>Immediate Dispatch Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-[#14171f] p-16 text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#1c1f28] text-[#ffd88a] flex items-center justify-center mb-4 border border-white/5">
                <Search className="w-8 h-8 text-[#f5b700]" />
              </div>
              <h3 className="font-['Sora'] font-bold text-lg text-[#e0e2ed] mb-1">
                Zero Assets Matched Criteria
              </h3>
              <p className="font-['Manrope'] text-xs text-[#9c8f78] max-w-sm mb-6 leading-relaxed">
                Adjust criteria parameters or reset telemetry filters to access the full 2027 collection.
              </p>
              <Button onClick={resetAllFilters} variant="primary" size="md">
                Reset Criteria Telemetry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: (currentPage - 1).toString() })}
                className="gap-1 font-['JetBrains_Mono']"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </Button>

              <div className="flex items-center gap-1.5 px-2 font-['JetBrains_Mono']">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pNum = currentPage - 3 + i;
                    if (pNum > totalPages) pNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateParams({ page: pNum.toString() })}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-[#f5b700] text-[#0b0e16] shadow-[0_4px_16px_rgba(245,183,0,0.3)]'
                          : 'bg-[#1c1f28] text-[#d4c5ac] border border-white/5 hover:border-[#ffd88a]/40'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateParams({ page: (currentPage + 1).toString() })}
                className="gap-1 font-['JetBrains_Mono']"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md lg:hidden">
          <div className="w-full max-w-xs bg-[#10131b] h-full p-6 flex flex-col justify-between overflow-y-auto border-l border-white/10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h3 className="font-['Sora'] font-bold text-base text-[#e0e2ed]">
                  Telemetry Filter
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#9c8f78] hover:text-[#e0e2ed]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block font-['JetBrains_Mono'] text-xs font-bold uppercase text-[#9c8f78] mb-2">
                  Department
                </label>
                <select
                  value={categoryParam}
                  onChange={(e) => {
                    updateParams({ category: e.target.value || null });
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full h-11 px-3 rounded-xl font-['Manrope'] text-xs bg-[#1c1f28] text-[#e0e2ed] border border-white/10 capitalize"
                >
                  <option value="">All Departments</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-['JetBrains_Mono'] text-xs font-bold uppercase text-[#9c8f78] mb-2">
                  Price ($)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={minPriceParam}
                    onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
                    className="h-10 px-3 rounded-xl font-['JetBrains_Mono'] text-xs bg-[#1c1f28] text-[#e0e2ed] border border-white/10"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={maxPriceParam}
                    onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
                    className="h-10 px-3 rounded-xl font-['JetBrains_Mono'] text-xs bg-[#1c1f28] text-[#e0e2ed] border border-white/10"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#d4c5ac] mb-6">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) =>
                    updateParams({ inStock: e.target.checked ? 'true' : null })
                  }
                />
                <span>Immediate Dispatch Only</span>
              </label>
            </div>

            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              variant="primary"
              size="md"
              className="w-full"
            >
              Apply Filter Telemetry ({totalFiltered})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
