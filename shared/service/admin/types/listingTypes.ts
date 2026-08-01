export interface PropertyInfo {
  bedrooms?: number;
  bathrooms?: number;
  structure?: string;
}

export interface ListingLocation {
  street?: string;
  city?: string;
  state?: string;
  lga?: string;
  country?: string;
}

export interface ListerInfo {
  uuid: string;
  email: string;
  full_name: string;
}

export interface PropertyListing {
  uuid: string;
  title: string;
  ref_no: string;
  currency: string;
  base_price: string;
  payment_frequency: string;
  property_info: PropertyInfo;
  location: ListingLocation;
  average_rating: number;
  cover_image: string | null;
  lister: ListerInfo;
  listing_status: string;
  verification_status: string;
}

export interface AdminListingsQueryParams {
  page?: number;
  page_size?: number;
  category?: string;
  lister_email?: string;
  listing_status?: string;
  purpose?: string;
  search?: string;
  verification_status?: string;
}

export interface AdminListingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyListing[];
}