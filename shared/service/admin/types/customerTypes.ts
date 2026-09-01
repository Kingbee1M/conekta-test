export interface CustomerProfile {
  profile_uuid: string;
  uuid: string; // mapped from profile_uuid or uuid
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
  ref_no?: string;
  active_status: 'active' | 'inactive' | 'suspended' | string;
  created_at: string;
  updated_at: string;

  // Employment Details
  occupation?: string;
  monthly_income?: number;
  employer_name?: string;
  employer_address?: string;
  employer_phone?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;

  // Guarantor Details
  guarantor_name?: string;
  guarantor_phone?: string;
  guarantor_email?: string;
  guarantor_address?: string;
  guarantor_relationship?: string;
}

export interface tableCustomerProfile {
  profile_uuid: string;
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  active_status: 'active' | 'inactive' | 'suspended' | string;
  created_at: string;
}

export interface PaginatedCustomerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomerProfile[];
}

export interface FetchCustomersQueryParams {
  page?: number;
  page_size?: number;
}