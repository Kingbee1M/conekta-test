import { apiSlice } from '@/lib/api';
import {
  AdminListingsResponse,
  AdminListingsQueryParams,
} from './types/listingTypes';
import { AdminSingleListingResponse } from './types/listingTypes';

// --- Single Listing Detail Interfaces ---



// Interface representing the wrapped API response


export const listingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all admin listings
    getAdminListings: builder.query<AdminListingsResponse, AdminListingsQueryParams | void>({
      query: (params) => ({
        url: '/admin/listings/',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
          ...(params?.category && { category: params.category }),
          ...(params?.lister_email && { lister_email: params.lister_email }),
          ...(params?.listing_status && { listing_status: params.listing_status }),
          ...(params?.purpose && { purpose: params.purpose }),
          ...(params?.search && { search: params.search }),
          ...(params?.verification_status && { verification_status: params.verification_status }),
        },
      }),
      transformResponse: (response: AdminListingsResponse) => {
        return response;
      },
      providesTags: ['adminListing'],
    }),

    // Get single listing by UUID (Typed with AdminSingleListingResponse & EmployeeListingDetail)
    getAdminListingByUuid: builder.query<AdminSingleListingResponse, string>({
      query: (uuid) => ({
        url: `/admin/listings/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (result, error, uuid) => [{ type: 'adminListing', id: uuid }],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAdminListingsQuery,
  useLazyGetAdminListingsQuery,
  useGetAdminListingByUuidQuery,
  useLazyGetAdminListingByUuidQuery,
} = listingApiSlice;