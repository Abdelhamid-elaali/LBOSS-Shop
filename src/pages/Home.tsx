import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  TrendingUp,
  Award,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../features/api/apiSlice';
import { ProductCard } from '../components/common/ProductCard';
import { ProductSkeleton } from '../components/common/ProductSkeleton';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'LBOSS SHOP — 2027 Luxury Tech & Living';
  }, []);

  // Live Flash Drop Countdown Ticker
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

  // Fetch trending products (sorted by rating descending)
  const { data: trendingData, isLoading: isTrendingLoading } = useGetProductsQuery({
    limit: 8,
    skip: 0,
    sortBy: 'rating',
    order: 'desc',
  });

  // Fetch hot deals (top discounts)
  const { data: dealsData, isLoading: isDealsLoading } = useGetProductsQuery({
    limit: 8,
    skip: 0,
    sortBy: 'discountPercentage',
    order: 'desc',
  });

  // Fetch new arrivals (latest products)
  const { data: newArrivalsData, isLoading: isNewLoading } = useGetProductsQuery({
    limit: 8,
    skip: 8,
  });

  // Department configurations
  const curatedDepartments = [
    { slug: 'smartphones', label: 'Electronics', tag: 'AEROSPACE TECH', count: '48 ASSETS' },
    { slug: 'mens-watches', label: 'Cyber Horology', tag: 'PRECISION TIME', count: '24 ASSETS' },
    { slug: 'laptops', label: 'Computing', tag: 'NEURAL RIGS', count: '32 ASSETS' },
    { slug: 'fragrances', label: 'Bespoke Scents', tag: 'OLFACTORY ART', count: '16 ASSETS' },
    { slug: 'sunglasses', label: 'Neural Optics', tag: 'TITANIUM FRAMES', count: '18 ASSETS' },
    { slug: 'beauty', label: 'Skin Biology', tag: 'ADVANCED CELLULAR', count: '22 ASSETS' },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* 1. HERO SECTION WITH AMBIENT LIGHTING GLOWS */}
      <section className="relative w-full overflow-hidden bg-[#10131b] border-b border-white/5 pt-6 pb-20">
        {/* Ambient Top Glows */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#f5b700]/10 blur-[150px] pointer-events-none ambient-glow" />
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#4816cb]/20 blur-[140px] pointer-events-none ambient-glow" />

        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#272a32] text-[#ffd88a] font-['JetBrains_Mono'] text-xs uppercase tracking-wider border border-white/10">
                  <span className="w-2 h-2 status-dot bg-[#f5b700] animate-pulse" />
                  2027 Executive Keynote Drop
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] tracking-widest hidden sm:inline-block">
                  / PRIVATE CATALOGUE
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-['Sora'] text-display-xl tracking-tight text-[#e0e2ed] uppercase font-extrabold leading-none"
              >
                Defining{' '}
                <span className="bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] bg-clip-text text-transparent">
                  2027 Luxury
                </span>{' '}
                Tech &amp; Living
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-['Manrope'] text-lg text-[#d4c5ac] max-w-2xl leading-relaxed font-normal"
              >
                Engineered for commanders of industry. Discover the limited apex collection of neural optics,
                obsidian computing, and cybernetic timepieces crafted with aerospace-grade metallurgy.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link to="/products">
                  <Button variant="primary" size="lg" className="gap-2.5 rounded-none">
                    <span>Explore The 2027 Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <a href="#hot-deals">
                  <Button variant="secondary" size="lg" className="gap-2 text-[#e0e2ed] rounded-none">
                    <Flame className="w-4 h-4 text-[#f5b700]" />
                    <span>View Limited Flash Drops</span>
                  </Button>
                </a>
              </motion.div>

              {/* Telemetry metrics bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-6 font-['JetBrains_Mono'] text-xs text-[#9c8f78]"
              >
                <div>
                  <p className="font-bold text-lg text-[#e0e2ed] font-['Sora']">200+</p>
                  <p className="text-[#9c8f78]">Curated Assets</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-[#ffd88a] font-['Sora']">4.99 ★</p>
                  <p className="text-[#9c8f78]">Verified Score</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-[#cabeff] font-['Sora']">ZERO</p>
                  <p className="text-[#9c8f78]">Latency Fulfillment</p>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Column: Flagship Spotlight Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-none p-1 bg-gradient-to-b from-[#f5b700]/30 via-white/5 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="rounded-none bg-[#14171f] border border-white/10 p-7 relative overflow-hidden">
                  {/* Floating Promo tag */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-none text-xs font-bold font-['JetBrains_Mono'] bg-[#f5b700] text-[#0b0e16] flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,183,0,0.3)]">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      APEX KEYNOTE SPOTLIGHT
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a]">
                      CODE: BOSS10
                    </span>
                  </div>

                  {/* Featured Product Preview */}
                  <div className="aspect-[4/3] rounded-none bg-[#0b0e16] p-6 border border-white/10 flex items-center justify-center mb-6 relative group">
                    <img
                      src="https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/1.png"
                      alt="Featured Tech"
                      className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105 relative z-10"
                      loading="eager"
                    />
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-none bg-[#181b24] text-[#ffd88a] font-['JetBrains_Mono'] text-xs font-bold border border-white/10">
                      SAVE 15% VIP
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase tracking-wider">
                        Aerospace Metallurgy
                      </p>
                      <h3 className="font-['Sora'] font-bold text-lg text-[#e0e2ed]">
                        iPhone 13 Pro Apex Dossier
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] line-through">$1,299.00</p>
                      <p className="font-['JetBrains_Mono'] text-xl font-extrabold text-[#ffd88a]">$1,099.00</p>
                    </div>
                  </div>

                  <Link to="/products" className="block mt-6">
                    <Button variant="secondary" size="md" className="w-full justify-between rounded-none">
                      <span>Explore Keynote Showcase</span>
                      <ArrowRight className="w-4 h-4 text-[#f5b700]" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE FLASH DROP COUNTDOWN STRIP */}
      <section className="w-full bg-[#181b24] border-y border-white/5 py-4">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 status-dot bg-[#ffb4ab] animate-ping" />
            <span className="font-['Sora'] text-sm font-bold text-[#e0e2ed]">
              2027 QUANTUM FLASH ALLOCATION
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] hidden sm:inline">
              • AUTOMATIC DISPATCH RESERVATION
            </span>
          </div>

          <div className="flex items-center gap-2 font-['JetBrains_Mono']">
            <span className="text-xs text-[#9c8f78]">WINDOW CLOSES IN:</span>
            <div className="flex items-center gap-1 font-bold text-sm text-[#ffd88a]">
              <span className="bg-[#10131b] px-2 py-1 rounded-none border border-white/10">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-[#10131b] px-2 py-1 rounded-none border border-white/10">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-[#10131b] px-2 py-1 rounded-none border border-white/10">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED DEPARTMENT TILES */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold text-[#ffd88a] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-[#f5b700]" />
              <span>Curated Departments</span>
            </div>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#e0e2ed]">
              2027 Department Portfolios
            </h2>
          </div>
          <Link
            to="/products"
            className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center gap-1.5 transition-colors"
          >
            <span>All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {curatedDepartments.map((dept) => (
            <Link
              key={dept.slug}
              to={`/products?category=${dept.slug}`}
              className="group relative rounded-none bg-[#14171f] border border-white/10 p-6 flex flex-col items-center text-center hover:border-[#f5b700]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#f5b700] tracking-wider uppercase mb-2">
                {dept.tag}
              </span>
              <div className="w-14 h-14 rounded-none bg-[#1c1f28] text-[#ffd88a] border border-white/10 flex items-center justify-center font-['Sora'] font-extrabold text-lg mb-3 group-hover:bg-[#f5b700] group-hover:text-[#402d00] transition-all">
                {dept.label[0]}
              </div>
              <h4 className="font-['Sora'] font-bold text-sm text-[#e0e2ed] group-hover:text-[#ffd88a] transition-colors">
                {dept.label}
              </h4>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] mt-1">
                {dept.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. HOT DEALS SECTION */}
      <section id="hot-deals" className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-20 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold text-[#ffb4ab] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current text-[#ffb4ab]" />
              <span>Limited Allocation Drops</span>
            </div>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#e0e2ed]">
              Apex Deals • Highest VIP Discount
            </h2>
          </div>
          <Link
            to="/products?sort=discount-desc"
            className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center gap-1.5"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isDealsLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : dealsData?.products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 5. SIGNATURE 135° DUAL-ENERGY VIP BANNER */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-20">
        <div className="relative rounded-none overflow-hidden bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] p-8 sm:p-12 text-[#0b0e16] shadow-[0_20px_50px_rgba(245,183,0,0.25)] border border-black/10">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-none text-xs font-black font-['JetBrains_Mono'] uppercase tracking-wider bg-[#0b0e16] text-[#ffd88a] mb-4">
              2027 BOSS VIP VAULT
            </span>
            <h3 className="font-['Sora'] font-black text-3xl sm:text-4xl text-[#0b0e16] leading-tight mb-4">
              Unlock 20% off your entire cart with promo code BOSS20
            </h3>
            <p className="font-['Manrope'] text-sm sm:text-base font-semibold text-[#0b0e16]/80 mb-6 max-w-lg leading-relaxed">
              Enjoy simulated zero-latency checkout, satellite concierge priority, and direct access to DummyJSON verified inventory.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/products">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-[#0b0e16] text-[#ffd88a] hover:bg-[#181b24] border-none font-bold"
                >
                  Acquire With BOSS20
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRENDING TOP-RATED SECTION */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold text-[#ffd88a] uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-[#f5b700]" />
              <span>Verified Patron Ratings</span>
            </div>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#e0e2ed]">
              Trending Telemetry Rigs
            </h2>
          </div>
          <Link
            to="/products?sort=rating-desc"
            className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center gap-1.5"
          >
            <span>View All Top Rated</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isTrendingLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : trendingData?.products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 pt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold text-[#cabeff] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#cabeff]" />
              <span>Fresh Aerospace Inbound</span>
            </div>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#e0e2ed]">
              New 2027 Arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#ffd88a] hover:text-[#ffd88a]/80 flex items-center gap-1.5"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isNewLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : newArrivalsData?.products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
