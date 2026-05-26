export enum ActivityType {
  CREATE_LISTING = 'CREATE_LISTING',
  DELETE_LISTING = 'DELETE_LISTING',
  EDIT_LISTING = 'EDIT_LISTING',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  SOLD_LISTING = 'SOLD_LISTING',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED'
}

export interface RecentActivityItem {
  id: string | number;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO format string
}