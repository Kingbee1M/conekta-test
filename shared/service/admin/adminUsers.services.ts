import { apiSlice } from '@/lib/api';
import { 
  ApiResponse, 
  PaginatedAdminUserResponse,
  FetchAdminUsersQueryParams,
  AdminUser
} from './types/adminUsersTypes';

export const adminUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<ApiResponse<PaginatedAdminUserResponse>, FetchAdminUsersQueryParams | void>({
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

    getAdminUserByUuid: builder.query<ApiResponse<AdminUser>, string>({
      query: (uuid) => ({
        url: `/admin/employees/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (result, error, uuid) => [{ type: 'adminUser', id: uuid }],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetAdminUsersQuery, 
  useLazyGetAdminUsersQuery,
  useGetAdminUserByUuidQuery,
  useLazyGetAdminUserByUuidQuery,
} = adminUserApiSlice;