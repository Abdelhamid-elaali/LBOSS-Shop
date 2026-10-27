import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS, APEX_CHRONO_X1, CATEGORIES_CONFIG } from '../data/mockData';
import { formatCurrency } from '../utils/shopLogic';

export const HomeScreen: React.FC = () => {
  const {
    setCurrentScreen,
    viewProduct,
    addToCart,
    toggleWishlist,
    wishlist,
    openCategory,
    setIsKeynoteModalOpen,
    setIsCheckoutModalOpen,
    setIsConciergeChatOpen,
    showToast,
    applyVoucher,
  } = useShop();

  const [activeTrendingFilter, setActiveTrendingFilter] = useState<'all' | 'neural' | 'acoustics' | 'wearables'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Live Flash Deal Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter trending items
  const trendingItems = ALL_PRODUCTS.slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      applyVoucher('VIP200');
      showToast('Terminal Handshake Complete. $200 VIP Voucher Dispatched.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* AMBIENT TOP LIGHTING GLOW LAYER */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#f5b700]/10 blur-[140px] pointer-events-none"></div>
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#4816cb]/20 blur-[130px] pointer-events-none"></div>

        {/* 1. HERO SECTION */}
        <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6 z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272a32] text-[#ffd88a] font-['JetBrains_Mono'] text-xs uppercase tracking-wider border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#f5b700] animate-pulse"></span>
                  2027 Executive Keynote Drop
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] tracking-widest hidden sm:inline-block">
                  / PRIVATE CATALOGUE
                </span>
              </div>

              <h1 className="font-['Sora'] text-display-xl tracking-tight text-[#e0e2ed] uppercase font-extrabold leading-none">
                Defining{' '}
                <span className="bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] bg-clip-text text-transparent">
                  2027 Luxury
                </span>{' '}
                Tech &amp; Living
              </h1>

              <p className="font-['Manrope'] text-lg text-[#d4c5ac] max-w-2xl leading-relaxed">
                Engineered for commanders of industry. Discover the limited apex collection of neural optics,
                obsidian audio, and cybernetic timepieces crafted with aerospace-grade metallurgy.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentScreen('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#f5b700] text-[#402d00] font-['Sora'] text-base font-bold shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  type="button"
                >
                  <span>Explore The 2027 Collection</span>
                  <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <button
                  onClick={() => setIsKeynoteModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#1c1f28] hover:bg-[#272a32] text-[#e0e2ed] font-['Sora'] text-base font-semibold transition-colors cursor-pointer border border-white/5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#cabeff]">play_circle</span>
                  <span>Watch Keynote (4K HDR)</span>
                </button>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#181b24] shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[#ffd88a] text-2xl">diamond</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">100% Grade 5</span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">Titanium &amp; Ceramic</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#181b24] shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[#cabeff] text-2xl">neurology</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">&lt;0.8ms Latency</span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">Sub-ms Neural Sync</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#181b24] shadow-sm border border-white/5">
                  <span className="material-symbols-outlined text-[#b8e3ff] text-2xl">shield</span>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">Armored Transit</span>
                    <span className="font-['Manrope'] text-xs text-[#9c8f78]">Complimentary Global</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Apex Featured Product Hologram Card */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative rounded-2xl bg-[#1c1f28] p-6 shadow-2xl flex flex-col gap-5 overflow-hidden border border-white/10">
                {/* Background Radial Glow */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#4816cb]/30 blur-3xl pointer-events-none"></div>

                {/* Top Pill Header */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-[#32353d] text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-semibold">
                    APEX HARDWARE // SPEC 01
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#32353d] text-[#b8e3ff] font-['JetBrains_Mono'] text-xs">
                    <span className="material-symbols-outlined text-sm">battery_charging_full</span>
                    <span>98% Efficiency</span>
                  </div>
                </div>

                {/* Hero Image Representation with Depth */}
                <div
                  onClick={() => viewProduct('apex-chrono-x1')}
                  className="relative w-full h-[380px] rounded-xl overflow-hidden bg-[#0b0e16] flex items-center justify-center group cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Futuristic luxury titanium smart watch"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8oyg0195KadT23PDjNG34Wp7emHnjg910xGen4g_jGOE1GDubFV7rTYxyZd38uVp7sa8Kk5mYh1tIOvzggvoOFf6JRb5wWB4xZS_lWPSMlA8RSfIejpCZCgBk1GzKVpvgoLX8labNDWdG4mWX97ooG_g04m9E1OdvHjunMnn570dtS8nxDJaKBkMDhS_xbOOkdM1dLthbM-ZHGugHeNtuznwyDNvwv2VgueuiFtAlsv76yfbRokenTw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e16] via-transparent to-transparent opacity-80"></div>

                  {/* Floating Hologram Telemetry HUD Inside Visual */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#1c1f28]/90 backdrop-blur-md flex items-center justify-between border border-white/10">
                    <div>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] block">CHASSIS CORE</span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#e0e2ed] font-bold">
                        Forged Damascus Obsidian
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] block">SENSOR MATRIX</span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                        Neural Octa-Sync
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apex Product Detail & Quick Purchase CTA */}
                <div className="flex flex-col gap-2 z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#cabeff] font-semibold uppercase tracking-wider">
                        LBOSS LABS BESPOKE
                      </span>
                      <h3
                        onClick={() => viewProduct('apex-chrono-x1')}
                        className="font-['Sora'] text-xl text-[#e0e2ed] font-bold cursor-pointer hover:text-[#ffd88a] transition-colors"
                      >
                        Apex Chrono X-1 Neural
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-['Sora'] text-2xl text-[#ffd88a] font-bold">$2,499.00</span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through block">
                        $2,899.00
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[#ffd88a]">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#e0e2ed]">4.9</span>
                      <span className="font-['Manrope'] text-xs text-[#9c8f78]">(128 elite reviews)</span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#ffb4ab] px-2 py-0.5 rounded-full bg-[#93000a]/40 font-bold">
                      Only 3 Left In Vault
                    </span>
                  </div>

                  {/* Real-time Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#32353d] overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-[#f5b700] to-[#cabeff] w-[88%] rounded-full"></div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => {
                        addToCart(APEX_CHRONO_X1);
                        setIsCheckoutModalOpen(true);
                      }}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-sm font-bold text-center transition-colors cursor-pointer shadow-md"
                      type="button"
                    >
                      Instant Vault Checkout
                    </button>
                    <button
                      onClick={() => toggleWishlist('apex-chrono-x1')}
                      aria-label="Save to Vault Wishlist"
                      className="p-3.5 rounded-xl bg-[#32353d] hover:bg-[#363942] text-[#e0e2ed] transition-colors flex items-center justify-center cursor-pointer"
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontVariationSettings: wishlist.includes('apex-chrono-x1') ? "'FILL' 1" : "'FILL' 0",
                          color: wishlist.includes('apex-chrono-x1') ? '#ffb4ab' : undefined,
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. BRAND TRUST STRIP */}
      <section className="w-full bg-[#0b0e16] py-16 border-y border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#1c1f28] hover:bg-[#272a32] transition-colors flex items-start gap-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#ffd88a]/10 text-[#ffd88a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">Armored Delivery</h4>
                <p className="font-['Manrope'] text-xs text-[#d4c5ac] pt-1">
                  White-glove bonded courier. Complimentary on orders over $500.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#1c1f28] hover:bg-[#272a32] transition-colors flex items-start gap-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#cabeff]/10 text-[#cabeff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">encrypted</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">Vault Protocol</h4>
                <p className="font-['Manrope'] text-xs text-[#d4c5ac] pt-1">
                  Quantum-safe encrypted checkout with biometric authentication.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#1c1f28] hover:bg-[#272a32] transition-colors flex items-start gap-4 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#ffd88a]/10 text-[#ffd88a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">assignment_return</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">30-Day Bespoke Returns</h4>
                <p className="font-['Manrope'] text-xs text-[#d4c5ac] pt-1">
                  Zero-friction reverse logistics with secure at-home intake.
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsConciergeChatOpen(true)}
              className="p-6 rounded-2xl bg-[#1c1f28] hover:bg-[#272a32] transition-colors flex items-start gap-4 border border-white/5 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#cabeff]/10 text-[#cabeff] flex items-center justify-center shrink-0 group-hover:bg-[#cabeff]/20">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-['Sora'] text-base text-[#e0e2ed] font-semibold">24/7 VIP Concierge</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="font-['Manrope'] text-xs text-[#d4c5ac] pt-1">
                  Direct private line to dedicated hardware product specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED CATEGORY TILES */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase tracking-widest font-bold">
              ARCHITECTURAL DOMAINS
            </span>
            <h2 className="font-['Sora'] text-display-lg text-[#e0e2ed] uppercase tracking-tight">
              Curated Portfolios
            </h2>
          </div>
          <p className="font-['Manrope'] text-base text-[#d4c5ac] max-w-md">
            Select from five precision-crafted disciplines engineered for seamless high-performance living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => openCategory(cat.id)}
              className="group relative rounded-2xl bg-[#1c1f28] overflow-hidden p-6 flex flex-col justify-between min-h-[360px] hover:bg-[#272a32] transition-all duration-300 text-left border border-white/5 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded-full bg-[#32353d] text-[#e0e2ed]">
                  {cat.tag}
                </span>
                <span className="material-symbols-outlined text-[#d4c5ac] group-hover:text-[#ffd88a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  north_east
                </span>
              </div>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                style={{ backgroundImage: `url('${cat.image}')` }}
              ></div>
              <div className="relative z-10 flex flex-col gap-1">
                <span className={`font-['JetBrains_Mono'] text-xs font-bold ${cat.domainColor}`}>
                  {cat.domain}
                </span>
                <h3 className="font-['Sora'] text-xl text-[#e0e2ed] font-bold">{cat.name}</h3>
                <p className="font-['Manrope'] text-xs text-[#d4c5ac]">{cat.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. TRENDING APEX GEAR & PRODUCT CARDS */}
      <section className="w-full bg-[#181b24] py-20 border-y border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16">
          {/* Section Header with Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5b700] animate-ping"></span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase font-bold tracking-widest">
                  LIVE CATALOG FEED
                </span>
              </div>
              <h2 className="font-['Sora'] text-display-lg text-[#e0e2ed] uppercase tracking-tight">
                Trending Apex Gear
              </h2>
            </div>

            {/* Filter Pill Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTrendingFilter('all')}
                className={`px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                  activeTrendingFilter === 'all'
                    ? 'bg-[#1c1f28] text-[#ffd88a] shadow-sm border border-[#f5b700]/30'
                    : 'bg-[#272a32] text-[#d4c5ac] hover:text-[#e0e2ed]'
                }`}
              >
                All Flagships
              </button>
              <button
                onClick={() => setActiveTrendingFilter('neural')}
                className={`px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                  activeTrendingFilter === 'neural'
                    ? 'bg-[#1c1f28] text-[#ffd88a] shadow-sm border border-[#f5b700]/30'
                    : 'bg-[#272a32] text-[#d4c5ac] hover:text-[#e0e2ed]'
                }`}
              >
                Neural Tech
              </button>
              <button
                onClick={() => setActiveTrendingFilter('acoustics')}
                className={`px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                  activeTrendingFilter === 'acoustics'
                    ? 'bg-[#1c1f28] text-[#ffd88a] shadow-sm border border-[#f5b700]/30'
                    : 'bg-[#272a32] text-[#d4c5ac] hover:text-[#e0e2ed]'
                }`}
              >
                Acoustics
              </button>
              <button
                onClick={() => setActiveTrendingFilter('wearables')}
                className={`px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                  activeTrendingFilter === 'wearables'
                    ? 'bg-[#1c1f28] text-[#ffd88a] shadow-sm border border-[#f5b700]/30'
                    : 'bg-[#272a32] text-[#d4c5ac] hover:text-[#e0e2ed]'
                }`}
              >
                Wearables
              </button>
            </div>
          </div>

          {/* 4-Card Flagship Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl bg-[#1c1f28] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-md border border-white/5"
              >
                <div className="flex flex-col gap-4">
                  {/* Badges & Wishlist */}
                  <div className="flex items-center justify-between">
                    {prod.badge ? (
                      <span className={`font-['JetBrains_Mono'] text-xs px-2.5 py-0.5 rounded-full ${prod.badgeClass || 'bg-white/10 text-white'}`}>
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-0.5 rounded-full bg-[#181b24] text-emerald-400">
                        In Stock
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      aria-label="Toggle Wishlist"
                      className="p-2 rounded-lg bg-[#272a32] text-[#d4c5ac] hover:text-[#ffd88a] transition-colors cursor-pointer"
                      type="button"
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

                  {/* Product Media */}
                  <div
                    onClick={() => viewProduct(prod.id)}
                    className="relative w-full h-56 rounded-xl bg-[#0b0e16] overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={prod.name}
                      src={prod.image}
                    />
                    {prod.discountPercent && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#1c1f28]/80 backdrop-blur font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-bold">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center justify-between text-[#9c8f78]">
                      <span className="font-['JetBrains_Mono'] text-xs uppercase font-semibold">
                        {prod.atelier}
                      </span>
                      <span className="font-['Manrope'] text-xs">{prod.categoryLabel}</span>
                    </div>
                    <h3
                      onClick={() => viewProduct(prod.id)}
                      className="font-['Sora'] text-lg text-[#e0e2ed] font-bold group-hover:text-[#ffd88a] transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="material-symbols-outlined text-sm text-[#ffd88a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#e0e2ed]">
                        {prod.rating.toFixed(1)}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                        ({prod.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex flex-col gap-3 pt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-['JetBrains_Mono'] text-lg font-bold text-[#ffd88a]">
                      {formatCurrency(prod.price)}
                    </span>
                    {prod.originalPrice && (
                      <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through">
                        {formatCurrency(prod.originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    className="w-full py-3 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOT DEALS OF THE SEASON (COUNTDOWN BANNER) */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 py-20 w-full">
        <div className="relative rounded-3xl bg-[#1c1f28] overflow-hidden p-8 md:p-16 shadow-2xl border border-white/5">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#f5b700]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#4816cb]/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy & Timer */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#f5b700] text-[#402d00] font-['JetBrains_Mono'] text-xs font-bold">
                  -25% VIP PRIVILEGE
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                  SEASONAL FLASH VAULT DROP
                </span>
              </div>

              <h2 className="font-['Sora'] text-display-lg text-[#e0e2ed] uppercase tracking-tight font-bold">
                Neural Sensory Rig <span className="text-[#ffd88a]">Pro 2027</span>
              </h2>

              <p className="font-['Manrope'] text-base text-[#d4c5ac] max-w-xl leading-relaxed">
                Complete high-fidelity sensory deck with dual haptic gloves and 16K retinal waveguide glasses.
                Precision tuned for virtual boardrooms and spatial creative mastery.
              </p>

              {/* Live Countdown */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase tracking-wider">
                  Window Closes In:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#272a32] min-w-[76px] border border-white/5">
                    <span className="font-['Sora'] text-2xl font-bold text-[#ffd88a]">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">HOURS</span>
                  </div>
                  <span className="font-['Sora'] text-2xl text-[#9c8f78]">:</span>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#272a32] min-w-[76px] border border-white/5">
                    <span className="font-['Sora'] text-2xl font-bold text-[#ffd88a]">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">MIN</span>
                  </div>
                  <span className="font-['Sora'] text-2xl text-[#9c8f78]">:</span>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#272a32] min-w-[76px] border border-white/5">
                    <span className="font-['Sora'] text-2xl font-bold text-[#ffd88a]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78]">SEC</span>
                  </div>
                </div>
              </div>

              {/* Price & Claim */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="font-['Sora'] text-3xl font-bold text-[#ffd88a]">
                      $4,950.00
                    </span>
                    <span className="font-['Sora'] text-lg text-[#9c8f78] line-through">
                      $6,600.00
                    </span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#b8e3ff]">
                    Includes 3-Year Zero-Fault Concierge Vault
                  </span>
                </div>

                <button
                  onClick={() => {
                    const rig = ALL_PRODUCTS.find((p) => p.id === 'neural-sensory-rig') || ALL_PRODUCTS[0];
                    addToCart(rig);
                    setCurrentScreen('cart');
                  }}
                  className="px-8 py-4 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-sm font-bold shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)] transition-all cursor-pointer"
                  type="button"
                >
                  Claim Flash Privilege
                </button>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-[#0b0e16] border border-white/10">
                <img
                  className="w-full h-full object-cover"
                  alt="Neural Sensory Rig Pro 2027"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQMcFRcJ-7CQbRdGuEVOD3cntcUffa2kIfwmd-bwIfs_H6xLkv7Xs5Um8nhKcDM_sEh7M0_khncajNp7Z1WUISxKxpGz9S2dfqEeM5NIzpnspJ6X1bxgZyaQZqRMsZn0MB2qG873jnNkAQvtCKm9EGp69B3cTHE3AtJcjIVIMvbSN74JJldTfH_37d3Fyul18w9i2f8q4HDHai5M_ZMzN07SFt5P-DYranEkdmm1QyN90evejkgN2Dsg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f28] via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 p-2 rounded-xl bg-[#272a32]/90 backdrop-blur font-['JetBrains_Mono'] text-xs text-[#e0e2ed] flex items-center gap-2 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                  <span>Allocation: 12 / 50 Units Left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VIP BOSS CLUB NEWSLETTER STRIP */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pb-20 w-full">
        <div className="rounded-3xl bg-[#181b24] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-white/5">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd88a] text-2xl">verified_user</span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] uppercase font-bold tracking-widest">
                ENCRYPTED VIP ALLOCATION
              </span>
            </div>
            <h3 className="font-['Sora'] text-2xl md:text-3xl text-[#e0e2ed] font-bold">
              Join The Inner Sovereign Network
            </h3>
            <p className="font-['Manrope'] text-sm text-[#d4c5ac] leading-relaxed">
              Receive confidential firmware notifications, private unlisted batch invites, and an immediate $200 welcome
              credit for your first vault transaction.
            </p>
          </div>

          <div className="w-full lg:max-w-md flex flex-col gap-2">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-[#1c1f28] rounded-xl px-4 py-3.5 font-['Manrope'] text-sm text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none focus:ring-1 focus:ring-[#f5b700] border border-white/10 shadow-inner"
                placeholder="Enter sovereign email terminal..."
                required
                type="email"
              />
              <button
                className="px-6 py-3.5 rounded-xl bg-[#f5b700] hover:bg-[#ffd88a] text-[#402d00] font-['Sora'] text-xs font-bold whitespace-nowrap transition-colors shadow-md cursor-pointer"
                type="submit"
              >
                Claim $200 Credit
              </button>
            </form>
            <div className="flex items-center gap-2 pt-1">
              <input
                defaultChecked
                className="w-4 h-4 rounded bg-[#1c1f28] text-[#f5b700] focus:ring-0 accent-[#f5b700]"
                id="biometric-consent"
                type="checkbox"
              />
              <label className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] cursor-pointer select-none" htmlFor="biometric-consent">
                I consent to encrypted cryptographic newsletters &amp; tier drops
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
