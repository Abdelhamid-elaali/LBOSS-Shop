import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SUPPORTED_CURRENCIES } from './currencies';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Current active currency cache for backward-compatible formatPrice calls
let activeCurrencyCode = 'USD';

export function setActiveCurrencyCode(code: string) {
  if (SUPPORTED_CURRENCIES[code]) {
    activeCurrencyCode = code;
  }
}

export function getActiveCurrencyCode(): string {
  return activeCurrencyCode;
}

export function formatPrice(
  usdPrice: number,
  currencyCode?: string,
  exchangeRate?: number
): string {
  const code = (currencyCode || activeCurrencyCode || 'USD').toUpperCase();
  const info = SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.USD;
  const rate = exchangeRate !== undefined ? exchangeRate : info.rate;
  const converted = usdPrice * rate;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: info.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: info.code === 'JPY' ? 0 : 2,
    }).format(converted);
  } catch {
    return `${info.symbol}${converted.toFixed(info.code === 'JPY' ? 0 : 2)}`;
  }
}

export function calculateOriginalPrice(discountedPrice: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) return discountedPrice;
  return Number((discountedPrice / (1 - discountPercentage / 100)).toFixed(2));
}

export function formatDate(dateString: string | number | Date): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}
