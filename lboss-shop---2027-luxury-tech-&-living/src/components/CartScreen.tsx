import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/shopLogic';

export const CartScreen: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    saveForLater,
    savedItems,
    hasGiftBox,
    setHasGiftBox,
    voucherCode,
    setVoucherCode,
    appliedVoucher,
    applyVoucher,
    cartTotals,
    setIsCheckoutModalOpen,
    setIsConciergeChatOpen,
    setCurrentScreen,
    viewProduct,
    showToast,
  } = useShop();

  // Vault Hold Countdown timer
  const [holdTimer, setHoldTimer] = useState(14 * 60 + 54);
  useEffect(() => {
    const interval = setInterval(() => {
      setHoldTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    applyVoucher(voucherCode);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Ambient Lighting Orbs */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#f5b700]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-48 right-10 w-80 h-80 rounded-full bg-[#4816cb]/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-8">
          {/* Header & Step Allocation Tracker */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#ffd88a] px-2.5 py-0.5 rounded-full bg-[#272a32] border border-white/5">
                  Order Sequence 2027-V9
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b700] animate-pulse"></span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                  Telemetry: Vault Allocation Reserved
                </span>
              </div>
              <h1 className="font-['Sora'] text-display-lg text-[#e0e2ed] tracking-tight font-bold">
                Your Cart &amp; Allocation
              </h1>
            </div>

            {/* 3-Step Allocation Tracker */}
            <div className="w-full lg:w-auto lg:min-w-[540px] bg-[#181b24] rounded-xl p-4 shadow-xl border border-white/5">
              <div className="grid grid-cols-3 gap-2 relative">
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-7 h-7 rounded-lg bg-[#f5b700] text-[#402d00] font-['JetBrains_Mono'] text-xs font-bold flex items-center justify-center shadow-[0_0_16px_rgba(245,183,0,0.4)]">
                    1
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold truncate">
                      Allocation
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] truncate leading-tight">
                      Review
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative z-10 opacity-70">
                  <div className="w-7 h-7 rounded-lg bg-[#272a32] text-[#d4c5ac] font-['JetBrains_Mono'] text-xs font-medium flex items-center justify-center">
                    2
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] truncate">Transit</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] truncate leading-tight">
                      Armored
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative z-10 opacity-50">
                  <div className="w-7 h-7 rounded-lg bg-[#272a32] text-[#d4c5ac] font-['JetBrains_Mono'] text-xs font-medium flex items-center justify-center">
                    3
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] truncate">Vault Pay</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] truncate leading-tight">
                      Execute
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-1 bg-[#272a32] rounded-full mt-3 overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#f5b700] to-[#cabeff] transition-all duration-700"></div>
              </div>
            </div>
          </div>

          {/* 2-Column Cart Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left Items Column (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-['Sora'] text-xl text-[#e0e2ed] font-bold">Your Selected Apex Items</h2>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-medium">
                    ({cartItems.length} Items Active)
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#9c8f78] bg-[#181b24] px-3 py-1 rounded-full border border-white/5">
                  <span className="material-symbols-outlined text-sm text-[#ffd88a]">timer</span>
                  <span>
                    Vault hold locked for{' '}
                    <span className="text-[#ffd88a] font-bold">{formatTimer(holdTimer)}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#181b24] text-center flex flex-col items-center justify-center gap-4 border border-white/5 shadow-xl">
                  <span className="material-symbols-outlined text-4xl text-[#9c8f78]">production_quantity_limits</span>
                  <h3 className="font-['Sora'] text-xl font-bold text-[#e0e2ed]">
                    Your Vault Allocation Is Empty
                  </h3>
                  <p className="font-['Manrope'] text-sm text-[#9c8f78] max-w-md">
                    Explore the limited 2027 collection of neural optics, timepieces, and spatial acoustics.
                  </p>
                  <button
                    onClick={() => setCurrentScreen('catalog')}
                    className="px-6 py-3 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-xs font-bold hover:bg-[#ffd88a] transition-all cursor-pointer shadow-md"
                  >
                    Explore Apex Catalog
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative bg-[#181b24] rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-[#1c1f28] border border-white/5"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Thumbnail */}
                        <div
                          onClick={() => viewProduct(item.product.id)}
                          className="relative w-full md:w-44 h-44 rounded-xl overflow-hidden bg-[#0b0e16] shrink-0 group cursor-pointer border border-white/5"
                        >
                          <img
                            alt={item.product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={item.product.image}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#f5b700] text-[#402d00] font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider">
                            {item.product.id === 'apex-chrono-x1' ? 'APEX TITAN' : 'ACOUSTICS'}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between h-full gap-3 w-full">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                            <div>
                              <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] uppercase tracking-wider">
                                {item.product.id === 'apex-chrono-x1'
                                  ? 'Neural Horology Series'
                                  : 'Spatial Transducer 8.1'}
                              </span>
                              <h3
                                onClick={() => viewProduct(item.product.id)}
                                className="font-['Sora'] text-lg text-[#e0e2ed] font-semibold tracking-tight hover:text-[#ffd88a] transition-colors cursor-pointer"
                              >
                                {item.product.name}
                              </h3>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] bg-[#0b0e16] px-2 py-0.5 rounded border border-white/5">
                                  {item.selectedFinish}
                                </span>
                                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] bg-[#0b0e16] px-2 py-0.5 rounded border border-white/5">
                                  {item.selectedSize}
                                </span>
                                <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5b700]"></span>
                                  {item.product.id === 'apex-chrono-x1'
                                    ? 'Allocated (1 of 500)'
                                    : 'In Vault Vault-Storage 04'}
                                </span>
                              </div>
                            </div>

                            <div className="text-left md:text-right shrink-0">
                              {item.product.originalPrice && (
                                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through block">
                                  {formatCurrency(item.product.originalPrice)}
                                </span>
                              )}
                              <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#ffd88a] tabular-nums">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          </div>

                          {/* Stepper & Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 bg-[#0b0e16] rounded-xl p-1 border border-white/5">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8f78] hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">remove</span>
                              </button>
                              <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] px-2 font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8f78] hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">add</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => saveForLater(item.id)}
                                className="flex items-center gap-1 font-['Manrope'] text-xs text-[#9c8f78] hover:text-[#ffd88a] transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">bookmark</span>
                                <span>Save for Later</span>
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex items-center gap-1 font-['Manrope'] text-xs text-[#9c8f78] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Complimentary Presentation Box Toggle */}
              <div className="bg-[#181b24] rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f5b700]/20 flex items-center justify-center text-[#f5b700] shrink-0 border border-[#f5b700]/30">
                    <span className="material-symbols-outlined text-2xl">redeem</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">
                      Signature Vault Presentation Box
                    </span>
                    <p className="font-['Manrope'] text-xs text-[#9c8f78]">
                      Matte obsidian casing with custom hand-tied 24K threaded gold ribbon and certified serial seal.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={hasGiftBox}
                    onChange={(e) => setHasGiftBox(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-[#32353d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#f5b700] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#10131b] after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
                  <span className="ml-3 font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                    COMPLIMENTARY
                  </span>
                </label>
              </div>

              {/* VIP Voucher & Terminal Code Form */}
              <div className="bg-[#181b24] rounded-2xl p-6 shadow-md border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffd88a]">verified</span>
                    <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">
                      VIP Voucher &amp; Terminal Code
                    </span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase tracking-wider">
                    Encrypted Access
                  </span>
                </div>

                <form onSubmit={handleApplyVoucher} className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full flex-1">
                    <input
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="w-full bg-[#0b0e16] rounded-xl px-4 py-3 font-['JetBrains_Mono'] text-xs text-[#e0e2ed] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#f5b700] border border-white/5"
                      placeholder="ENTER TERMINAL CODE..."
                    />
                    {appliedVoucher && (
                      <span className="absolute right-3 top-3 material-symbols-outlined text-[#f5b700] text-base">
                        check_circle
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#272a32] hover:bg-[#32353d] text-[#e0e2ed] font-['JetBrains_Mono'] text-xs font-semibold transition-colors cursor-pointer border border-white/5"
                    type="submit"
                  >
                    {appliedVoucher ? 'Applied' : 'Apply Key'}
                  </button>
                </form>

                {appliedVoucher && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#4816cb]/20 border border-[#cabeff]/20">
                    <div className="flex items-center gap-2">
                      <span className="font-['JetBrains_Mono'] text-xs px-2 py-0.5 rounded bg-[#4816cb] text-[#e6deff] font-bold">
                        {appliedVoucher}
                      </span>
                      <span className="font-['Manrope'] text-xs text-[#e6deff]">
                        {cartTotals.discountLabel || 'Executive VIP allocation rebate unlocked'}
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] font-bold tabular-nums">
                      -{formatCurrency(cartTotals.discount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-[#181b24] rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-[#ffd88a] text-2xl">shield_with_heart</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">
                      Lifetime Hardware Vault
                    </span>
                    <span className="font-['Manrope'] text-[11px] text-[#9c8f78]">
                      Direct swap &amp; titanium restoration
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#181b24] rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-[#cabeff] text-2xl">flight_takeoff</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">
                      Encrypted Express Transit
                    </span>
                    <span className="font-['Manrope'] text-[11px] text-[#9c8f78]">
                      Armored transport with biometric release
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#181b24] rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-[#b8e3ff] text-2xl">lock_reset</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">
                      30-Day Zero-Friction Return
                    </span>
                    <span className="font-['Manrope'] text-[11px] text-[#9c8f78]">
                      Instant collateral escrow return
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Column (4 cols, sticky) */}
            <div className="xl:col-span-4 flex flex-col gap-6 sticky top-28">
              <div className="bg-[#181b24] rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5b700]/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="font-['Sora'] text-lg text-[#e0e2ed] font-bold">Order Summary</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase font-bold tracking-widest">
                    USD CURRENCY
                  </span>
                </div>

                <div className="flex flex-col gap-3 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-['Manrope'] text-sm text-[#d4c5ac]">Selected Apex Subtotal</span>
                    <span className="font-['JetBrains_Mono'] text-sm text-[#e0e2ed] tabular-nums font-medium">
                      {formatCurrency(cartTotals.subtotal)}
                    </span>
                  </div>

                  {cartTotals.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Manrope'] text-sm text-[#cabeff]">
                          VIP Code ({appliedVoucher})
                        </span>
                        <span className="material-symbols-outlined text-xs text-[#cabeff]">verified</span>
                      </div>
                      <span className="font-['JetBrains_Mono'] text-sm text-[#cabeff] tabular-nums font-bold">
                        -{formatCurrency(cartTotals.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-['Manrope'] text-sm text-[#d4c5ac]">
                        Armored White Glove Shipping
                      </span>
                      <span
                        className="material-symbols-outlined text-xs text-[#9c8f78] cursor-help"
                        title="Includes climate-controlled vehicle & signature release"
                      >
                        info
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-sm text-[#ffd88a] font-bold">
                      FREE
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-['Manrope'] text-sm text-[#d4c5ac]">Estimated Duty &amp; Global Tax</span>
                    <span className="font-['JetBrains_Mono'] text-sm text-[#e0e2ed] tabular-nums font-medium">
                      {formatCurrency(cartTotals.tax)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-1"></div>

                <div className="flex items-end justify-between py-4">
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase tracking-wider">
                      Final Allocation Total
                    </span>
                    <span className="font-['Manrope'] text-[11px] text-[#9c8f78]">
                      All custom insurance included
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-['JetBrains_Mono'] text-3xl font-bold text-[#f5b700] tabular-nums leading-none tracking-tight">
                      {formatCurrency(cartTotals.finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout Button */}
                <div className="pt-2 flex flex-col gap-4">
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    disabled={cartItems.length === 0}
                    className="w-full py-4 px-6 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-base text-center font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-[#ffd88a] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(245,183,0,0.35)] cursor-pointer disabled:opacity-50"
                  >
                    <span>Proceed to Armored Checkout</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="h-px flex-1 bg-white/10"></span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] uppercase px-2">
                      Express 1-Click Vault
                    </span>
                    <span className="h-px flex-1 bg-white/10"></span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      aria-label="Apple Pay"
                      className="h-11 rounded-xl bg-[#272a32] hover:bg-[#32353d] flex items-center justify-center text-[#e0e2ed] transition-colors cursor-pointer border border-white/5 font-['JetBrains_Mono'] text-xs font-bold"
                      type="button"
                    >
                       Pay
                    </button>
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      aria-label="Google Pay"
                      className="h-11 rounded-xl bg-[#272a32] hover:bg-[#32353d] flex items-center justify-center text-[#e0e2ed] transition-colors cursor-pointer border border-white/5 font-['JetBrains_Mono'] text-xs font-bold"
                      type="button"
                    >
                      G Pay
                    </button>
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      aria-label="Crypto Vault Pay"
                      className="h-11 rounded-xl bg-[#272a32] hover:bg-[#32353d] flex items-center justify-center text-[#ffd88a] transition-colors cursor-pointer border border-white/5 font-['JetBrains_Mono'] text-xs font-bold"
                      type="button"
                    >
                      ₿ Vault
                    </button>
                  </div>
                </div>

                {/* Encryption details */}
                <div className="pt-6 mt-4 border-t border-white/5 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[#9c8f78]">
                    <span className="material-symbols-outlined text-base text-[#ffd88a]">
                      enhanced_encryption
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs">
                      256-Bit Quantum Armored Encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9c8f78]">
                    <span className="material-symbols-outlined text-base text-[#cabeff]">
                      verified_user
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs">
                      LBOSS Authenticity Guarantee #9022
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9c8f78]">
                    <span className="material-symbols-outlined text-base text-[#b8e3ff]">
                      headset_mic
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs">
                      24/7 Dedicated Client Escalation
                    </span>
                  </div>
                </div>
              </div>

              {/* Concierge Desk Widget */}
              <div className="bg-[#0b0e16] rounded-2xl p-5 shadow-md flex items-center gap-4 border border-white/5">
                <div className="relative shrink-0">
                  <img
                    alt="Concierge Desk"
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-[#f5b700]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDIEOcQlO7MAFsHFVwsqNDu-U2ZduVGbOiAcJLY07qqm2UzFYqOLx2HKP4sI_y69WFxgpQHeCcBsMucj2nPHrwdAUdrOapB88HPF3EnDyLH-kfd6T58stiq43CD6KANftMI98LJpO5iLQLKllsGEbzss-_VEaG_ZsXLjsHfvTKsOLpLsbRXW2rJXtm3CUYa0Z7tn7CBLC7vgoxBUVqSkjKDqiaRIkYfbt8xTotkTYBYz5ItF8zGwg31w"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#f5b700] ring-2 ring-[#0b0e16]"></span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold truncate">
                    Executive Procurement Desk
                  </span>
                  <p className="font-['Manrope'] text-xs text-[#9c8f78] line-clamp-1">
                    Direct encrypted link to your senior allocation specialist.
                  </p>
                </div>
                <button
                  onClick={() => setIsConciergeChatOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#272a32] hover:bg-[#32353d] text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-semibold shrink-0 transition-colors cursor-pointer border border-white/5"
                  type="button"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
