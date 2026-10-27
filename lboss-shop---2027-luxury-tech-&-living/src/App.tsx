/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { KeynoteModal } from './components/KeynoteModal';
import { ConciergeChatModal } from './components/ConciergeChatModal';
import { CheckoutModal } from './components/CheckoutModal';

const AppContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, toastMessage } = useShop();

  // Support URL query parameters for fast automated verification and deep links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam === 'catalog' || screenParam === 'product' || screenParam === 'cart') {
      setCurrentScreen(screenParam);
    }
  }, [setCurrentScreen]);

  return (
    <div className="min-h-screen bg-[#10131b] text-[#e0e2ed] flex flex-col font-['Manrope'] selection:bg-[#f5b700] selection:text-[#402d00]">
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div className="bg-[#1c1f28]/95 backdrop-blur-xl border border-[#f5b700] px-4 py-3 rounded-xl shadow-[0_0_24px_rgba(245,183,0,0.3)] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#f5b700] animate-ping"></span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#ffd88a] font-semibold">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main View Area */}
      <main className="w-full pt-20 flex-1 bg-[#10131b]">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'catalog' && <CatalogScreen />}
        {currentScreen === 'product' && <ProductDetailScreen />}
        {currentScreen === 'cart' && <CartScreen />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Interactive Portals */}
      <KeynoteModal />
      <ConciergeChatModal />
      <CheckoutModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
