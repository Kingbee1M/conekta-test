import { apiSlice, ApiResponse } from '@/lib/api';
import {
  setCustomerProfile,
  setListerProfile,
  CustomerProfile,
  ListerProfile,
} from '@/shared/store/authSlice';

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Customer profile fetch
    getCustomerProfileMe: builder.query<ApiResponse<CustomerProfile>, void>({
      query: () => ({
        url: '/customers/profile/me/',
        method: 'GET',
      }),
      providesTags: ['User'],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: responseBody } = await queryFulfilled;
          const customerData = responseBody.data;

          if (customerData) {
            console.log('Customer Profile Response:', responseBody);
            dispatch(setCustomerProfile(customerData));
          }
        } catch (error) {
          console.error('Failed to sync customer profile to auth state:', error);
        }
      },
    }),

    // Lister profile fetch
    getListerProfileMe: builder.query<ApiResponse<ListerProfile>, void>({
      query: () => ({
        url: '/listers/profile/me/',
        method: 'GET',
      }),
      providesTags: ['User'],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: responseBody } = await queryFulfilled;
          const listerData = responseBody.data;

          if (listerData) {
            console.log('Lister Profile Response:', responseBody);
            dispatch(setListerProfile(listerData));
          }
        } catch (error) {
          console.error('Failed to sync lister profile to auth state:', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCustomerProfileMeQuery,
  useLazyGetCustomerProfileMeQuery,
  useGetListerProfileMeQuery,
  useLazyGetListerProfileMeQuery,
} = profileApiSlice;