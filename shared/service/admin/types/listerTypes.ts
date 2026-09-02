// Active status union type
export type ListerActiveStatus = 'active' | 'inactive' | 'suspended' | string;

// 1. Table Item Type (Concise summary record returned in lists/tables)
export interface ListerTableRecord {
  profile_uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  active_status: ListerActiveStatus;
  created_at: string;
}

// 2. Single User Profile Type (Full details returned when fetching by ID/UUID)
export interface ListerProfile {
  profile_uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  country?: string | null;
  state?: string | null;
  lga?: string | null;
  address?: string | null;
  postal_code?: string | null;
  ref_no?: string | null;
  active_status: ListerActiveStatus;
  created_at: string;
  updated_at: string;
}

// 3. API Response Wrappers
export interface PaginatedListerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListerTableRecord[];
}

export interface SingleListerResponse {
  statusCode?: number;
  message?: string;
  data: ListerProfile;
}

// 4. Query & Filter Parameters
export interface FetchListersQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  active_status?: ListerActiveStatus;
  ordering?: string;
}