// --------------
export interface ListingPropertyInfo {
  bedrooms: number;
  bathrooms: number;
  structure: string;
}

export interface ListingLocation {
  street: string;
  city: string;
  state: string;
  lga: string;
  country: string;
}

export interface AllListingResult {
  uuid: string;
  title: string;
  ref_no: string;
  currency: string;
  base_price: string;
  payment_frequency: string;
  property_info: ListingPropertyInfo;
  location: ListingLocation;
  average_rating: number;
  likes_count: number;
  cover_image: string;
}


//-----------


export interface ListingPropertyInfo {
  bedrooms: number;
  bathrooms: number;
  structure: string;
}

export interface ListingLocation {
  street: string;
  city: string;
  state: string;
  lga: string;
  country: string;
  longitude: number;
  latitude: number;
}

export interface ListingFee {
  fee: string;
  frequency: string;
  fee_type: string;
}

export interface ListingMediaItem {
  name: string;
  media_type: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ListingDetail {
  uuid: string;
  title: string;
  description: string;
  published_at: string;
  ref_no: string;
  purpose: string;
  property_info: ListingPropertyInfo;
  location: ListingLocation;
  fees: ListingFee[];
  base_price: string;
  payment_frequency: string;
  verification_status: string;
  approval_status: string;
  listing_status: string;
  media: ListingMediaItem[];
  amenities: string[];
  average_rating: number;
  ratings_count: number;
  comments_count: number;
  likes_count: number;
  user_rating: number;
  is_liked: boolean;
  is_saved: boolean;
}



//************ */
export interface ListingPaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  results: AllListingResult[];
}

export interface PaginatedListingList {
  code: number;
  data: ListingPaginationData;
  message: string;
  success: boolean;
  timestamp: string;
}

/** Flat response used by some customer listing endpoints and older clients. */
export interface FlatListingPaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  results: AllListingResult[];
}

export interface FlatPaginatedListingList extends FlatListingPaginationData {
  message?: string;
  data?: FlatListingPaginationData | AllListingResult[];
}

export type CustomerListingsResponse =
  | PaginatedListingList
  | FlatPaginatedListingList
  | AllListingResult[];

// Interface for query params to pass filters into the API
export interface GetCustomerListingsParams {
  page?: number;
  state?: string;
  lga?: string;
  structure?: string;
  max_price?: number | string;
  search?: string;
}

export interface Message {
  id: string;
  sender: 'tenant' | 'landlord' | 'neighbor';
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

import { PaymentFrequencyEnum } from "@/shared/enums/paymentFreqency.enums";

export interface TenantData {
  address: string;
  roomNumber: string;
  landlord: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastActive: string;
  };
  billing: {
    rentAmount: number;
    currency: string;
    frequency: PaymentFrequencyEnum;
    dueDate: string;
    daysRemaining: number;
    totalTenancyDays: number;
    elapsedTenancyDays: number;
  };
  neighbors: Array<{
    id: string;
    name: string;
    room: string;
    avatar: string;
    isRoommate: boolean;
  }>;
}

export interface MaintenanceTicket {
  id: string;
  service: string;
  description: string;
  status: string;
  date: string;
  icon: React.ReactNode;
}
