import { apiSlice, ApiResponse } from '@/lib/api';
import {
  KycProfileData,
  KycRequirement,
  SubmitKycDocumentsRequest,
  SubmitKycDocumentsResponse,
} from './publicKYCtypes';

export const publicKycApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get User's Current KYC Profile
    getMyKycProfile: builder.query<ApiResponse<KycProfileData>, void>({
      query: () => ({
        url: '/kyc/my-profile/',
        method: 'GET',
      }),
      providesTags: ['KYC'],
    }),

    // 2. Get All Available KYC Requirements
    getKycRequirements: builder.query<ApiResponse<KycRequirement[]>, void>({
      query: () => ({
        url: '/kyc/requirements/',
        method: 'GET',
      }),
      providesTags: ['KYC'],
    }),

    // 3. Submit Documents for a Specific Requirement
    submitKycDocuments: builder.mutation<ApiResponse<SubmitKycDocumentsResponse>, SubmitKycDocumentsRequest>({
      query: (body) => ({
        url: '/kyc/submit-documents/',
        method: 'POST',
        body,
      }),
      // Only invalidate KYC tag - this will refetch profile/requirements
      invalidatesTags: ['KYC'],
    }),

    // 4. Submit Full KYC Profile for Review
    submitKycProfile: builder.mutation<ApiResponse<KycProfileData>, void>({
      query: () => ({
        url: '/kyc/submit-profile/',
        method: 'POST',
      }),
      // Only invalidate KYC tag - this will refetch profile/requirements
      invalidatesTags: ['KYC'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyKycProfileQuery,
  useLazyGetMyKycProfileQuery,
  useGetKycRequirementsQuery,
  useLazyGetKycRequirementsQuery,
  useSubmitKycDocumentsMutation,
  useSubmitKycProfileMutation,
} = publicKycApiSlice;