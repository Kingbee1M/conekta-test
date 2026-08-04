import { apiSlice } from '@/lib/api';
import { PaginatedListingList } from './customerTypes';

export interface FetchCustomerListingsQueryParams {
  amenities?: string;
  bathrooms?: number;
  bedrooms?: number;
  category?: string;
  lga?: string;
  max_price?: number;
  min_price?: number;
  page?: number;
  page_size?: number;
  payment_frequency?: string;
  purpose?: string;
  search?: string;
  state?: string;
}

export const customerListingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerListings: builder.query<
      PaginatedListingList,
      FetchCustomerListingsQueryParams | void
    >({
      query: (params) => ({
        url: '/listings/',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
          ...(params?.amenities && { amenities: params.amenities }),
          ...(params?.bathrooms !== undefined && { bathrooms: params.bathrooms }),
          ...(params?.bedrooms !== undefined && { bedrooms: params.bedrooms }),
          ...(params?.category && { category: params.category }),
          ...(params?.lga && { lga: params.lga }),
          ...(params?.max_price !== undefined && { max_price: params.max_price }),
          ...(params?.min_price !== undefined && { min_price: params.min_price }),
          ...(params?.payment_frequency && { payment_frequency: params.payment_frequency }),
          ...(params?.purpose && { purpose: params.purpose }),
          ...(params?.search && { search: params.search }),
          ...(params?.state && { state: params.state }),
        },
      }),
      transformResponse: (response: PaginatedListingList) => {
        return response;
      },
      providesTags: ['CustomerListings'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetCustomerListingsQuery, useLazyGetCustomerListingsQuery } =
  customerListingApiSlice;