import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Product, CartItem, FilterState } from '../types';
import { ALL_PRODUCTS, APEX_CHRONO_X1 } from '../data/mockData';
import { calculateCartTotals, CartTotals, KNOWN_VOUCHERS } from '../utils/shopLogic';

export type ScreenType = 'home' | 'catalog' | 'product' | 'cart';

interface ShopContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedProductId: string;
  selectedProduct: Product;
  viewProduct: (productId: string) => void;
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, finish?: string, size?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  saveForLater: (itemId: string) => void;
  savedItems: CartItem[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  appliedVoucher: string;
  applyVoucher: (code: string) => { success: boolean; message: string };
  hasGiftBox: boolean;
  setHasGiftBox: (val: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  cartTotals: CartTotals;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isKeynoteModalOpen: boolean;
  setIsKeynoteModalOpen: (open: boolean) => void;
  isConciergeChatOpen: boolean;
  setIsConciergeChatOpen: (open: boolean) => void;
  currency: string;
  setCurrency: (c: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  openCategory: (catId: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedCategories: ['electronics'],
  minPrice: 500,
  maxPrice: 3500,
  selectedBrands: ['LBOSS LABS'],
  minRating: 4.0,
  inStockOnly: true,
  preorder2027Only: false,
  vaultPrivilegeOnly: true,
  sortBy: 'featured',
  viewMode: 'grid-4',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('apex-chrono-x1');

  // Initial cart items matching the official reference screenshot
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-watch',
      product: APEX_CHRONO_X1,
      quantity: 1,
      selectedFinish: 'Raw Titanium',
      selectedSize: '44mm Beryllium Chassis',
      unitPrice: 2499,
    },
    {
      id: 'cart-init-headset',
      product: ALL_PRODUCTS.find((p) => p.id === 'obsidian-spatial-pro') || ALL_PRODUCTS[1],
      quantity: 1,
      selectedFinish: 'Carbon Black',
      selectedSize: 'Standard',
      unitPrice: 890,
    },
  ]);

  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([
    'apex-chrono-x1',
    'cyberdeck-16',
    'obsidian-spatial-pro',
  ]);
  const [voucherCode, setVoucherCode] = useState<string>('BOSS2027');
  const [appliedVoucher, setAppliedVoucher] = useState<string>('BOSS2027');
  const [hasGiftBox, setHasGiftBox] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isKeynoteModalOpen, setIsKeynoteModalOpen] = useState<boolean>(false);
  const [isConciergeChatOpen, setIsConciergeChatOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    return ALL_PRODUCTS.find((p) => p.id === selectedProductId) || APEX_CHRONO_X1;
  }, [selectedProductId]);

  const cartTotals = useMemo(() => {
    return calculateCartTotals(cartItems, appliedVoucher, hasGiftBox);
  }, [cartItems, appliedVoucher, hasGiftBox]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const viewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentScreen('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (catId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: [catId],
    }));
    setCurrentScreen('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity: number = 1, finish?: string, size?: string) => {
    const finalFinish = finish || product.finishes?.[0]?.name || 'Standard Edition';
    const finalSize = size || product.sizes?.[0]?.name || 'Standard';
    
    // Check if 48mm caliber adds $150
    const sizeDelta = size?.includes('48mm') ? 150 : 0;
    const unitPrice = product.price + sizeDelta;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedFinish === finalFinish &&
          item.selectedSize === finalSize
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity = Math.min(product.stockCount, copy[existingIndex].quantity + quantity);
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            product,
            quantity,
            selectedFinish: finalFinish,
            selectedSize: finalSize,
            unitPrice,
          },
        ];
      }
    });

    showToast(`Secured ${product.name} to Vault Allocation`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(item.product.stockCount, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    const target = cartItems.find((i) => i.id === itemId);
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    if (target) {
      showToast(`Removed ${target.product.name} from Allocation`);
    }
  };

  const saveForLater = (itemId: string) => {
    const target = cartItems.find((i) => i.id === itemId);
    if (target) {
      setSavedItems((prev) => [...prev, target]);
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast(`Moved ${target.product.name} to Saved Vault`);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Vault Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Vault Wishlist');
        return [...prev, productId];
      }
    });
  };

  const applyVoucher = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (KNOWN_VOUCHERS[upper]) {
      setAppliedVoucher(upper);
      showToast(`Voucher ${upper} applied: -$${KNOWN_VOUCHERS[upper].discount}.00`);
      return { success: true, message: KNOWN_VOUCHERS[upper].label };
    } else {
      showToast('Invalid encrypted terminal voucher code');
      return { success: false, message: 'Invalid code. Try BOSS2027 or VIP200' };
    }
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategories: ['all'],
      minPrice: 0,
      maxPrice: 6000,
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
      preorder2027Only: false,
      vaultPrivilegeOnly: false,
      sortBy: 'featured',
      viewMode: 'grid-4',
    });
    showToast('Telemetry criteria reset');
  };

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ShopContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedProductId,
        selectedProduct,
        viewProduct,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        savedItems,
        wishlist,
        toggleWishlist,
        voucherCode,
        setVoucherCode,
        appliedVoucher,
        applyVoucher,
        hasGiftBox,
        setHasGiftBox,
        filters,
        setFilters,
        resetFilters,
        cartTotals,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isKeynoteModalOpen,
        setIsKeynoteModalOpen,
        isConciergeChatOpen,
        setIsConciergeChatOpen,
        currency,
        setCurrency,
        toastMessage,
        showToast,
        openCategory,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
