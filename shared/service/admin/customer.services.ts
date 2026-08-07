import { apiSlice } from '@/lib/api';
import { 
  PaginatedCustomerResponse, 
  FetchCustomersQueryParams, 
  CustomerProfile 
} from './types/customerTypes';

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
    getCustomerByUuid: builder.query<CustomerProfile, string>({
      query: (uuid) => ({
        url: `/admin/customers/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (result, error, uuid) => [{ type: 'adminCustomer', id: uuid }],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetCustomersQuery, 
  useLazyGetCustomersQuery,
  useGetCustomerByUuidQuery,
  useLazyGetCustomerByUuidQuery,
} = customerApiSlice;