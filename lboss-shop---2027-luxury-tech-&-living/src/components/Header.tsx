import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/shopLogic';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    cartTotals,
    wishlist,
    filters,
    setFilters,
    openCategory,
    currency,
    setCurrency,
    viewProduct,
  } = useShop();

  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    setFilters((prev) => ({ ...prev, searchQuery: val }));
    if (val.trim().length > 0 && currentScreen !== 'catalog') {
      setCurrentScreen('catalog');
    }
  };

  const navCategories = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'cyber-fashion', label: 'Cyber Fashion' },
    { id: 'precision-living', label: 'Precision Living' },
    { id: 'audio', label: 'Audio' },
    { id: 'vault-exclusives', label: 'Vault Exclusives' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#181b24]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-white/5">
      <div className="h-20 max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 flex items-center justify-between gap-6">
        {/* Brand & Category Navigation */}
        <div className="flex items-center gap-8 shrink-0">
          <button
            onClick={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            aria-label="LBOSS Home"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffd88a] via-[#f5b700] to-[#b38100] p-[1.5px] shadow-[0_0_15px_rgba(245,183,0,0.3)] transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#10131b] rounded-[6.5px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#ffd88a]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6L7 9V15L12 18L17 15V9L12 6Z" fill="#f5b700" fillOpacity="0.2" stroke="#f5b700" strokeWidth="1.25"/>
                    <path d="M10 9V14.5H14" stroke="#ffd88a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="font-['Sora'] text-xl uppercase tracking-wider text-[#ffd88a] font-bold">
                LBOSS
              </span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-6" aria-label="Main Navigation">
            {navCategories.map((cat) => {
              const isActive =
                currentScreen === 'catalog' &&
                filters.selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => openCategory(cat.id)}
                  className={`font-['Manrope'] text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#ffd88a] font-bold border-b border-[#f5b700] pb-0.5'
                      : 'text-[#d4c5ac] hover:text-[#e0e2ed]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Search Bar with Hotkey & Trending Tags */}
        <div className="flex-1 max-w-2xl hidden lg:flex flex-col gap-1 relative">
          <div className="relative flex items-center w-full bg-[#1c1f28] rounded-xl px-4 py-2 border border-white/5 focus-within:ring-2 focus-within:ring-[#cabeff]">
            <span className="material-symbols-outlined text-[#9c8f78] mr-2 select-none text-xl">
              search
            </span>
            <input
              id="global-search-input"
              value={searchVal}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="w-full bg-transparent font-['Manrope'] text-sm text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none"
              placeholder="Search 2027 luxury tech, flagship devices, designer apparel..."
              type="text"
            />
            <kbd className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] px-2 py-0.5 rounded bg-[#272a32] select-none border border-white/5">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-2 px-1 text-xs">
            <span className="font-['JetBrains_Mono'] text-[#504532]">Trending:</span>
            <button
              onClick={() => {
                setSearchVal('Titanium Watch');
                setFilters((prev) => ({ ...prev, searchQuery: 'Titanium Watch' }));
                setCurrentScreen('catalog');
              }}
              className="font-['JetBrains_Mono'] text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
            >
              Titanium Watch Pro
            </button>
            <span className="text-[#504532]">•</span>
            <button
              onClick={() => {
                setSearchVal('CyberDeck');
                setFilters((prev) => ({ ...prev, searchQuery: 'CyberDeck' }));
                setCurrentScreen('catalog');
              }}
              className="font-['JetBrains_Mono'] text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
            >
              CyberDeck 16
            </button>
            <span className="text-[#504532]">•</span>
            <button
              onClick={() => {
                setSearchVal('Obsidian Headphones');
                setFilters((prev) => ({ ...prev, searchQuery: 'Obsidian' }));
                setCurrentScreen('catalog');
              }}
              className="font-['JetBrains_Mono'] text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
            >
              Obsidian Headphones
            </button>
          </div>
        </div>

        {/* Currency, Theme, Wishlist, Cart & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1 font-['JetBrains_Mono'] text-sm text-[#d4c5ac] bg-[#1c1f28] px-2.5 py-1 rounded-lg border border-white/5">
            <span className="material-symbols-outlined text-base text-[#ffd88a]">attach_money</span>
            <span>{currency} $</span>
          </div>

          {/* Theme Toggle icon */}
          <button
            aria-label="Theme Mode"
            className="p-2 rounded-lg text-[#d4c5ac] hover:text-[#e0e2ed] hover:bg-[#1c1f28] transition-colors"
            type="button"
            title="Night Vision OLED Mode Active"
          >
            <span className="material-symbols-outlined">dark_mode</span>
          </button>

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            onClick={() => {
              setCurrentScreen('catalog');
              setFilters((prev) => ({ ...prev, vaultPrivilegeOnly: true }));
            }}
            className="relative p-2 rounded-lg text-[#d4c5ac] hover:text-[#e0e2ed] hover:bg-[#1c1f28] transition-colors cursor-pointer"
            type="button"
            title="View Vault Wishlist"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#4816cb] font-['JetBrains_Mono'] text-[10px] text-[#e6deff] leading-none font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Interactive Cart */}
          <button
            aria-label="Interactive Cart"
            onClick={() => {
              setCurrentScreen('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer border ${
              currentScreen === 'cart'
                ? 'bg-[#272a32] border-[#f5b700]'
                : 'bg-[#1c1f28] hover:bg-[#272a32] border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[#f5b700]">shopping_bag</span>
            <span className="font-['JetBrains_Mono'] text-sm text-[#ffd88a] font-bold">
              {formatCurrency(cartTotals.finalTotal, false)}
            </span>
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#f5b700] font-['JetBrains_Mono'] text-xs text-[#402d00] font-bold shadow-[0_0_12px_rgba(245,183,0,0.5)]">
              {cartTotals.itemCount}
            </span>
          </button>

          {/* VIP Executive Avatar */}
          <div className="relative flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="relative cursor-pointer">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#f5b700]/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1qH0OhumjwcapBPu5vLEw8BQOeHQiWhbtcLzDW11QrHkjxHH8E_V3kk1hQ8XLQh1_P7PVl-kUwLv6tww1zTu5JFO6LidtuW2WZfRI1XhRuvccIPnBCWSjJkhCK2WvQBC0AYaHaXspA6rpteBQ-eiNNRKeO6kUYR_cMb_N2CnbqArKywsdg_Jl4IZ-tHjTBA4I4xoNXjnCfWiZTBk_og-nLCa1VziulQv1kqvIqe26ufXAFYhJCoy7yw"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#f5b700] ring-2 ring-[#10131b]"></span>
            </div>
            <span className="hidden 2xl:inline-block font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold tracking-wider">
              VIP EXECUTIVE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
