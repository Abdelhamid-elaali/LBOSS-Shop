import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { CartItem, Coupon, Product } from '../../types';
import { calculateOriginalPrice } from '../../lib/utils';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BOSS10',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% off your entire order',
  },
  {
    code: 'BOSS20',
    discountType: 'percentage',
    discountValue: 20,
    description: '20% off your entire order',
  },
  {
    code: 'FREESHIP',
    discountType: 'shipping',
    discountValue: 100,
    description: 'Free standard shipping on all orders',
  },
  {
    code: 'VIP50',
    discountType: 'fixed',
    discountValue: 50,
    description: '$50 off on orders over $150',
  },
];

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isDrawerOpen: boolean;
}

const STORAGE_KEY = 'lboss_cart_v1';

const getInitialState = (): CartState => {
  let items: CartItem[] = [];
  let appliedCoupon: Coupon | null = null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      items = Array.isArray(parsed.items) ? parsed.items : [];
      appliedCoupon = parsed.appliedCoupon || null;
    }
  } catch {
    // ignore
  }

  return {
    items,
    appliedCoupon,
    isDrawerOpen: false,
  };
};

const persistCart = (state: CartState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      })
    );
  } catch {
    // ignore
  }
};

const initialState: CartState = getInitialState();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      const minQty = product.minimumOrderQuantity || 1;
      const maxStock = product.stock || 999;

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxStock);
        existing.quantity = nextQty;
      } else {
        const initialQty = Math.max(quantity, minQty);
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          originalPrice: calculateOriginalPrice(product.price, product.discountPercentage),
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
          quantity: Math.min(initialQty, maxStock),
          stock: maxStock,
          minimumOrderQuantity: minQty,
          category: product.category,
          brand: product.brand,
        });
      }
      persistCart(state);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistCart(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }
      }
      persistCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      persistCart(state);
    },

    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      const found = AVAILABLE_COUPONS.find((c) => c.code === code);
      if (found) {
        state.appliedCoupon = found;
        persistCart(state);
      }
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      persistCart(state);
    },

    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    setCartDrawer: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  toggleCartDrawer,
  setCartDrawer,
} = cartSlice.actions;

// Selectors
export const selectCartState = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectAppliedCoupon = (state: RootState) => state.cart.appliedCoupon;
export const selectIsCartDrawerOpen = (state: RootState) => state.cart.isDrawerOpen;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  Number(
    items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  )
);

export const selectCartOriginalSubtotal = createSelector([selectCartItems], (items) =>
  Number(
    items
      .reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
      .toFixed(2)
  )
);

export const selectCartProductSavings = createSelector(
  [selectCartOriginalSubtotal, selectCartSubtotal],
  (orig, current) => Number(Math.max(0, orig - current).toFixed(2))
);

export const selectCartDiscountSavings = selectCartProductSavings;

export const selectCartCouponDiscount = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (!coupon || subtotal <= 0) return 0;
    if (coupon.discountType === 'percentage') {
      return Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
    }
    if (coupon.discountType === 'fixed') {
      return Number(Math.min(coupon.discountValue, subtotal).toFixed(2));
    }
    return 0;
  }
);

export const selectCartBaseShipping = createSelector([selectCartSubtotal], (subtotal) => {
  if (subtotal <= 0) return 0;
  // Free shipping on orders over $100
  return subtotal >= 100 ? 0 : 9.99;
});

export const selectCartShipping = createSelector(
  [selectCartBaseShipping, selectAppliedCoupon],
  (baseShipping, coupon) => {
    if (coupon?.discountType === 'shipping') return 0;
    return baseShipping;
  }
);

export const selectCartTax = createSelector([selectCartSubtotal, selectCartCouponDiscount], (subtotal, couponDiscount) => {
  const taxable = Math.max(0, subtotal - couponDiscount);
  return Number((taxable * 0.08).toFixed(2)); // 8% estimated tax
});

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartCouponDiscount, selectCartShipping, selectCartTax],
  (subtotal, couponDiscount, shipping, tax) => {
    if (subtotal <= 0) return 0;
    const finalVal = Math.max(0, subtotal - couponDiscount) + shipping + tax;
    return Number(finalVal.toFixed(2));
  }
);

export default cartSlice.reducer;
