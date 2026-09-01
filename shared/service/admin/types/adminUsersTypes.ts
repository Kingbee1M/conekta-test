import { RoleEnum } from '@/shared/enums/roles.enum';

export interface AdminUsersSummary {
  super_admins: number;
  admins: number;
  invited: number;
  inactive: number;
}

/**
 * Item structure returned in the paginated list endpoint (used for table rendering)
 */
export interface AdminUserListItem {
  profile_uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  created_at: string;
}

/**
 * Full profile structure returned for a single employee endpoint
 */
export interface AdminUserDetail {
  profile_uuid: string;
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
  ref_no: string;
  role: string | RoleEnum;
  created_at: string;
  updated_at: string;
  active_status: 'active' | 'inactive' | string;
}

// Alias for backwards compatibility
export type AdminUser = AdminUserDetail;

/**
 * Payload required to create a new employee/admin account
 */
export interface CreateAdminUserPayload {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  role: RoleEnum | string;
  password?: string;
  date_of_birth?: string;
  nationality?: string;
  country?: string;
  state?: string;
  lga?: string;
  address?: string;
  postal_code?: string;
}

/**
 * Paginated response data wrapper containing list results and summary metrics
 */
export interface PaginatedAdminUserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUserListItem[];
  summary: AdminUsersSummary;
}

/**
 * Generic API envelope wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Response types for API calls
 */
export type AdminUsersListApiResponse = ApiResponse<PaginatedAdminUserResponse>;
export type AdminUserDetailApiResponse = ApiResponse<AdminUserDetail>;
export type CreateAdminUserApiResponse = ApiResponse<AdminUserDetail>;

/**
 * Query parameters for fetching employee lists
 */
export interface FetchAdminUsersQueryParams {
  page?: number;
  page_size?: number;
}