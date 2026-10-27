import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import type {
  Product,
  ProductsResponse,
  ProductCategory,
  AuthResponse,
  LoginCredentials,
  User,
} from '../../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Auth', 'User', 'Cart'],
  endpoints: (builder) => ({
    // Get paginated products with optional sort & select fields
    getProducts: builder.query<
      ProductsResponse,
      { limit?: number; skip?: number; sortBy?: string; order?: 'asc' | 'desc'; select?: string }
    >({
      query: ({ limit = 12, skip = 0, sortBy, order, select }) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (sortBy) params.append('sortBy', sortBy);
        if (order) params.append('order', order);
        if (select) params.append('select', select);
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Search products with query
    searchProducts: builder.query<
      ProductsResponse,
      { q: string; limit?: number; skip?: number; sortBy?: string; order?: 'asc' | 'desc' }
    >({
      query: ({ q, limit = 12, skip = 0, sortBy, order }) => {
        const params = new URLSearchParams();
        params.append('q', q);
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (sortBy) params.append('sortBy', sortBy);
        if (order) params.append('order', order);
        return `/products/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'SEARCH' },
            ]
          : [{ type: 'Product', id: 'SEARCH' }],
    }),

    // Get single product details
    getProductById: builder.query<Product, number | string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id: Number(id) }],
    }),

    // Get all categories
    getCategories: builder.query<ProductCategory[], void>({
      query: () => `/products/categories`,
      providesTags: ['Category'],
    }),

    // Get products by category slug
    getProductsByCategory: builder.query<
      ProductsResponse,
      { category: string; limit?: number; skip?: number; sortBy?: string; order?: 'asc' | 'desc' }
    >({
      query: ({ category, limit = 12, skip = 0, sortBy, order }) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (sortBy) params.append('sortBy', sortBy);
        if (order) params.append('order', order);
        return `/products/category/${encodeURIComponent(category)}?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'CATEGORY' },
            ]
          : [{ type: 'Product', id: 'CATEGORY' }],
    }),

    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          username: credentials.username,
          password: credentials.password,
          expiresInMins: credentials.expiresInMins || 60,
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Simulated checkout endpoint: DummyJSON POST /carts/add
    simulateCheckout: builder.mutation<
      any,
      { userId: number; products: { id: number; quantity: number }[] }
    >({
      query: (body) => ({
        url: '/carts/add',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useLoginMutation,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useSimulateCheckoutMutation,
} = apiSlice;
