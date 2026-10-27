import { CartItem, Product, FilterState, BundleItem } from '../types';

export const KNOWN_VOUCHERS: Record<string, { discount: number; label: string }> = {
  BOSS2027: {
    discount: 150,
    label: 'Executive VIP allocation rebate unlocked',
  },
  VIP200: {
    discount: 200,
    label: 'Inner Sovereign Network welcome voucher',
  },
  KEYNOTE10: {
    discount: 250,
    label: '2027 Executive Keynote attendee credit',
  },
};

export interface CartTotals {
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  shipping: number;
  tax: number;
  finalTotal: number;
  itemCount: number;
}

/**
 * Calculates financial telemetry for the user's cart
 */
export function calculateCartTotals(
  items: CartItem[],
  voucherCode: string = '',
  hasGiftBox: boolean = true
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const cleanCode = voucherCode.trim().toUpperCase();
  const voucherInfo = KNOWN_VOUCHERS[cleanCode];
  const discount = voucherInfo ? voucherInfo.discount : 0;
  const discountLabel = voucherInfo ? voucherInfo.label : null;

  // Armored White-Glove transit is complimentary on luxury orders over $500
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 75;

  // Luxury duty & regional escrow tax calculation
  const tax = subtotal > 0 ? 181.0 : 0;

  const finalTotal = subtotal > 0 ? Math.max(0, subtotal - discount + shipping + tax) : 0;

  return {
    subtotal,
    discount,
    discountLabel,
    shipping,
    tax,
    finalTotal,
    itemCount,
  };
}

/**
 * Filters and sorts products according to current active telemetry criteria
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products
    .filter((prod) => {
      // Search term
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesSku = prod.sku.toLowerCase().includes(query);
        const matchesBrand = prod.atelier.toLowerCase().includes(query);
        const matchesCat = prod.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesCat) {
          return false;
        }
      }

      // Categories
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes('all')) {
        if (!filters.selectedCategories.includes(prod.category)) {
          return false;
        }
      }

      // Price Range
      if (prod.price < filters.minPrice || prod.price > filters.maxPrice) {
        return false;
      }

      // Atelier / Brand
      if (filters.selectedBrands.length > 0) {
        if (!filters.selectedBrands.includes(prod.atelier)) {
          return false;
        }
      }

      // Rating
      if (filters.minRating > 0 && prod.rating < filters.minRating) {
        return false;
      }

      // Availability
      if (filters.inStockOnly && !prod.inStock) {
        return false;
      }
      if (filters.preorder2027Only && !prod.isPreorder) {
        return false;
      }
      if (filters.vaultPrivilegeOnly && !prod.isVaultPrivilege) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'top-rated':
          return b.rating - a.rating;
        case 'newest':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'featured':
        default:
          return 0; // maintain curated ordering
      }
    });
}

/**
 * Computes ecosystem pairing bundle pricing and savings
 */
export function calculateBundleTotal(items: BundleItem[]): {
  totalPrice: number;
  totalOriginal: number;
  savings: number;
  selectedCount: number;
} {
  const selectedItems = items.filter((i) => i.selected);
  const totalPrice = selectedItems.reduce((acc, i) => acc + i.price, 0);
  const totalOriginal = selectedItems.reduce((acc, i) => acc + i.originalPrice, 0);
  const savings = Math.max(0, totalOriginal - totalPrice);

  return {
    totalPrice,
    totalOriginal,
    savings,
    selectedCount: selectedItems.length,
  };
}

/**
 * Formats standard USD with currency symbol and commas
 */
export function formatCurrency(amount: number, showCents: boolean = true): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  })}`;
}
