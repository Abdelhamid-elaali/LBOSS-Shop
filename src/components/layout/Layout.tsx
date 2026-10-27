import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../cart/CartDrawer';
import { QuickViewModal } from '../common/QuickViewModal';
import { CurrencySelectorModal } from '../common/CurrencySelectorModal';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased selection:bg-[#f5b700] selection:text-[#10131b] transition-colors duration-200">
      <Navbar />
      <MobileNav />
      <CartDrawer />
      <QuickViewModal />
      <CurrencySelectorModal />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
