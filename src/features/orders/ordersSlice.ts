import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Order } from '../../types';

interface OrdersState {
  orders: Order[];
}

const STORAGE_KEY = 'lboss_orders_v1';

const getInitialState = (): OrdersState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const orders = JSON.parse(stored);
      if (Array.isArray(orders)) {
        return { orders };
      }
    }
  } catch {
    // ignore
  }
  return { orders: [] };
};

const persistOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
};

const initialState: OrdersState = getInitialState();

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      persistOrders(state.orders);
    },
    clearOrders: (state) => {
      state.orders = [];
      persistOrders([]);
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderById = (id: string) => (state: RootState) =>
  state.orders.orders.find((o) => o.id === id || o.orderNumber === id);

export default ordersSlice.reducer;
