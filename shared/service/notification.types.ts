export interface NotificationDataPayload {
  application_uuid?: string;
  offer_uuid?: string;
  lease_uuid?: string;
  listing_uuid?: string;
  kyc_profile_uuid?: string;
  submission_uuid?: string;
  ref_no?: string;
  status?: string;
  approval_status?: string;
  requirement?: string;
  role?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  uuid: string;
  type: 'system' | 'application' | 'offer' | 'lease' | 'listing' | 'kyc' | 'account' | 'comment' | string;
  title: string;
  message: string;
  data: NotificationDataPayload | string;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedNotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  updated: number;
}

export interface GetNotificationsParams {
  page?: number;
  page_size?: number;
  unread?: boolean;
}
