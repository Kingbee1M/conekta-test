import { StaticImageData } from 'next/image';

export interface signupTypes {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    role: string;
}

export type loginTypes = {
    email: string;
    password: string;
}

export type errorType = {
    error: string;
    success: boolean; // Changed to boolean to match your logic
}

export type usertype = {
    landlord_id: string
    name: string;
    email: string;
    avatar?: string;
    address: string;
    phone: string;
    role: string;  
 }

 export type productType = {
    house_id: string;
    name: string;
    location: string;
    price: number;
    description: string;
    image: string;
    landlord_id: string;
 }

export type userInfoType = {
    user: usertype
    product: productType[]
}

export interface FlatUserData {
  uuid?: string;
  email?: string;
  roles?: string[];
  active_role?: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
}


export type SortOption = 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'Most Popular';

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  rating: number;
  price: number;
  imageUrl: StaticImageData;
  created_at: string
}

// listing slice types

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

// 2. Structural Layout Definition Enum
export enum StructureEnum {
  STUDIO = 'studio',
  FLAT = 'flat',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
  MAISONETTE = 'maisonette',
  BUNGALOW = 'bungalow',
  DETACHED = 'detached',
  SEMI_DETACHED = 'semi_detached',
  TERRACED = 'terraced',
}

// 3. Nested Objects Interfaces
export interface PropertyInfo {
  bedrooms: number | null;
  bathrooms: number | null;
  structure: StructureEnum; // Strict Enum type enforcement
}

export interface PropertyLocation {
  street: string;
  city: string;
  state: number;
  lga: number;
  country: string;
}

// 4. Primary Listing Node Type
export interface Listing {
  uuid: string;
  title: string;
  ref_no: string;
  currency: CurrencyEnum; // Strict Enum type enforcement
  amount: string; // Keep as string for precision decimal representations
  property_info: PropertyInfo;
  location: PropertyLocation;
}

// 5. Complete Root API Paginated List Wrap response
export interface PaginatedListingList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}