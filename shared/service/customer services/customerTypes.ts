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
}

export interface ListingResult {
  uuid: string;
  title: string;
  ref_no: string;
  currency: string;
  base_price: string;
  payment_frequency: string;
  property_info: ListingPropertyInfo;
  location: ListingLocation;
  average_rating: number;
  cover_image: string;
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