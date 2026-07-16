import { apiSlice } from '@/lib/api'; // Pointing directly to your central api.ts
import { PaginatedListingList } from './customerTypes';

export const customerListingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This query returns exactly a string (the response.message)
    getCustomerListings: builder.query<string, void>({
      query: () => ({
        url: '/listings/',
        method: 'GET',
      }),
      transformResponse: (response: PaginatedListingList): string => {
        return response.message;
      },
      providesTags: ['CustomerListings'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetCustomerListingsQuery } = customerListingApiSlice;