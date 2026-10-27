import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  PackageCheck,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  Flame,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCartCount, selectCartTotal, toggleCartDrawer } from '../../features/cart/cartSlice';
import { selectWishlistCount } from '../../features/wishlist/wishlistSlice';
import {
  selectTheme,
  toggleTheme,
  toggleMobileNav,
  selectCurrency,
  setCurrencySelectorOpen,
} from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import {
  useGetCategoriesQuery,
  useSearchProductsQuery,
} from '../../features/api/apiSlice';
import { formatPrice } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const theme = useAppSelector(selectTheme);
  const currency = useAppSelector(selectCurrency);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDeptMenuOpen, setIsDeptMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        deptMenuRef.current &&
        !deptMenuRef.current.contains(e.target as Node)
      ) {
        setIsDeptMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch categories from API
  const { data: categories = [] } = useGetCategoriesQuery();

  // Search live suggestions
  const { data: searchResults, isFetching: isSearching } = useSearchProductsQuery(
    { q: debouncedQuery, limit: 6 },
    { skip: debouncedQuery.length < 2 }
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const curatedDepartments = [
    { slug: 'smartphones', name: 'Smartphones & Flagships', desc: 'Neural processors, titanium optics' },
    { slug: 'laptops', name: 'Computing & CyberDecks', desc: 'Ultra-dense silicon workstations' },
    { slug: 'mens-watches', name: 'Cyber Horology', desc: 'Titanium chassis, sapphire crystals' },
    { slug: 'fragrances', name: 'Bespoke Scents', desc: 'Molecular extraction luxury perfumes' },
    { slug: 'sunglasses', name: 'Neural Optics', desc: 'Polarized HUDs and carbon frames' },
    { slug: 'furniture', name: 'Executive Living', desc: 'Ergonomic architectural aesthetics' },
  ];

  const quickTrending = [
    'Titanium Watch',
    'CyberDeck 16',
    'Neural Smartphone',
    'Bespoke Fragrance',
    'Neural Optics',
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-glass)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[0_1px_12px_rgba(0,0,0,0.25)] transition-colors duration-200">
      {/* 2027 Top micro telemetry banner */}
      <div className="bg-[var(--bg-inset)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] text-[11px] font-['JetBrains_Mono'] py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f5b700] animate-pulse" />
        <span>
          <strong className="text-[#ffd88a]">2027 EXECUTIVE DROP</strong> • CODE <strong className="text-[#ffd88a]">BOSS10</strong> FOR 10% VAULT PRIVILEGE • ZERO-LATENCY COURIER DISPATCH
        </span>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex items-center justify-between h-[72px] gap-4 lg:gap-8">
          
          {/* LEFT: Brand Logo & Navigation Controls */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => dispatch(toggleMobileNav())}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center group cursor-pointer select-none">
              <img
                src="/LBOSS-SHOP-logo-transparent-600.png"
                alt="LBOSS SHOP"
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Departments Dropdown (Clean, Opaque, 90-degree WordPress Style) */}
            <div className="relative hidden md:block" ref={deptMenuRef}>
              <button
                type="button"
                onClick={() => setIsDeptMenuOpen(!isDeptMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-none font-['Manrope'] text-xs font-semibold border transition-all cursor-pointer ${
                  isDeptMenuOpen
                    ? 'bg-[#f5b700]/15 text-[#ffd88a] border-[#f5b700]/50'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[#f5b700]/30 hover:text-[#ffd88a]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#f5b700]" />
                <span>Departments</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 ${isDeptMenuOpen ? 'rotate-180 text-[#ffd88a]' : ''}`} />
              </button>

              {/* Departments Mega Flyout */}
              {isDeptMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#181b24] dark:bg-[#181b24] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 border border-white/15 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wider text-[#ffd88a]">
                      Curated Sectors
                    </span>
                    <Link
                      to="/products"
                      onClick={() => setIsDeptMenuOpen(false)}
                      className="font-['JetBrains_Mono'] text-[10px] text-[var(--text-secondary)] hover:text-[#ffd88a] transition-colors"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="py-2 space-y-1">
                    {curatedDepartments.map((dept) => (
                      <Link
                        key={dept.slug}
                        to={`/products?category=${dept.slug}`}
                        onClick={() => setIsDeptMenuOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-none hover:bg-[#272a32] border border-transparent hover:border-white/10 transition-all group"
                      >
                        <span className="font-['Sora'] text-xs font-bold text-[#e0e2ed] group-hover:text-[#ffd88a] transition-colors">
                          {dept.name}
                        </span>
                        <span className="font-['Manrope'] text-[11px] text-[#9c8f78]">
                          {dept.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <Link
                      to="/products"
                      onClick={() => setIsDeptMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-none bg-gradient-to-r from-[#ffd88a]/10 to-[#f5b700]/20 hover:from-[#ffd88a]/20 hover:to-[#f5b700]/30 text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-bold border border-[#f5b700]/30 transition-all"
                    >
                      <span>Explore 2027 Full Archive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Links */}
            <div className="hidden xl:flex items-center gap-4">
              <Link
                to="/products"
                className="font-['Manrope'] text-xs font-medium text-[var(--text-secondary)] hover:text-[#ffd88a] transition-colors"
              >
                Catalog
              </Link>
              <Link
                to="/products?sort=discount"
                className="flex items-center gap-1 font-['Manrope'] text-xs font-medium text-[#ffd88a] hover:underline"
              >
                <Flame className="w-3.5 h-3.5 text-[#f5b700]" />
                <span>Vault Deals</span>
              </Link>
            </div>
          </div>

          {/* CENTER: Spacious Search Bar (No shortcut K, clean uncluttered header) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-2 xl:mx-6 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full bg-[var(--bg-surface-elevated)] rounded-none px-3.5 py-2 border border-[var(--border-subtle)] focus-within:border-[#f5b700]/60 focus-within:ring-2 focus-within:ring-[#f5b700]/20 transition-all">
              <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2.5 shrink-0" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search luxury tech, flagship devices, cyber horology..."
                className="w-full bg-transparent font-['Manrope'] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Dropdown with Quick Trending Tags & Live Results */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#181b24] dark:bg-[#181b24] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 overflow-hidden z-50 animate-in fade-in duration-150">
                {/* Trending quick tags inside dropdown instead of cluttering header */}
                <div className="p-3 bg-[var(--bg-inset)]/40 border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[var(--text-secondary)] mb-2">
                    <TrendingUp className="w-3 h-3 text-[#f5b700]" />
                    <span>Popular Telemetry:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTrending.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleTrendingClick(term)}
                        className="px-2.5 py-1 rounded-none bg-[var(--bg-surface)] hover:bg-[#f5b700]/15 hover:text-[#ffd88a] text-[var(--text-secondary)] font-['JetBrains_Mono'] text-[11px] border border-white/10 hover:border-[#f5b700]/40 transition-all cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Autocomplete Results */}
                {debouncedQuery.length >= 2 ? (
                  <div>
                    <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[var(--text-secondary)]">
                      <span>
                        {isSearching ? 'Accessing Quantum Terminal...' : `Results for "${debouncedQuery}"`}
                      </span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-[#ffd88a] hover:underline font-bold"
                      >
                        View All Results →
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                      {searchResults?.products && searchResults.products.length > 0 ? (
                        searchResults.products.map((item) => (
                          <Link
                            key={item.id}
                            to={`/products/${item.id}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-[var(--bg-surface)] transition-colors"
                          >
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-contain bg-[var(--bg-inset)] p-1 shrink-0 border border-[var(--border-subtle)]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-['Sora'] text-xs font-bold text-[var(--text-primary)] truncate">
                                {item.title}
                              </p>
                              <p className="font-['JetBrains_Mono'] text-[10px] text-[var(--text-secondary)] uppercase">
                                {item.category?.replace(/-/g, ' ')}
                              </p>
                            </div>
                            <span className="font-['JetBrains_Mono'] text-xs font-extrabold text-[#ffd88a]">
                              {formatPrice(item.price, currency.code, currency.rate)}
                            </span>
                          </Link>
                        ))
                      ) : !isSearching ? (
                        <div className="p-6 text-center text-xs font-['JetBrains_Mono'] text-[var(--text-secondary)]">
                          No assets found matching "{debouncedQuery}"
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* RIGHT: Currency & Location, Theme, Wishlist, Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Functional Country & Currency Location Selector Button */}
            <button
              type="button"
              onClick={() => dispatch(setCurrencySelectorOpen(true))}
              className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] px-2.5 py-1.5 rounded-none border border-[var(--border-subtle)] hover:border-[#f5b700]/50 hover:bg-[var(--bg-surface)] transition-all cursor-pointer shadow-sm group"
              title={`Active Currency: ${currency.flag} ${currency.country} (${currency.code}). Click to change location.`}
            >
              <span className="text-sm leading-none">{currency.flag}</span>
              <span className="font-bold text-[#ffd88a]">{currency.code}</span>
              <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[#ffd88a]">
                ({currency.symbol})
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[#ffd88a] transition-colors" />
            </button>

            {/* Functional Dark/Light Theme Toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={theme === 'dark' ? 'Switch to Light Titanium Mode' : 'Switch to Dark Obsidian Mode'}
              className="p-2 rounded-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-all cursor-pointer"
              title={theme === 'dark' ? 'OLED Dark Active. Click for Titanium Light Mode.' : 'Titanium Light Active. Click for OLED Dark Mode.'}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#ffd88a]" />
              ) : (
                <Sun className="w-4 h-4 text-[#f5b700]" />
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-all cursor-pointer"
              title="View Vault Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-none bg-[#4816cb] font-['JetBrains_Mono'] text-[10px] text-[#e6deff] leading-none font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Interactive Cart Button */}
            <button
              type="button"
              onClick={() => dispatch(toggleCartDrawer())}
              aria-label="Interactive Cart"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-none transition-all cursor-pointer border bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[#f5b700]/50 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#f5b700]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold hidden sm:inline">
                {formatPrice(cartTotal, currency.code, currency.rate)}
              </span>
              <span className="flex items-center justify-center h-5 w-5 rounded-none bg-[#f5b700] font-['JetBrains_Mono'] text-xs text-[#402d00] font-black shadow-[0_0_12px_rgba(245,183,0,0.5)]">
                {cartCount}
              </span>
            </button>

            {/* VIP Executive Avatar / Login */}
            <div className="relative pl-1 sm:pl-2 border-l border-[var(--border-subtle)]" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-none hover:bg-[var(--bg-surface-elevated)] border border-transparent hover:border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={user.image || 'https://dummyjson.com/icon/emilys/128'}
                      alt={user.firstName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-none object-cover ring-1 ring-[#f5b700]/40"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 status-dot bg-[#f5b700] ring-1 ring-[#10131b]" />
                  </div>
                  <span className="hidden 2xl:inline-block font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold tracking-wider">
                    VIP EXECUTIVE
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
              ) : (
                <Link
                  to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-['Sora'] font-bold bg-[#f5b700] text-[#0b0e16] hover:bg-[#ffd88a] shadow-[0_4px_16px_rgba(245,183,0,0.3)] transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">VIP Access</span>
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-3 w-60 bg-[#181b24] dark:bg-[#181b24] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50 border border-white/15 animate-in fade-in duration-150">
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 status-dot bg-[#f5b700]" />
                      <p className="font-['Sora'] text-xs font-bold text-[#e0e2ed] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#ffd88a]">
                      @{user.username} • VIP Member
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-none font-['Manrope'] text-xs text-[#9c8f78] hover:bg-[#272a32] hover:text-[#ffd88a] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#f5b700]" />
                      <span>Executive Dossier</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-none font-['Manrope'] text-xs text-[#9c8f78] hover:bg-[#272a32] hover:text-[#ffd88a] transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-[#f5b700]" />
                      <span>Courier Dispatches</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-none font-['Manrope'] text-xs text-[#9c8f78] hover:bg-[#272a32] hover:text-[#ffd88a] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#cabeff]" />
                      <span>Private Vault</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-none font-['JetBrains_Mono'] text-xs text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Terminate Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[var(--bg-surface-elevated)] rounded-xl px-3.5 py-2 border border-[var(--border-subtle)]">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search luxury tech, flagship devices..."
              className="w-full bg-transparent font-['Manrope'] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
};
