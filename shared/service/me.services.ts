import { apiSlice, ApiResponse } from '@/lib/api';
import { setPersonalProfile } from '@/shared/store/authSlice';
import { PersonalData } from '@/shared/store/authSlice';

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfileMe: builder.query<ApiResponse<PersonalData>, void>({
      query: () => ({
        url: '/profile/me/',
        method: 'GET',
      }),
      providesTags: ['User'],
      
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: responseBody } = await queryFulfilled;
          const personalData = responseBody.data; 

          if (personalData) {
            
            // Put it cleanly in its own home!
            dispatch(setPersonalProfile(personalData));
          }
        } catch (error) {
          console.error('Failed to sync personal profile to auth state:', error);
        }
      },
    }),
  }),
  overrideExisting: true, 
});

export const { useGetProfileMeQuery, useLazyGetProfileMeQuery } = profileApiSlice;