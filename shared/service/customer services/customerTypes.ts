export interface ListingPropertyInfo {
  bedrooms: number;
  bathrooms: number;
  structure: string; // Fits your StructureEnum or string
}

export interface ListingLocation {
  street: string;
  city: string;
  state: string;
  lga: string;
  country: string;
  latitude: string
  longitude: string
}

export interface ListingMedia {
  url: string;
  media_type?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ListingResult {
  uuid: string;
  title: string;
  ref_no?: string;
  currency?: string;
  base_price: string;
  payment_frequency: string;
  property_info: ListingPropertyInfo;
  location: ListingLocation;
  average_rating?: number;
  cover_image: string;
  id?: string;
  description?: string;
  category?: string;
  state?: string;
  lga?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  media?: ListingMedia[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListingPaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListingResult[];
}

export interface PaginatedListingList {
  code: number;
  data: ListingPaginationData;
  message: string;
  success: boolean;
  timestamp: string;
}

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
