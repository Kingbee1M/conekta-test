// Query Parameters interface for fetching customer listings
export interface FetchCustomerListingsQueryParams {
  amenities?: string;
  bathrooms?: number;
  bedrooms?: number;
  category?: string;
  lga?: string;
  max_price?: number;
  min_price?: number;
  page?: number;
  page_size?: number;
  payment_frequency?: string;
  purpose?: string;
  search?: string;
  state?: string;
}

// Represents an individual property listing returned for public/customer views
export interface Listing {
  id: string;
  title: string;
  description?: string;
  category?: string;
  purpose?: string; // e.g., 'rent' | 'sale'
  price: number;
  payment_frequency?: string; // e.g., 'yearly' | 'monthly'
  state?: string;
  lga?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; // Fallback for dynamic backend fields
}

// Main Paginated API Response contract for /listings/
export interface PaginatedListingList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
  message?: string;
  data?: {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: Listing[];
  } | Listing[];
}