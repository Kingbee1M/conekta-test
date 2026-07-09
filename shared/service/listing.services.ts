import { apiSlice } from '@/lib/api';
import { PaginatedListingList, Listing } from '@/types';

export interface PaymentOption {
  price: number;
  [key: string]: unknown;
}

export interface FeeOption {
  name: string;
  amount: number;
  [key: string]: unknown;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  purpose: string;
  property_type: string;
  category: string;
  street: string;
  city: string;
  zip_code: string;
  state: string;
  lga: string;
  structure: string;
  currency: string;
  primary_image_index: number;
  images: string[];
  payment_options: PaymentOption[];
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parking_spaces?: number;
  fees?: FeeOption[];  
  square_meters?: string;
}

export const listingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<PaginatedListingList, { page?: number; search?: string } | void>({
      query: (params) => ({
        url: '/listings/',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ uuid }) => ({ type: 'Listing' as const, id: uuid })),
              { type: 'Listing', id: 'LIST' },
            ]
          : [{ type: 'Listing', id: 'LIST' }],
    }),

    getListingByUuid: builder.query<Listing, string>({
      query: (uuid) => ({
        url: `/listings/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, uuid) => [{ type: 'Listing', id: uuid }],
    }),

    createListing: builder.mutation<Listing, CreateListingPayload>({
      query: (body) => ({
        url: '/listings/me/',
        method: 'POST',
        body,
      }),
      // Automatically invalidates the main cache list so the UI gets fresh data
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetListingsQuery, 
  useGetListingByUuidQuery,
  useCreateListingMutation 
} = listingApi;