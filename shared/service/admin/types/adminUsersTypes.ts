export interface AdminUser {
  uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  date_of_birth: string | null;
  nationality: string;
  country: string;
  state: string;
  lga: string;
  address: string;
  postal_code: string;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedAdminUserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// Full Response Envelope wrapping the paginated data
export type AdminUserApiResponse = ApiResponse<PaginatedAdminUserResponse>;

export interface FetchAdminUsersQueryParams {
  page?: number;
  page_size?: number;
}