import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { openCategory, setIsConciergeChatOpen, showToast, applyVoucher } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      applyVoucher('VIP200');
      showToast('Terminal Handshake Complete. $200 VIP Voucher Dispatched.');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#0b0e16] text-[#e0e2ed] py-16 border-t border-white/5 mt-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-16 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & VIP Box */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-['Sora'] text-2xl uppercase tracking-wider text-[#ffd88a] font-bold">
                LBOSS SHOP
              </span>
              <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-0.5 rounded-full bg-[#f5b700] text-[#402d00] font-bold">
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
            </div>
          </div>

          {/* Collections Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Collections</span>
            <nav className="flex flex-col gap-2" aria-label="Collections">
              <button
                onClick={() => openCategory('electronics')}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Electronics
              </button>
              <button
                onClick={() => openCategory('cyber-fashion')}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Cyber Fashion
              </button>
              <button
                onClick={() => openCategory('precision-living')}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Precision Living
              </button>
              <button
                onClick={() => openCategory('audio')}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Audio &amp; Acoustics
              </button>
              <button
                onClick={() => openCategory('vault-exclusives')}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Vault Exclusives
              </button>
            </nav>
          </div>

          {/* Concierge Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Concierge</span>
            <nav className="flex flex-col gap-2" aria-label="Concierge">
              <button
                onClick={() => setIsConciergeChatOpen(true)}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Private Client Advisory
              </button>
              <button
                onClick={() => setIsConciergeChatOpen(true)}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Encrypted Transit &amp; Freight
              </button>
              <button
                onClick={() => setIsConciergeChatOpen(true)}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Bespoke Customization
              </button>
              <button
                onClick={() => setIsConciergeChatOpen(true)}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Lifetime Hardware Vault
              </button>
              <button
                onClick={() => setIsConciergeChatOpen(true)}
                className="text-left font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors"
              >
                Terminal Support
              </button>
            </nav>
          </div>

          {/* Governance Column */}
          <div className="flex flex-col gap-3">
            <span className="font-['Sora'] text-base text-[#e0e2ed] font-bold">Governance</span>
            <nav className="flex flex-col gap-2" aria-label="Governance">
              <span className="font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors cursor-default">
                Circular Metallurgy &amp; Carbon
              </span>
              <span className="font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors cursor-default">
                Quantum Security Protocol
              </span>
              <span className="font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors cursor-default">
                Investor Intelligence
              </span>
              <span className="font-['Manrope'] text-sm text-[#d4c5ac] hover:text-[#ffd88a] transition-colors cursor-default">
                Legal &amp; Sovereignty
              </span>
            </nav>
          </div>
        </div>

        {/* Verified Nodes & Disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] uppercase">
              Verified Nodes:
            </span>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#d4c5ac]">
              <span className="px-2.5 py-1 rounded bg-[#1c1f28] border border-white/5">Apple Pay</span>
              <span className="px-2.5 py-1 rounded bg-[#1c1f28] border border-white/5">Crypto Vault</span>
              <span className="px-2.5 py-1 rounded bg-[#1c1f28] border border-white/5">Visa Infinite</span>
              <span className="px-2.5 py-1 rounded bg-[#1c1f28] border border-white/5">Mastercard Black</span>
            </div>
          </div>
          <div className="font-['Manrope'] text-xs text-[#9c8f78] text-center md:text-right">
            © 2027 LBOSS CORPORATION. ALL RIGHTS RESERVED. PRIVATE CATALOG PROTOCOL.
          </div>
        </div>
      </div>
    </footer>
  );
};
