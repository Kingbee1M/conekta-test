import { apiSlice } from '@/lib/api';
import {
  AdminListingsResponse,
  AdminListingsQueryParams,
} from './types/listingTypes';

export const listingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<AdminListingsResponse, AdminListingsQueryParams | void>({
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
      providesTags: ['adminListing'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetListingsQuery, useLazyGetListingsQuery } = listingApiSlice;