import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productsService from './productsService';

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, thunkAPI) => {
        try {
            return await productsService.getProducts();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Normalize: API returns an array, but if it has a specific wrapper we tackle it here.
                // Assuming the dummyjson custom endpoint returns a flat array or { products: [] }
                // We will inspect the data structure. Based on usual DummyJSON, it might be { products: [...] } but the user provided a custom endpoint "c/..." which often returns exactly what was saved.
                // We will assume it's the data array for now.
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectAllProducts = (state) => state.products.items;
export const selectProductStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;
export const selectProductById = (state, productId) =>
    state.products.items.find((product) => product.id === productId);

export default productsSlice.reducer;
