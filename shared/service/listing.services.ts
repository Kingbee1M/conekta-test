import { apiSlice } from '@/lib/api';
import { PaginatedListingList, Listing } from '@/types';

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
  }),
  overrideExisting: false,
});


export const { 
  useGetListingsQuery, 
  useGetListingByUuidQuery 
} = listingApi;