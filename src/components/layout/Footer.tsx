import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please input a valid encrypted terminal address.');
      return;
    }
    setIsSubscribed(true);
    toast.success('Terminal Handshake Complete. $200 VIP Voucher Dispatched.', {
      style: {
        background: '#181b24',
        color: '#ffd88a',
        fontFamily: 'JetBrains Mono',
        border: '1px solid rgba(245, 183, 0, 0.4)',
      },
    });
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#0b0e16] text-[#e0e2ed] py-16 border-t border-white/5 mt-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 flex flex-col gap-12">
        {/* Value props telemetry banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1c1f28] text-[#ffd88a] border border-white/5 shrink-0">
              <Truck className="w-5 h-5 text-[#f5b700]" />
            </div>
            <div>
              <h5 className="font-['Sora'] font-bold text-sm text-[#e0e2ed]">
                Zero-Latency Courier
              </h5>
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                Complimentary over $100
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1c1f28] text-[#ffd88a] border border-white/5 shrink-0">
              <RotateCcw className="w-5 h-5 text-[#f5b700]" />
            </div>
            <div>
              <h5 className="font-['Sora'] font-bold text-sm text-[#e0e2ed]">
                30-Day White Glove
              </h5>
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                Unconditional return guarantee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1c1f28] text-[#ffd88a] border border-white/5 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#f5b700]" />
            </div>
            <div>
              <h5 className="font-['Sora'] font-bold text-sm text-[#e0e2ed]">
                256-Bit Encrypted
              </h5>
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                Quantum-resilient telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1c1f28] text-[#ffd88a] border border-white/5 shrink-0">
              <Headphones className="w-5 h-5 text-[#f5b700]" />
            </div>
            <div>
              <h5 className="font-['Sora'] font-bold text-sm text-[#e0e2ed]">
                24/7 Boss Concierge
              </h5>
              <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                Priority satellite assistance
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & VIP Box */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/LBOSS-SHOP-logo-transparent-600.png"
                alt="LBOSS SHOP"
                className="h-10 w-auto object-contain"
              />
              <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-0.5 rounded-none bg-[#f5b700] text-[#402d00] font-bold">
                EST. 2027
              </span>
            </div>
            <p className="font-['Manrope'] text-sm text-[#d4c5ac] max-w-md leading-relaxed">
              Next-generation hyper-luxury technology and precision lifestyle catalog engineered for
              elite collectors and visionaries. Surgical hardware, uncompromising bespoke aesthetics.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <span className="font-['JetBrains_Mono'] text-sm text-[#e0e2ed] font-semibold">
                VIP Boss Club Access
              </span>
              <p className="font-['Manrope'] text-xs text-[#9c8f78]">
                Subscribe for encrypted drops &amp; receive an immediate 10% private vault voucher.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] font-['JetBrains_Mono'] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Terminal Handshake Verified. 10% Voucher VIP200 Active.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md pt-1">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#1c1f28] rounded-xl px-4 py-2.5 font-['Manrope'] text-sm text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none focus:ring-1 focus:ring-[#f5b700] border border-white/5"
                    placeholder="Enter encrypted terminal email"
                    type="email"
                    required
                  />
                  <button
                    className="px-5 py-2.5 rounded-xl bg-[#f5b700] text-[#402d00] font-['JetBrains_Mono'] text-sm font-bold hover:bg-[#ffd88a] transition-colors cursor-pointer shadow-md"
                    type="submit"
                  >
                    Claim
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Collections</span>
            <nav className="flex flex-col gap-2 font-['Manrope'] text-sm text-[#d4c5ac]" aria-label="Collections">
              <Link to="/products?category=smartphones" className="hover:text-[#ffd88a] transition-colors">
                Electronics
              </Link>
              <Link to="/products?category=mens-watches" className="hover:text-[#ffd88a] transition-colors">
                Cyber Horology
              </Link>
              <Link to="/products?category=laptops" className="hover:text-[#ffd88a] transition-colors">
                Precision Computing
              </Link>
              <Link to="/products?category=fragrances" className="hover:text-[#ffd88a] transition-colors">
                Bespoke Aromatics
              </Link>
              <Link to="/products" className="hover:text-[#ffd88a] transition-colors">
                Vault Exclusives
              </Link>
            </nav>
          </div>

          {/* Concierge Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Client Protocol</span>
            <nav className="flex flex-col gap-2 font-['Manrope'] text-sm text-[#d4c5ac]" aria-label="Protocol">
              <Link to="/orders" className="hover:text-[#ffd88a] transition-colors">
                Telemetry Dispatch Tracking
              </Link>
              <Link to="/wishlist" className="hover:text-[#ffd88a] transition-colors">
                Encrypted Vault Dossier
              </Link>
              <Link to="/account" className="hover:text-[#ffd88a] transition-colors">
                Executive Profile
              </Link>
              <span className="text-[#9c8f78] text-xs font-['JetBrains_Mono'] pt-1">
                Direct Line: +1 (800) 555-BOSS
              </span>
            </nav>
          </div>

          {/* Infrastructure & Security Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Security Standard</span>
            <div className="flex flex-col gap-2.5 font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>256-BIT QUANTUM HASHING</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b700]" />
                <span>AEROSPACE METALLURGY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cabeff]" />
                <span>AUTHENTICATED DUMMYJSON API</span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#1c1f28] border border-white/5 text-[10px]">VISA</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f28] border border-white/5 text-[10px]">MC</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f28] border border-white/5 text-[10px]">AMEX</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f28] border border-white/5 text-[10px]">APPLE PAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-['JetBrains_Mono'] text-xs text-[#504532]">
          <p>© {new Date().getFullYear()} LBOSS SHOP. All Rights Reserved. 2027 Luxury Tech & Living.</p>
          <div className="flex items-center gap-4 text-[#9c8f78]">
            <span>STATUS: ALL TERMINALS NOMINAL</span>
            <span>•</span>
            <span>PING: 12ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
