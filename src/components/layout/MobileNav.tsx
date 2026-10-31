import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  ShoppingBag,
  Heart,
  User,
  PackageCheck,
  Layers,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectIsMobileNavOpen,
  setMobileNav,
  selectTheme,
  toggleTheme,
  selectCurrency,
  setCurrencySelectorOpen,
} from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { useGetCategoriesQuery } from '../../features/api/apiSlice';

export const MobileNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector(selectIsMobileNavOpen);
  const theme = useAppSelector(selectTheme);
  const currency = useAppSelector(selectCurrency);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: categories = [] } = useGetCategoriesQuery();

  const closeMenu = () => dispatch(setMobileNav(false));

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  const handleOpenCurrency = () => {
    closeMenu();
    dispatch(setCurrencySelectorOpen(true));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-xs bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-6 flex flex-col justify-between overflow-y-auto lg:hidden text-[var(--text-primary)] transition-colors duration-200"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                <Link to="/" onClick={closeMenu} className="flex items-center">
                  <img
                    src={theme === 'dark' ? '/LBOSS-SHOP-logo-transparent-600.png' : '/LBOSS-SHOP-logo-light-transparent-600.png'}
                    alt="LBOSS SHOP"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency & Theme quick switches on mobile */}
              <div className="py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenCurrency}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-['JetBrains_Mono'] hover:border-[#f5b700]/50"
                >
                  <span className="text-base">{currency.flag}</span>
                  <span className="font-bold text-[#ffd88a]">{currency.code}</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">({currency.symbol})</span>
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(toggleTheme())}
                  aria-label="Toggle theme"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-['JetBrains_Mono'] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#ffd88a]" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#f5b700]" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>

              {/* User greeting if logged in */}
              {isAuthenticated && user && (
                <div className="py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
                  <img
                    src={user.image || 'https://dummyjson.com/icon/emilys/128'}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#f5b700]/40"
                  />
                  <div>
                    <p className="font-['Sora'] text-sm font-bold text-[var(--text-primary)]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold">
                      VIP Executive
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Navigation Links */}
              <div className="py-6 flex flex-col gap-1.5">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Manrope'] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[#ffd88a] transition-colors"
                >
                  <Home className="w-4 h-4 text-[#f5b700]" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Manrope'] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[#ffd88a] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#f5b700]" />
                  <span>2027 Apex Catalog</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Manrope'] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[#ffd88a] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#cabeff]" />
                  <span>Vault Wishlist</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Manrope'] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[#ffd88a] transition-colors"
                >
                  <PackageCheck className="w-4 h-4 text-[#f5b700]" />
                  <span>Courier Dispatches</span>
                </Link>
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Manrope'] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[#ffd88a] transition-colors"
                >
                  <User className="w-4 h-4 text-[#f5b700]" />
                  <span>Executive Profile</span>
                </Link>
              </div>

              {/* Categories list */}
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center gap-2 px-3 mb-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <Layers className="w-3.5 h-3.5 text-[#f5b700]" />
                  <span>Departments</span>
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1 font-['Manrope'] text-xs">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      onClick={closeMenu}
                      className="px-3 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#ffd88a] hover:bg-[var(--bg-surface-elevated)] capitalize transition-colors"
                    >
                      {cat.name || cat.slug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-semibold text-[#ffb4ab] bg-[#93000a]/20 border border-[#ffb4ab]/20 hover:bg-[#93000a]/40 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-['Sora'] text-xs font-bold text-[#0b0e16] bg-[#f5b700] hover:bg-[#ffd88a] shadow-[0_8px_24px_-6px_rgba(245,183,0,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>VIP Member Authentication</span>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
