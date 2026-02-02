import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingBag } from 'react-icons/fa';
import { selectCartTotalQuantity } from '../features/cart/cartSlice';

const Header = () => {
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const location = useLocation();

    // On Home page, we use a custom search header as per design, but we still need the global nav for Cart/Menu
    // Actually, the designs usually have the specific header on the page. 
    // Let's make this a "Top Nav" that sits above or overlays.

    // For the design match: "Home" has its own header. "ProductDetails" has its own. 
    // We can hide this global header on those pages or adapt it.
    // For now, let's keep it simple: Minimal logo and Cart.

    if (location.pathname.includes('/product/')) return null; // Hide on product details (it has its own)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
                    NIKE <span className="text-primary">STORE</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link
                        to="/cart"
                        className="relative text-slate-700 hover:text-primary transition-colors p-2"
                        aria-label="Cart"
                    >
                        <FaShoppingBag className="text-2xl" />
                        {totalQuantity > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
