export type CategoryType = 
  | 'electronics' 
  | 'cyber-fashion' 
  | 'precision-living' 
  | 'audio' 
  | 'vault-exclusives';

export interface ProductSpec {
  category: string;
  title: string;
  description: string;
  metric?: string;
}

export interface ProductFinish {
  name: string;
  label: string;
  swatchGradient: string;
  finishType: string;
}

export interface ProductSize {
  caliber: string;
  name: string;
  wristRange: string;
  priceDelta: number;
}

export interface ProductGalleryImage {
  id: string;
  label: string;
  url: string;
  alt: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  atelier: string;
  category: CategoryType;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stockCount: number;
  inStock: boolean;
  isPreorder?: boolean;
  isVaultPrivilege?: boolean;
  badge?: string;
  badgeClass?: string;
  discountPercent?: number;
  image: string;
  images?: ProductGalleryImage[];
  description: string;
  tagline?: string;
  finishes?: ProductFinish[];
  sizes?: ProductSize[];
  specs?: ProductSpec[];
  reviews?: ReviewItem[];
  hardwareFeatures?: {
    processor: string;
    waterIntegrity: string;
    battery: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedFinish: string;
  selectedSize: string;
  unitPrice: number;
}

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  minRating: number;
  inStockOnly: boolean;
  preorder2027Only: boolean;
  vaultPrivilegeOnly: boolean;
  sortBy: 'featured' | 'price-desc' | 'price-asc' | 'top-rated' | 'newest';
  viewMode: 'grid-4' | 'grid-2' | 'list';
}

export interface BundleItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  selected: boolean;
  isMain?: boolean;
}

export interface OrderDetails {
  orderId: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: 'white-glove' | 'armored-air';
  paymentMethod: 'apple-pay' | 'google-pay' | 'crypto-vault' | 'card';
  total: number;
}
