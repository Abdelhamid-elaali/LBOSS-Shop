import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.cartItems.push({
                    id: newItem.id,
                    title: newItem.title,
                    price: newItem.price,
                    image: newItem.images ? newItem.images[0] : newItem.image, // Handle different image structures
                    quantity: 1,
                });
            }

            // Recalculate totals
            state.totalQuantity++;
            state.totalAmount += newItem.price;
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
                state.cartItems = state.cartItems.filter((item) => item.id !== id);
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((item) => item.id === id);
            if (item && quantity > 0) {
                const quantityDifference = quantity - item.quantity;
                item.quantity = quantity;
                state.totalQuantity += quantityDifference;
                state.totalAmount += quantityDifference * item.price;
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        }
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
