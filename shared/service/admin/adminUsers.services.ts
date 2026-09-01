import { apiSlice } from '@/lib/api';
import {
  AdminUsersListApiResponse,
  AdminUserDetailApiResponse,
  CreateAdminUserApiResponse,
  CreateAdminUserPayload,
  FetchAdminUsersQueryParams,
} from './types/adminUsersTypes';

export const adminUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUsersListApiResponse, FetchAdminUsersQueryParams | void>({
      query: (params) => ({
        url: '/admin/employees/',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }),
      providesTags: ['adminUser'],
    }),

    getAdminUserByUuid: builder.query<AdminUserDetailApiResponse, string>({
      query: (uuid) => ({
        url: `/admin/employees/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, uuid) => [{ type: 'adminUser', id: uuid }],
    }),

    createAdminUser: builder.mutation<CreateAdminUserApiResponse, CreateAdminUserPayload>({
      query: (payload) => ({
        url: '/admin/employees/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['adminUser'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminUsersQuery,
  useLazyGetAdminUsersQuery,
  useGetAdminUserByUuidQuery,
  useLazyGetAdminUserByUuidQuery,
  useCreateAdminUserMutation,
} = adminUserApiSlice;