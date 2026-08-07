import { apiSlice } from '@/lib/api';
import { PaginatedListerResponse, FetchListersQueryParams, ListerProfile } from './types/listerTypes';

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
    getListerByUuid: builder.query<ListerProfile, string>({
      query: (uuid) => ({
        url: `/admin/listers/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, uuid) => [{ type: 'adminListers', id: uuid }],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetListersQuery, 
  useLazyGetListersQuery, 
  useGetListerByUuidQuery, 
  useLazyGetListerByUuidQuery 
} = listerApiSlice;