import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectIsCartDrawerOpen,
  setCartDrawer,
  updateQuantity,
  removeFromCart,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTotal,
  selectCartProductSavings,
} from '../../features/cart/cartSlice';
import { selectCurrency } from '../../features/ui/uiSlice';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const total = useAppSelector(selectCartTotal);
  const savings = useAppSelector(selectCartProductSavings);
  const currency = useAppSelector(selectCurrency);

  const closeDrawer = () => dispatch(setCartDrawer(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-strong)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col text-[var(--text-primary)] transition-colors duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 shadow-[0_0_12px_rgba(245,183,0,0.3)]">
                  <ShoppingBag className="w-5 h-5 text-[#f5b700]" />
                </div>
                <div>
                  <h3 className="font-['Sora'] font-bold text-lg text-[var(--text-primary)]">
                    Interactive Cart
                  </h3>
                  <p className="font-['JetBrains_Mono'] text-xs text-[var(--text-secondary)]">
                    {items.length} {items.length === 1 ? 'asset allocated' : 'assets allocated'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-[var(--border-subtle)]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] mb-4">
                    <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
                  </div>
                  <h4 className="font-['Sora'] font-bold text-[var(--text-primary)] mb-1">
                    Cart Allocation Empty
                  </h4>
                  <p className="font-['Manrope'] text-xs text-[var(--text-secondary)] max-w-[260px] mb-6 leading-relaxed">
                    Explore the 2027 collection to index bespoke technology assets into your private terminal.
                  </p>
                  <Button
                    onClick={() => {
                      closeDrawer();
                    }}
                    variant="primary"
                    size="sm"
                  >
                    Explore Catalog
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-18 h-18 rounded-xl object-contain bg-[var(--bg-inset)] p-2 shrink-0 border border-[var(--border-subtle)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.id}`}
                          onClick={closeDrawer}
                          className="font-['Sora'] font-bold text-xs text-[var(--text-primary)] hover:text-[#ffd88a] line-clamp-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-[var(--text-secondary)] hover:text-[#ffb4ab] transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#ffd88a]">
                          {formatPrice(item.price, currency.code, currency.rate)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-secondary)] line-through">
                            {formatPrice(item.originalPrice, currency.code, currency.rate)}
                          </span>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="p-1 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[#ffd88a] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-['JetBrains_Mono'] text-xs font-bold text-[var(--text-primary)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="p-1 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[#ffd88a] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffd88a]">
                          {formatPrice(item.price * item.quantity, currency.code, currency.rate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-col gap-3">
                {savings > 0 && (
                  <div className="flex justify-between font-['JetBrains_Mono'] text-xs text-[#22c55e] font-medium">
                    <span>VIP Privilege Savings</span>
                    <span>-{formatPrice(savings, currency.code, currency.rate)}</span>
                  </div>
                )}
                <div className="flex justify-between font-['JetBrains_Mono'] text-xs text-[var(--text-secondary)]">
                  <span>Courier Dispatch</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping, currency.code, currency.rate)}</span>
                </div>
                <div className="flex justify-between font-['Sora'] text-sm font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                  <span>Subtotal</span>
                  <span className="font-['JetBrains_Mono'] text-base text-[#ffd88a] font-extrabold">
                    {formatPrice(subtotal, currency.code, currency.rate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link to="/cart" onClick={closeDrawer} className="w-full">
                    <Button variant="secondary" size="md" className="w-full">
                      Review Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={closeDrawer} className="w-full">
                    <Button variant="primary" size="md" className="w-full gap-2">
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
