export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number; // exchange rate relative to USD (1.0)
  flag: string;
  country: string;
  region: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    flag: '🇺🇸',
    country: 'United States',
    region: 'North America',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    flag: '🇪🇺',
    country: 'European Union',
    region: 'Europe',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    flag: '🇬🇧',
    country: 'United Kingdom',
    region: 'Europe',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 152.0,
    flag: '🇯🇵',
    country: 'Japan',
    region: 'Asia',
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    rate: 0.88,
    flag: '🇨🇭',
    country: 'Switzerland',
    region: 'Europe',
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    rate: 3.67,
    flag: '🇦🇪',
    country: 'United Arab Emirates',
    region: 'Middle East',
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    rate: 1.38,
    flag: '🇨🇦',
    country: 'Canada',
    region: 'North America',
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.52,
    flag: '🇦🇺',
    country: 'Australia',
    region: 'Oceania',
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    rate: 1.34,
    flag: '🇸🇬',
    country: 'Singapore',
    region: 'Asia',
  },
};

/**
 * Detect location and local currency from user's system timezone and locale
 */
export function detectLocalCurrency(): CurrencyInfo {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
    
    if (tz.includes('london') || tz.includes('belfast') || tz.includes('edinburgh')) {
      return SUPPORTED_CURRENCIES.GBP;
    }
    if (tz.includes('tokyo') || tz.includes('osaka') || tz.includes('japan')) {
      return SUPPORTED_CURRENCIES.JPY;
    }
    if (tz.includes('zurich') || tz.includes('geneva') || tz.includes('bern')) {
      return SUPPORTED_CURRENCIES.CHF;
    }
    if (tz.includes('dubai') || tz.includes('abu_dhabi') || tz.includes('uae')) {
      return SUPPORTED_CURRENCIES.AED;
    }
    if (
      tz.includes('paris') ||
      tz.includes('berlin') ||
      tz.includes('rome') ||
      tz.includes('madrid') ||
      tz.includes('amsterdam') ||
      tz.includes('brussels') ||
      tz.includes('vienna') ||
      tz.includes('athens') ||
      tz.includes('dublin') ||
      tz.includes('helsinki') ||
      tz.includes('lisbon') ||
      tz.includes('stockholm') ||
      tz.includes('copenhagen')
    ) {
      return SUPPORTED_CURRENCIES.EUR;
    }
    if (tz.includes('toronto') || tz.includes('vancouver') || tz.includes('montreal') || tz.includes('edmonton')) {
      return SUPPORTED_CURRENCIES.CAD;
    }
    if (tz.includes('sydney') || tz.includes('melbourne') || tz.includes('brisbane') || tz.includes('perth') || tz.includes('adelaide')) {
      return SUPPORTED_CURRENCIES.AUD;
    }
    if (tz.includes('singapore')) {
      return SUPPORTED_CURRENCIES.SGD;
    }
  } catch {
    // ignore
  }
  return SUPPORTED_CURRENCIES.USD;
}
