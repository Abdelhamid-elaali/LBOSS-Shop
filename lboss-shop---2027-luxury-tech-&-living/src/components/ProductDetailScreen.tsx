import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { APEX_CHRONO_X1, FREQUENTLY_PAIRED_BUNDLE, ALL_PRODUCTS } from '../data/mockData';
import { calculateBundleTotal, formatCurrency } from '../utils/shopLogic';
import { BundleItem } from '../types';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    toggleWishlist,
    wishlist,
    setCurrentScreen,
    setIsCheckoutModalOpen,
    viewProduct,
    showToast,
  } = useShop();

  const product = selectedProduct || APEX_CHRONO_X1;

  // Active state for gallery image
  const [activeImage, setActiveImage] = useState<string>(
    product.images?.[0]?.url || product.image
  );
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [is360Spinning, setIs360Spinning] = useState(false);

  // Configuration options
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishes?.[0]?.name || 'Raw Brushed Titanium (Grade 5)'
  );
  const [selectedCaliber, setSelectedCaliber] = useState<'44' | '48'>('44');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'neural' | 'shipping' | 'reviews'>('specs');

  // Bundle selection state
  const [bundleItems, setBundleItems] = useState<BundleItem[]>(FREQUENTLY_PAIRED_BUNDLE);

  // Compute live price based on caliber selection
  const caliberPriceDelta = selectedCaliber === '48' ? 150 : 0;
  const unitPrice = product.price + caliberPriceDelta;
  const totalPrice = unitPrice * quantity;

  // 360 Spin auto-rotator
  const handleToggleSpin = () => {
    setIs360Spinning(!is360Spinning);
    if (!is360Spinning && product.images && product.images.length > 0) {
      let idx = activeAngleIndex;
      const spinInterval = setInterval(() => {
        idx = (idx + 1) % product.images!.length;
        setActiveAngleIndex(idx);
        setActiveImage(product.images![idx].url);
      }, 700);

      setTimeout(() => {
        clearInterval(spinInterval);
        setIs360Spinning(false);
      }, 3500);
    }
  };

  const handleBundleToggle = (itemId: string) => {
    setBundleItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item))
    );
  };

  const bundleTotals = calculateBundleTotal(bundleItems);

  const handleClaimBundle = () => {
    bundleItems
      .filter((i) => i.selected)
      .forEach((item) => {
        const matchingProd = ALL_PRODUCTS.find((p) => p.name.includes(item.name.split(' ')[0]));
        if (matchingProd) {
          addToCart(matchingProd, 1);
        } else {
          addToCart(product, 1);
        }
      });
    showToast('Complete Ecosystem Bundle Added to Cart');
    setCurrentScreen('cart');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Ambient Lighting */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#f5b700]/5 blur-[140px] pointer-events-none"></div>
        <div className="absolute top-96 left-10 w-[450px] h-[450px] rounded-full bg-[#4816cb]/20 blur-[130px] pointer-events-none"></div>

        <div className="max-w-[1720px] mx-auto px-4 md:px-8 xl:px-16 py-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#d4c5ac] font-['Manrope'] text-xs mb-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className="hover:text-[#ffd88a] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span>Home</span>
            </button>
            <span className="text-[#504532]">/</span>
            <button
              onClick={() => setCurrentScreen('catalog')}
              className="hover:text-[#ffd88a] transition-colors cursor-pointer"
            >
              Electronics
            </button>
            <span className="text-[#504532]">/</span>
            <span className="text-[#d4c5ac]">{product.categoryLabel}</span>
            <span className="text-[#504532]">/</span>
            <span className="text-[#ffd88a] font-medium">{product.name}</span>
          </nav>

          {/* Main Product Viewport: Asymmetric 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Gallery & Telemetry (Cols 1-7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Main Display Stage */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl bg-[#181b24] overflow-hidden group shadow-2xl flex items-center justify-center p-6 border border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,183,0,0.08)_0,rgba(16,19,27,0.95)_75%)]"></div>

                {/* Status Badges & Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272a32]/90 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#ffd88a] shadow-sm border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f5b700] animate-pulse"></span>
                      ULTRA-RES 4K SENSOR
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#272a32]/90 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#e6deff] border border-white/5">
                      SERIES 2027
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleSpin}
                      aria-label="360 Rotation View"
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-['JetBrains_Mono'] text-xs transition-all shadow-md cursor-pointer border border-white/10 ${
                        is360Spinning
                          ? 'bg-[#f5b700] text-[#402d00] font-bold'
                          : 'bg-[#272a32]/80 hover:bg-[#32353d] text-[#e0e2ed] hover:text-[#ffd88a]'
                      }`}
                      type="button"
                    >
                      <span className={`material-symbols-outlined text-base ${is360Spinning ? 'animate-spin' : ''}`}>
                        360
                      </span>
                      <span>360° SPIN</span>
                    </button>
                    <button
                      onClick={() => showToast('Optic Fullscreen Telemetry Engaged')}
                      aria-label="Fullscreen Gallery"
                      className="p-2 rounded-full bg-[#272a32]/80 hover:bg-[#32353d] text-[#e0e2ed] hover:text-[#ffd88a] transition-all shadow-md cursor-pointer border border-white/10"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">crop_free</span>
                    </button>
                  </div>
                </div>

                {/* Main Product Image */}
                <div className="relative w-full h-full flex items-center justify-center z-0 p-4 transition-transform duration-500 ease-out group-hover:scale-105">
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] cursor-crosshair transition-opacity duration-300"
                    src={activeImage}
                  />
                </div>

                {/* Dynamic Telemetry HUD Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
                  <div className="bg-[#32353d]/80 backdrop-blur-lg px-3 py-2 rounded-lg font-['JetBrains_Mono'] text-xs text-[#d4c5ac] flex items-center gap-3 border border-white/10">
                    <span className="text-[#ffd88a] font-semibold">TETRA-CHROMA DIAL</span>
                    <span className="text-[#504532]">|</span>
                    <span>SPECTRAL SAPPHIRE 9H</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#32353d]/80 backdrop-blur-lg px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs text-[#9c8f78] border border-white/10">
                    <span className="material-symbols-outlined text-sm">pinch</span>
                    <span>DRAG OR HOVER TO SCAN</span>
                  </div>
                </div>
              </div>

              {/* 4K Thumbnails Selection Rail */}
              <div className="grid grid-cols-4 gap-3">
                {(product.images || []).map((img, index) => {
                  const isActive = activeImage === img.url;
                  return (
                    <button
                      key={img.id}
                      onClick={() => {
                        setActiveImage(img.url);
                        setActiveAngleIndex(index);
                      }}
                      className={`flex flex-col gap-1.5 p-2 rounded-xl transition-all text-left group cursor-pointer border ${
                        isActive
                          ? 'bg-[#1c1f28] ring-2 ring-[#f5b700] border-[#f5b700]'
                          : 'bg-[#181b24] hover:bg-[#1c1f28] border-white/5'
                      }`}
                      type="button"
                    >
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#0b0e16]">
                        <img
                          alt={img.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          src={img.url}
                        />
                      </div>
                      <span
                        className={`font-['JetBrains_Mono'] text-xs truncate px-1 ${
                          isActive ? 'text-[#ffd88a] font-semibold' : 'text-[#d4c5ac]'
                        }`}
                      >
                        {img.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Micro Hardware Telemetry Strip */}
              <div className="bg-[#181b24] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/5 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-2xl">memory</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">NEURAL PROCESSOR</span>
                    <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">
                      {product.hardwareFeatures?.processor || 'N10 Quantum'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-2xl">shield_locked</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">WATER INTEGRITY</span>
                    <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">
                      {product.hardwareFeatures?.waterIntegrity || '100M ISO-900'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-2xl">battery_charging_full</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">SOLID-STATE BATTERY</span>
                    <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">
                      {product.hardwareFeatures?.battery || '14 Days Run'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Purchase Decision Engine (Cols 8-12) */}
            <div className="lg:col-span-5 flex flex-col gap-6 bg-[#181b24] p-6 md:p-8 rounded-2xl shadow-xl border border-white/5">
              {/* Identity & Rating Row */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#ffd88a] font-bold px-2.5 py-0.5 rounded-full bg-[#f5b700]/20 border border-[#f5b700]/30">
                      LBOSS LABS APEX SERIES
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] px-2 py-0.5 rounded-md bg-[#4816cb]/30">
                      GEN-4 HARDWARE
                    </span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">SKU: {product.sku}</span>
                </div>

                <h1 className="font-['Sora'] text-2xl md:text-3xl text-[#e0e2ed] font-bold tracking-tight mt-1">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-1 text-xs">
                  <div className="flex items-center gap-1 text-[#ffd88a]">
                    {'★'.repeat(5)}
                    <span className="font-['JetBrains_Mono'] text-sm text-[#e0e2ed] font-bold ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[#504532]">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="font-['JetBrains_Mono'] text-xs text-[#cabeff] hover:text-[#ffd88a] transition-colors underline cursor-pointer"
                  >
                    {product.reviewCount} Executive Reviews
                  </button>
                  <span className="text-[#504532]">•</span>
                  <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                    <span className="material-symbols-outlined text-sm text-[#ffd88a]">verified</span>
                    <span>Verified Collectors</span>
                  </div>
                </div>
              </div>

              {/* Price Telemetry Engine & Allocation Flag */}
              <div className="bg-[#1c1f28] rounded-xl p-5 flex flex-col gap-3 border border-white/5">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-['JetBrains_Mono'] text-3xl text-[#ffd88a] font-bold tracking-tight">
                      {formatCurrency(unitPrice)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-['JetBrains_Mono'] text-lg text-[#9c8f78] line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-[#f5b700] text-[#402d00] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                    SAVE $400 • 14% VIP ALLOCATION
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 font-['Manrope'] text-xs text-[#d4c5ac]">
                  <span className="material-symbols-outlined text-[#cabeff] text-base">payments</span>
                  <span>
                    Or 4 interest-free vault disbursements of{' '}
                    <strong className="text-white font-['JetBrains_Mono'] font-bold">
                      {formatCurrency(unitPrice / 4)}
                    </strong>{' '}
                    with <strong>LBOSS Vault Pay</strong>
                  </span>
                </div>

                {/* Scarcity Bar */}
                <div className="pt-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs">
                    <span className="text-[#ffb4ab] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                      In Stock - {product.stockCount} Units Remaining for Express Dispatch
                    </span>
                    <span className="text-[#9c8f78]">Tier 1 Inventory Vault</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#272a32] overflow-hidden">
                    <div className="h-full w-[82%] bg-gradient-to-r from-[#f5b700] via-[#ffb4ab] to-[#ffb4ab] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Chassis Metallurgy Finish Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold">
                    Chassis Metallurgy Finish
                  </label>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                    {selectedFinish}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(product.finishes || []).map((finish) => {
                    const isSelected = selectedFinish === finish.name;
                    return (
                      <button
                        key={finish.name}
                        onClick={() => setSelectedFinish(finish.name)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all text-left border cursor-pointer ${
                          isSelected
                            ? 'bg-[#1c1f28] ring-2 ring-[#f5b700] border-[#f5b700]'
                            : 'bg-[#1c1f28] hover:bg-[#272a32] border-white/5'
                        }`}
                        type="button"
                      >
                        <span className={`w-5 h-5 rounded-full ${finish.swatchGradient} shadow-inner shrink-0`}></span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold truncate">
                            {finish.label}
                          </span>
                          <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">
                            {finish.finishType}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chassis Caliber Size Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold">
                    Chassis Caliber Size
                  </label>
                  <button
                    onClick={() => showToast('Ergonomic Fitting Blueprint Loaded')}
                    className="font-['JetBrains_Mono'] text-xs text-[#cabeff] hover:text-[#ffd88a] transition-colors flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">straighten</span>
                    <span>Fitting Blueprint</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCaliber('44')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                      selectedCaliber === '44'
                        ? 'bg-[#1c1f28] ring-2 ring-[#f5b700] border-[#f5b700]'
                        : 'bg-[#1c1f28] hover:bg-[#272a32] border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">44mm</span>
                      {selectedCaliber === '44' && (
                        <span className="material-symbols-outlined text-[#ffd88a] text-base">check_circle</span>
                      )}
                    </div>
                    <span className="font-['Manrope'] text-xs text-[#d4c5ac] font-medium">Ergonomic Executive</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">
                      Fits 145mm – 190mm wrists
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCaliber('48')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                      selectedCaliber === '48'
                        ? 'bg-[#1c1f28] ring-2 ring-[#f5b700] border-[#f5b700]'
                        : 'bg-[#1c1f28] hover:bg-[#272a32] border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">48mm</span>
                      <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#272a32] text-[#ffd88a] font-bold">
                        +$150
                      </span>
                    </div>
                    <span className="font-['Manrope'] text-xs text-[#d4c5ac] font-medium">Commander Edition</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">
                      Fits 170mm – 225mm wrists
                    </span>
                  </button>
                </div>
              </div>

              {/* Quantity Stepper & Dual CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center bg-[#1c1f28] rounded-xl p-1 shrink-0 border border-white/5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[#d4c5ac] hover:text-white hover:bg-[#272a32] transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="font-['JetBrains_Mono'] text-base font-bold text-white w-10 text-center select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      aria-label="Increase quantity"
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[#d4c5ac] hover:text-white hover:bg-[#272a32] transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>

                  {/* Primary Add to Cart CTA */}
                  <button
                    onClick={() => {
                      addToCart(product, quantity, selectedFinish, `${selectedCaliber}mm`);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_12px_24px_-6px_rgba(245,183,0,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    <span>Add to Cart - {formatCurrency(totalPrice)}</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Save to Vault Wishlist"
                    className="w-12 h-12 rounded-xl bg-[#1c1f28] hover:bg-[#272a32] flex items-center justify-center text-[#d4c5ac] hover:text-[#cabeff] transition-all border border-white/5 cursor-pointer"
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{
                        fontVariationSettings: wishlist.includes(product.id) ? "'FILL' 1" : "'FILL' 0",
                        color: wishlist.includes(product.id) ? '#ffb4ab' : undefined,
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Secondary Express Checkout Button */}
                <button
                  onClick={() => {
                    addToCart(product, quantity, selectedFinish, `${selectedCaliber}mm`);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4816cb] to-[#31009a] hover:brightness-110 text-[#e6deff] font-['Sora'] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(72,22,203,0.3)] transition-all cursor-pointer border border-[#cabeff]/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  <span>Express Checkout via Vault Pay</span>
                </button>
              </div>

              {/* Trust Box */}
              <div className="bg-[#1c1f28] rounded-xl p-5 flex flex-col gap-3 border border-white/5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-xl mt-0.5">local_shipping</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold">
                      Complimentary Insured Courier (2-Day Delivery)
                    </span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">
                      Signature-mandated armored transit via LBOSS Private Logistics
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-xl mt-0.5">verified_user</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold">
                      Biometric Vault Warranty (5 Years)
                    </span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">
                      Zero-deductible titanium accidental repair and battery rejuvenation
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ffd88a] text-xl mt-0.5">assignment_return</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-semibold">
                      30-Day Hassle-Free Returns
                    </span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">
                      Encrypted returns vault lock with immediate refund clearance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DEEP DIVE TABS & TECHNICAL BLUEPRINT */}
          <section className="mt-16 flex flex-col gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-[#181b24] p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-3 rounded-xl font-['Sora'] text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-[#f5b700] text-[#402d00] shadow-md font-bold'
                    : 'text-[#d4c5ac] hover:text-white hover:bg-[#1c1f28]'
                }`}
                type="button"
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('neural')}
                className={`px-6 py-3 rounded-xl font-['Sora'] text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'neural'
                    ? 'bg-[#f5b700] text-[#402d00] shadow-md font-bold'
                    : 'text-[#d4c5ac] hover:text-white hover:bg-[#1c1f28]'
                }`}
                type="button"
              >
                Neural Engine &amp; OS
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-3 rounded-xl font-['Sora'] text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'bg-[#f5b700] text-[#402d00] shadow-md font-bold'
                    : 'text-[#d4c5ac] hover:text-white hover:bg-[#1c1f28]'
                }`}
                type="button"
              >
                Shipping &amp; Vault Security
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 rounded-xl font-['Sora'] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'bg-[#f5b700] text-[#402d00] shadow-md font-bold'
                    : 'text-[#d4c5ac] hover:text-white hover:bg-[#1c1f28]'
                }`}
                type="button"
              >
                <span>Executive Reviews</span>
                <span className="px-2 py-0.5 rounded-full bg-[#272a32] font-['JetBrains_Mono'] text-xs text-[#ffd88a]">
                  128
                </span>
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="bg-[#181b24] rounded-2xl p-6 md:p-10 shadow-xl border border-white/5">
              {/* Tab 1: Specs */}
              {activeTab === 'specs' && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase tracking-widest font-bold">
                        SURGICAL ARCHITECTURE
                      </span>
                      <h2 className="font-['Sora'] text-2xl font-bold text-[#e0e2ed] mt-1">
                        Grade-5 Metallurgy &amp; Quantum Sensors
                      </h2>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#d4c5ac] max-w-xl">
                      Every chassis is wire-EDM cut from a solid ingot of aerospace-grade titanium,
                      cryogenically hardened, and hand-finished with diamond abrasive brushes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(product.specs || []).map((spec, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1c1f28] rounded-xl p-6 flex flex-col gap-2 border border-white/5"
                      >
                        <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] uppercase tracking-wider">
                          {spec.category}
                        </span>
                        <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">
                          {spec.title}
                        </span>
                        <p className="font-['Manrope'] text-xs text-[#d4c5ac] leading-relaxed">
                          {spec.description}
                        </p>
                        {spec.metric && (
                          <div className="mt-auto pt-3 font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                            {spec.metric}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Neural Engine */}
              {activeTab === 'neural' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] uppercase font-bold tracking-widest">
                      LBOSS SYNAPSE OS 4.0
                    </span>
                    <h3 className="font-['Sora'] text-2xl font-bold text-[#e0e2ed]">
                      Sub-Conscious Micro-Gesture Recognition
                    </h3>
                    <p className="font-['Manrope'] text-sm text-[#d4c5ac] leading-relaxed">
                      Integrated with our patented N10 Coprocessor, the Chrono X-1 monitors micro-tendon deflections
                      and bio-impedance variances in your wrist, decoding intent before conscious muscle activation occurs.
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#ffd88a]">electric_bolt</span>
                        <span className="font-['Manrope'] text-xs text-[#e0e2ed]">
                          Sub-2ms gesture dispatch latency
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#ffd88a]">lock</span>
                        <span className="font-['Manrope'] text-xs text-[#e0e2ed]">
                          On-device local neural weights (zero cloud exfiltration)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#ffd88a]">fingerprint</span>
                        <span className="font-['Manrope'] text-xs text-[#e0e2ed]">
                          Continuous Biometric Wrist Authentication
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 aspect-video rounded-xl bg-[#1c1f28] flex items-center justify-center p-6 border border-white/5">
                    <svg className="w-full h-full text-[#ffd88a]" fill="none" stroke="currentColor" viewBox="0 0 500 240">
                      <path
                        d="M 10 120 Q 70 40 130 120 T 250 120 T 370 120 T 490 120"
                        stroke="currentColor"
                        strokeOpacity="0.3"
                        strokeWidth="2"
                      />
                      <path
                        d="M 10 120 Q 90 20 180 120 T 320 120 T 490 120"
                        stroke="#cabeff"
                        strokeDasharray="4 4"
                        strokeWidth="3"
                      />
                      <path
                        d="M 10 120 C 80 180 140 30 220 120 C 300 210 380 40 490 120"
                        stroke="#f5b700"
                        strokeWidth="3"
                      />
                      <circle cx="220" cy="120" r="6" className="fill-[#f5b700] animate-ping" />
                      <circle cx="220" cy="120" r="5" className="fill-[#f5b700]" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Tab 3: Shipping */}
              {activeTab === 'shipping' && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-['Sora'] text-2xl font-bold text-[#e0e2ed]">
                    Encrypted Diplomatic Shipping Protocol
                  </h3>
                  <p className="font-['Manrope'] text-sm text-[#d4c5ac] max-w-2xl leading-relaxed">
                    Every Apex Chrono X-1 is packed in a hermetically sealed aluminum flight case with tamper-evident digital cryptographic seals.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-[#1c1f28] p-5 rounded-xl flex flex-col gap-2 border border-white/5">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">TIER 1 TRANSIT</span>
                      <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">Armored Courier</span>
                      <p className="font-['Manrope'] text-xs text-[#d4c5ac]">
                        Signature-only personal delivery with ID verification and live geo-tracking link.
                      </p>
                    </div>

                    <div className="bg-[#1c1f28] p-5 rounded-xl flex flex-col gap-2 border border-white/5">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">INSURANCE VAULT</span>
                      <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">100% Guaranteed</span>
                      <p className="font-['Manrope'] text-xs text-[#d4c5ac]">
                        Full transit value insured by Lloyd&apos;s of London until verified custody handover.
                      </p>
                    </div>

                    <div className="bg-[#1c1f28] p-5 rounded-xl flex flex-col gap-2 border border-white/5">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">GLOBAL REACH</span>
                      <span className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">190+ Jurisdictions</span>
                      <p className="font-['Manrope'] text-xs text-[#d4c5ac]">
                        Expedited customs clearance handled pre-flight with zero surprise tariff levies.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === 'reviews' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="font-['Sora'] text-4xl font-bold text-[#ffd88a] leading-none">4.9</span>
                        <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] mt-1">
                          OUT OF 5.0 STARS
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex text-[#ffd88a] text-lg">{'★'.repeat(5)}</div>
                        <span className="font-['Manrope'] text-xs text-[#d4c5ac]">
                          Based on 128 verified luxury timepiece owners
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast('Review portal currently restricted to verified serial holders')}
                      className="px-5 py-2.5 rounded-xl bg-[#1c1f28] hover:bg-[#272a32] text-[#e0e2ed] font-['JetBrains_Mono'] text-xs transition-colors border border-white/5 cursor-pointer self-start md:self-auto"
                      type="button"
                    >
                      Submit Verified Review
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {(product.reviews || APEX_CHRONO_X1.reviews || []).map((rev) => (
                      <div key={rev.id} className="bg-[#1c1f28] p-6 rounded-xl flex flex-col gap-3 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">
                              {rev.author}
                            </span>
                            <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffd88a] px-2 py-0.5 rounded bg-[#f5b700]/20 font-semibold">
                              {rev.role}
                            </span>
                          </div>
                          <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">{rev.date}</span>
                        </div>
                        <div className="flex text-[#ffd88a] text-xs">{'★'.repeat(rev.rating)}</div>
                        <p className="font-['Manrope'] text-xs text-[#d4c5ac] leading-relaxed">
                          &ldquo;{rev.content}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* FREQUENTLY PAIRED TOGETHER: Cross-Sell Bundle Card */}
          <section className="mt-16">
            <div className="bg-[#181b24] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
                <div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] uppercase font-bold tracking-widest">
                    TACTICAL PAIRING BUNDLE
                  </span>
                  <h2 className="font-['Sora'] text-xl font-bold text-[#e0e2ed]">
                    Frequently Engineered Together
                  </h2>
                </div>
                <div className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold">
                  Save ${bundleTotals.savings} When Purchased As Ecosystem Kit
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Items Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {bundleItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !item.isMain && handleBundleToggle(item.id)}
                      className={`bg-[#1c1f28] p-4 rounded-xl flex flex-col gap-2 relative border transition-all ${
                        !item.isMain ? 'cursor-pointer hover:border-[#f5b700]/40' : ''
                      } ${item.selected ? 'border-[#f5b700]/30' : 'border-white/5 opacity-60'}`}
                    >
                      {item.isMain ? (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#f5b700]/20 text-[#ffd88a] font-['JetBrains_Mono'] text-[10px]">
                          MAIN UNIT
                        </span>
                      ) : (
                        <span
                          className={`material-symbols-outlined absolute top-2 right-2 text-base ${
                            item.selected ? 'text-[#ffd88a]' : 'text-[#9c8f78]'
                          }`}
                        >
                          {item.selected ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      )}

                      <div className="aspect-square rounded-lg bg-[#0b0e16] overflow-hidden">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      </div>

                      <div className="flex flex-col">
                        <span className="font-['Sora'] text-xs text-[#e0e2ed] font-bold truncate">
                          {item.name}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                            {formatCurrency(item.price)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle Action Card */}
                <div className="lg:col-span-4 bg-[#1c1f28] p-6 rounded-xl flex flex-col justify-between gap-4 border border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                      TOTAL BUNDLE VALUATION
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-['JetBrains_Mono'] text-2xl text-[#ffd88a] font-bold">
                        {formatCurrency(bundleTotals.totalPrice)}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-sm text-[#9c8f78] line-through">
                        {formatCurrency(bundleTotals.totalOriginal)}
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff]">
                      All {bundleTotals.selectedCount} Items Included in VIP Flight Case
                    </span>
                  </div>

                  <button
                    onClick={handleClaimBundle}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                    <span>Claim Complete Ecosystem Kit</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RELATED APEX COLLECTIONS */}
          <section className="mt-16 mb-8 flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase font-bold tracking-widest">
                  LBOSS LABS PORTFOLIO
                </span>
                <h2 className="font-['Sora'] text-2xl font-bold text-[#e0e2ed] mt-1">
                  Related Apex Collections
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'obsidian-spatial-pro',
                  tag: 'AUDIO',
                  brand: 'LBOSS ACOUSTICS',
                  name: 'Obsidian Master Planar 9',
                  price: 1850,
                  spec: 'Neural EQ Ready',
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm7z5WhdApaswdN0Ezi8_hWvMe1szyl6htB-GqKV7KgYXGekFvBfJiqDzAQ72UV74N6U5uWyYtJDAInuEqgthEYsPS8VvaLyEnUkdkf5Hez3n8pt_NDOIIACswiHNdacqLqIOsO8A-z8eHdcqYladm2H5s5psJro89XE6r7OF4KUIJn7HG_qskwKAxaJW7mtUNueY-0XWSn3TQS2LTZKt9Qm4gRciqQsyez05c5UzuOUoDhgkJHmhS1A',
                },
                {
                  id: 'cyberdeck-16',
                  tag: 'COMPUTING',
                  brand: 'LBOSS COMPUTING',
                  name: 'CyberDeck 16 Executive',
                  price: 4890,
                  spec: 'Quantum Core',
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDJVLVNla3S4a19u4wnmLS602c9NMwGZ5ifrEXUqaH5k7UY5W9WN-efNyEAa0LKBLYYjYYbw43tTyw41TH1qDSW0SK9RxbmkUzLOVlERhyGzHbpIcxEFVg2lKLuC0jqkQb5OXa4WmBZfZDepGOi6VmCS6pSZdbkfPtZuxIB5x724BTHfZDHVdvkKU42cV2GtiGELvoRiwdw0OJlb-JnQ_KS_aZTWnzkh5UvR1OE-u3Q2M1zLKwYjTVQ',
                },
                {
                  id: 'spectra-ar-glass',
                  tag: 'OPTICS',
                  brand: 'LBOSS VISION',
                  name: 'Spectra AR Titanium Glass',
                  price: 1450,
                  spec: 'Micro-OLED HUD',
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsUYrATqv8fdZgAZSwK_vmb7LQ_UH3B51qPapfPmyQrQjeh9tFokuGm4fB76HuUV4eohrWgTXADux3TUbc_x_zSLpNTNXPElaziITlllWgG-mihuOcn9VoDgzRU3zxv2SK0F-ggXoiZOC9JuYrCzpvF1kd_267fsOwTBfeI7Md115bCP6DQej9cpSrw7p2aJhfX3XgeBiYF7AgTsHUof6cmnUYWekzuXacNIEwi0S_viTIjqjZ2LxEDw',
                },
                {
                  id: 'kevlar-cyber-trench',
                  tag: 'CYBER FASHION',
                  brand: 'LBOSS COUTURE',
                  name: 'Aegis Graphene Trench Coat',
                  price: 1200,
                  spec: 'Bulletproof Thread',
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAumHTJ-sQQr5KcNn0aTovsRGIv_abX7P5IiBGXtQDRPHn4dYCDj10vtKmFRsVciZ7yjv_6BrD-YJXsuHzjD2SgOIsMmah6e4gF3ATO7Rl_bR9lENOYU_9EGkzm8op-Tsl86idjQdCmdGzxXUtJBTD7zDA1sTtadZh2KBqoR2iMX2p3VSODKgn_bnlvFWFNx4wPCPkU_OIurzgX38l1aQ7BTeiLzPRlwjuQhYHj5qDOMgT4ZYPJ0B0VJg',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => viewProduct(item.id)}
                  className="group bg-[#181b24] hover:bg-[#1c1f28] rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 shadow-lg border border-white/5 cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-xl bg-[#0b0e16] overflow-hidden">
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#272a32]/90 text-[#ffd88a] font-['JetBrains_Mono'] text-[10px] font-bold">
                      {item.tag}
                    </span>
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={item.img}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">{item.brand}</span>
                    <h3 className="font-['Sora'] text-xs text-[#e0e2ed] font-bold group-hover:text-[#ffd88a] transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">{item.spec}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
