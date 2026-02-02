import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingBag } from 'react-icons/fa';
import { selectCartTotalQuantity } from '../features/cart/cartSlice';

const Header = () => {
    const totalQuantity = useSelector(selectCartTotalQuantity);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
                    NIKE STORE
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link
                        to="/cart"
                        className="relative text-gray-700 hover:text-primary transition-colors p-2"
                        aria-label="Cart"
                    >
                        <FaShoppingBag className="text-2xl" />
                        {totalQuantity > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
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
