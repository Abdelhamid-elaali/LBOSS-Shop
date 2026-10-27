import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  CurrencyInfo,
  SUPPORTED_CURRENCIES,
  detectLocalCurrency,
} from '../../lib/currencies';
import { setActiveCurrencyCode } from '../../lib/utils';

type ThemeMode = 'dark' | 'light';

interface UIState {
  theme: ThemeMode;
  currency: CurrencyInfo;
  searchQuery: string;
  isMobileNavOpen: boolean;
  quickViewProductId: number | null;
  isCurrencySelectorOpen: boolean;
}

const THEME_STORAGE_KEY = 'lboss_theme_mode';
const CURRENCY_STORAGE_KEY = 'lboss_currency_v1';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'dark';
};

const getInitialCurrency = (): CurrencyInfo => {
  if (typeof window === 'undefined') return SUPPORTED_CURRENCIES.USD;
  try {
    const savedCode = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (savedCode && SUPPORTED_CURRENCIES[savedCode]) {
      return SUPPORTED_CURRENCIES[savedCode];
    }
  } catch {
    // ignore
  }
  return SUPPORTED_CURRENCIES.USD;
};

const initialTheme = getInitialTheme();
const initialCurrency = getInitialCurrency();

// Apply initial state
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  setActiveCurrencyCode(initialCurrency.code);
}

const initialState: UIState = {
  theme: initialTheme,
  currency: initialCurrency,
  searchQuery: '',
  isMobileNavOpen: false,
  quickViewProductId: null,
  isCurrencySelectorOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // ignore
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // ignore
      }
    },
    setCurrencyByCode: (state, action: PayloadAction<string>) => {
      const info = SUPPORTED_CURRENCIES[action.payload] || SUPPORTED_CURRENCIES.USD;
      state.currency = info;
      setActiveCurrencyCode(info.code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, info.code);
      } catch {
        // ignore
      }
    },
    autoDetectLocationCurrency: (state) => {
      const detected = detectLocalCurrency();
      state.currency = detected;
      setActiveCurrencyCode(detected.code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, detected.code);
      } catch {
        // ignore
      }
    },
    setCurrencySelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.isCurrencySelectorOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleMobileNav: (state) => {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    setMobileNav: (state, action: PayloadAction<boolean>) => {
      state.isMobileNavOpen = action.payload;
    },
    setQuickViewProductId: (state, action: PayloadAction<number | null>) => {
      state.quickViewProductId = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setCurrencyByCode,
  autoDetectLocationCurrency,
  setCurrencySelectorOpen,
  setSearchQuery,
  toggleMobileNav,
  setMobileNav,
  setQuickViewProductId,
} = uiSlice.actions;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectCurrency = (state: RootState) => state.ui.currency;
export const selectIsCurrencySelectorOpen = (state: RootState) => state.ui.isCurrencySelectorOpen;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
export const selectIsMobileNavOpen = (state: RootState) => state.ui.isMobileNavOpen;
export const selectQuickViewProductId = (state: RootState) => state.ui.quickViewProductId;

export default uiSlice.reducer;
