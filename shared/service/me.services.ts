import { apiSlice, ApiResponse } from '@/lib/api';
import {
  setCustomerProfile,
  setListerProfile,
  CustomerProfile,
  ListerProfile,
} from '@/shared/store/authSlice';

/* ============================================================
   PAYLOAD INTERFACES
============================================================ */

export interface UpdateCustomerProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  nationality?: string;
  country?: string;
  state?: string;
  lga?: string;
  address?: string;
  postal_code?: string;
  occupation?: string;
  monthly_income?: number;
  employer_name?: string;
  employer_address?: string;
  employer_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  guarantor_name?: string;
  guarantor_phone?: string;
  guarantor_email?: string;
  guarantor_address?: string;
  guarantor_relationship?: string;
}

export interface UpdateListerProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  nationality?: string;
  country?: string;
  state?: string;
  lga?: string;
  address?: string;
  postal_code?: string;
}

/* ============================================================
   API SLICE
============================================================ */

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

    // Update Customer Profile
    updateCustomerProfileMe: builder.mutation<
      ApiResponse<CustomerProfile>,
      UpdateCustomerProfilePayload
    >({
      query: (payload) => ({
        url: '/customers/profile/me/',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: responseBody } = await queryFulfilled;
          const updatedCustomer = responseBody.data;

          if (updatedCustomer) {
            dispatch(setCustomerProfile(updatedCustomer));
          }
        } catch (error) {
          console.error('Failed to update customer profile in auth state:', error);
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

    // Update Lister Profile
    updateListerProfileMe: builder.mutation<
      ApiResponse<ListerProfile>,
      UpdateListerProfilePayload
    >({
      query: (payload) => ({
        url: '/listers/profile/me/',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: responseBody } = await queryFulfilled;
          const updatedLister = responseBody.data;

          if (updatedLister) {
            dispatch(setListerProfile(updatedLister));
          }
        } catch (error) {
          console.error('Failed to update lister profile in auth state:', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCustomerProfileMeQuery,
  useLazyGetCustomerProfileMeQuery,
  useUpdateCustomerProfileMeMutation,
  useGetListerProfileMeQuery,
  useLazyGetListerProfileMeQuery,
  useUpdateListerProfileMeMutation,
} = profileApiSlice;