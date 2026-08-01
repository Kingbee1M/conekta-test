import { apiSlice } from '@/lib/api';
import { PaginatedCustomerResponse, FetchCustomersQueryParams } from './types/customerTypes';

export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<PaginatedCustomerResponse, FetchCustomersQueryParams | void>({
      query: (params) => ({
        url: '/admin/customers/',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }),
      providesTags: ['adminCustomer'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetCustomersQuery, useLazyGetCustomersQuery } = customerApiSlice;