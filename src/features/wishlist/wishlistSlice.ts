import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../../types';

interface WishlistState {
  items: Product[];
}

const STORAGE_KEY = 'lboss_wishlist_v1';

const getInitialState = (): WishlistState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const items = JSON.parse(stored);
      if (Array.isArray(items)) {
        return { items };
      }
    }
  } catch {
    // ignore
  }
  return { items: [] };
};

const persistWishlist = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialState: WishlistState = getInitialState();

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
        persistWishlist(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistWishlist(state.items);
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      persistWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      persistWishlist([]);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;
export const selectIsInWishlist = (id: number) => (state: RootState) =>
  state.wishlist.items.some((item) => item.id === id);

export default wishlistSlice.reducer;
