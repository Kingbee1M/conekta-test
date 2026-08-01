export interface ListerProfile {
  uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  nationality?: string;
  country?: string;
  state?: string;
  lga?: string;
  address?: string;
  postal_code?: string;
  active_status: 'active' | 'inactive' | 'suspended' | string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedListerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListerProfile[];
}

export interface FetchListersQueryParams {
  page?: number;
  page_size?: number;
}