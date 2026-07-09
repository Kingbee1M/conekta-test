/**
 * Strict Enum for supported currency ISO codes
 */
export enum CurrencyEnum {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  CNY = 'CNY',
  SEK = 'SEK',
  NZD = 'NZD',
}

interface CurrencyDetails {
  label: string;
  symbol: string;
}


export const CURRENCY_MAP: Record<CurrencyEnum, CurrencyDetails> = {
  [CurrencyEnum.NGN]: { label: 'Nigerian Naira', symbol: '₦' },
  [CurrencyEnum.USD]: { label: 'US Dollar', symbol: '$' },
  [CurrencyEnum.EUR]: { label: 'Euro', symbol: '€' },
  [CurrencyEnum.GBP]: { label: 'British Pound', symbol: '£' },
  [CurrencyEnum.JPY]: { label: 'Japanese Yen', symbol: '¥' },
  [CurrencyEnum.AUD]: { label: 'Australian Dollar', symbol: 'A$' },
  [CurrencyEnum.CAD]: { label: 'Canadian Dollar', symbol: 'C$' },
  [CurrencyEnum.CHF]: { label: 'Swiss Franc', symbol: 'CHF' },
  [CurrencyEnum.CNY]: { label: 'Chinese Yuan', symbol: '¥' },
  [CurrencyEnum.SEK]: { label: 'Swedish Krona', symbol: 'kr' },
  [CurrencyEnum.NZD]: { label: 'New Zealand Dollar', symbol: 'NZ$' },
};

/**
 * Array format convenient for populating select options or Combobox components
 * e.g., [{ value: 'NGN', label: 'NGN - Nigerian Naira' }, ...]
 */
export const CURRENCY_OPTIONS = Object.values(CurrencyEnum).map((code) => ({
  value: code,
  label: `${code} - ${CURRENCY_MAP[code].label}`,
  symbol: CURRENCY_MAP[code].symbol,
}));