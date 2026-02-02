import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { selectCartItems, selectCartTotalAmount, updateQuantity, removeFromCart } from '../features/cart/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const totalAmount = useSelector(selectCartTotalAmount);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    if (cartItems.length === 0) {
        return (
            <main className="container mx-auto px-4 py-8 text-center text-gray-500 min-h-[50vh] flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Shopping Cart</h1>
                <p>Your cart is empty.</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl pb-32">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Shopping Cart</h1>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            <div className="text-primary font-bold">${item.price.toFixed(2)}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <button
                                className="text-red-400 hover:text-red-600 p-1"
                                onClick={() => handleRemove(item.id)}
                                aria-label="Remove item"
                            >
                                <FaTrash />
                            </button>

                            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
                                <button
                                    className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-black"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                                <button
                                    className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-black"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:static md:bg-transparent md:border-none md:shadow-none md:mt-8 md:p-0">
                <div className="max-w-3xl mx-auto flex items-center justify-between mb-4 md:mb-6">
                    <span className="text-gray-500">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full text-lg shadow-lg active:scale-95 transition-all max-w-3xl mx-auto block">
                    Checkout
                </button>
            </div>
        </main>
    );
};

export default Cart;
