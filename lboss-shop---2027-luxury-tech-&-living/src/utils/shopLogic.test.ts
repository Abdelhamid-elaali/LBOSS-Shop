import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, filterProducts, calculateBundleTotal, formatCurrency } from './shopLogic';
import { Product, CartItem, FilterState, BundleItem } from '../types';

const mockProduct: Product = {
  id: 'watch-1',
  name: 'Apex Chrono X-1 Neural Titanium',
  sku: 'LB-APX-TI27',
  atelier: 'LBOSS LABS',
  category: 'electronics',
  categoryLabel: 'Electronics',
  price: 2499,
  originalPrice: 2899,
  rating: 4.9,
  reviewCount: 128,
  stockCount: 3,
  inStock: true,
  isVaultPrivilege: true,
  image: 'https://example.com/watch.png',
  description: 'Test watch description',
};

const mockHeadphones: Product = {
  id: 'headphone-1',
  name: 'Obsidian Spatial Pro Headset',
  sku: 'AE-OBS-81',
  atelier: 'AETHER ACOUSTICS',
  category: 'audio',
  categoryLabel: 'Audio',
  price: 890,
  rating: 5.0,
  reviewCount: 64,
  stockCount: 15,
  inStock: true,
  image: 'https://example.com/headphones.png',
  description: 'Test headphones description',
};

test('calculateCartTotals calculates accurate subtotal and discount with BOSS2027 voucher', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      product: mockProduct,
      quantity: 1,
      selectedFinish: 'Raw Titanium',
      selectedSize: '44mm',
      unitPrice: 2499,
    },
    {
      id: 'item-2',
      product: mockHeadphones,
      quantity: 1,
      selectedFinish: 'Carbon Black',
      selectedSize: 'Standard',
      unitPrice: 890,
    },
  ];

  // Subtotal = 2499 + 890 = 3389
  // BOSS2027 discount = 150
  // Shipping = FREE (orders > 500)
  // Tax = 181
  // Final = 3389 - 150 + 181 = 3420
  const totals = calculateCartTotals(items, 'BOSS2027', true);

  assert.equal(totals.subtotal, 3389);
  assert.equal(totals.discount, 150);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.tax, 181);
  assert.equal(totals.finalTotal, 3420);
  assert.equal(totals.itemCount, 2);
});

test('calculateCartTotals handles empty cart gracefully', () => {
  const totals = calculateCartTotals([], 'BOSS2027', false);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.finalTotal, 0);
  assert.equal(totals.itemCount, 0);
});

test('filterProducts filters by search query and category', () => {
  const products: Product[] = [mockProduct, mockHeadphones];
  
  const filterCat: FilterState = {
    searchQuery: '',
    selectedCategories: ['audio'],
    minPrice: 0,
    maxPrice: 5000,
    selectedBrands: [],
    minRating: 0,
    inStockOnly: false,
    preorder2027Only: false,
    vaultPrivilegeOnly: false,
    sortBy: 'featured',
    viewMode: 'grid-4',
  };

  const results = filterProducts(products, filterCat);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'headphone-1');

  const filterQuery: FilterState = {
    ...filterCat,
    selectedCategories: [],
    searchQuery: 'Chrono',
  };

  const queryResults = filterProducts(products, filterQuery);
  assert.equal(queryResults.length, 1);
  assert.equal(queryResults[0].id, 'watch-1');
});

test('calculateBundleTotal correctly sums items and savings', () => {
  const bundleItems: BundleItem[] = [
    { id: 'b1', name: 'Watch', price: 2499, originalPrice: 2499, image: '', selected: true, isMain: true },
    { id: 'b2', name: 'Dock', price: 280, originalPrice: 280, image: '', selected: true },
    { id: 'b3', name: 'Capsule', price: 10, originalPrice: 190, image: '', selected: true }, // discounted to $10 in kit, total 2789 vs 2969
  ];

  const bundle = calculateBundleTotal(bundleItems);
  assert.equal(bundle.totalPrice, 2789);
  assert.equal(bundle.totalOriginal, 2969);
  assert.equal(bundle.savings, 180);
});

test('formatCurrency formats dollars and cents accurately', () => {
  assert.equal(formatCurrency(2499), '$2,499.00');
  assert.equal(formatCurrency(3420.5), '$3,420.50');
  assert.equal(formatCurrency(2499, false), '$2,499');
});
