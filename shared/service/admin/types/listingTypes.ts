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


// --single listing --

import { purposeType } from '@/shared/enums/purpose.eums';
import { PaymentFrequencyEnum } from '@/shared/enums/paymentFreqency.enums';
import { VerificationStatusEnum } from '@/shared/enums/verification.enums';
import { ListingStatusEnum } from '@/shared/enums/listingStatus.enums';
import { AmenitiesEnum } from '@/shared/enums/amenities.enums';

export interface ListingFee {
  fee: string;
  frequency: string;
  fee_type: string;
}

export interface ListingMedia {
  name: string;
  media_type: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface EmployeeListingDetail {
  uuid: string;
  title: string;
  description: string;
  published_at?: string;
  ref_no: string;
  purpose: purposeType;
  property_info: {
    bedrooms: number;
    bathrooms: number;
    structure: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    lga: string;
    country: string;
  };
  fees: ListingFee[];
  base_price: string;
  payment_frequency: PaymentFrequencyEnum;
  verification_status: VerificationStatusEnum;
  listing_status: ListingStatusEnum;
  media: ListingMedia[];
  amenities: AmenitiesEnum[];
  average_rating: number;
  ratings_count: number;
  comments_count: number;
  user_rating: number;
  lister: {
    uuid: string;
    email: string;
    full_name: string;
  };
}

export interface AdminSingleListingResponse {
  success?: boolean;
  code?: number;
  message?: string;
  data: EmployeeListingDetail;
}