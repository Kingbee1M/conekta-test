import { apiSlice } from '@/lib/api';
import { PaginatedListerResponse, FetchListersQueryParams } from './types/listerTypes';

export const listerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListers: builder.query<PaginatedListerResponse, FetchListersQueryParams | void>({
      query: (params) => ({
        url: '/admin/listers/',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }),
      providesTags: ['adminListers'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetListersQuery, useLazyGetListersQuery } = listerApiSlice;