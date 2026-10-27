export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  phone?: string;
  address?: UserAddress;
  company?: {
    name: string;
    title: string;
    department: string;
  };
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

// Cart types
export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;
  stock: number;
  minimumOrderQuantity: number;
  category: string;
  brand?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number; // e.g. 10 for 10%
  description: string;
}

export interface ShippingAddressInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type DeliveryMethod = 'standard' | 'express' | 'overnight';

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddressInput;
  deliveryMethod: DeliveryMethod;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Confirmed';
}

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc'
  | 'discount-desc';

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  inStockOnly?: boolean;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}
