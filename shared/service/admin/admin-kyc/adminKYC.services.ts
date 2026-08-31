import { apiSlice } from '@/lib/api';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import {
  KycProfileData,
  KycProfileReview,
  KycRequirementItem,
  KycRequirementSubmission,
  KycDocument,
  KycRequirement,
} from '@/shared/service/publicKyc/publicKYCtypes';

// Re-export shared types
export type {
  KycProfileData,
  KycProfileReview,
  KycRequirementItem,
  KycRequirementSubmission,
  KycDocument,
  KycRequirement,
};

// --- Generic Standard API Response Wrapper ---
export interface ApiResponse<T> {
  success?: boolean;
  code?: number;
  message?: string;
  data: T;
  timestamp?: string;
}

// --- Base User Interface ---
export interface ApiUser {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
}

// --- Single KYC Profile API Response ---
export interface SingleKycProfileResponse extends KycProfileData {
  user: ApiUser;
}

// --- Item & Paginated List Interfaces ---
export interface PendingProfileApiItem {
  kyc_profile_uuid: string;
  user: ApiUser;
  role: RoleEnum | string;
  submitted_at: string | null;
  status: SubmissionStatusEnum;
  documents_completed?: number;
  total_documents?: number;
}

export interface PaginatedPendingProfilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PendingProfileApiItem[];
}

export interface GetPendingProfilesQueryParams {
  page?: number;
  page_size?: number;
  role?: string;
  status?: string;
  search?: string;
}

// --- Review Submission Request & Response Interfaces ---
export type ReviewActionType = 'approve' | 'request_changes';

export interface ReviewSubmissionPayload {
  submission_uuid: string;
  action: ReviewActionType | string;
  review_notes?: string;
  rejection_reason?: string;
}

// Response returns the updated single profile data structure
export type ReviewSubmissionResponse = SingleKycProfileResponse;

// --- Helper Type Guard for API Wrappers ---
function isWrappedApiResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    (response as Record<string, unknown>).data !== undefined
  );
}

// --- RTK Query Endpoint Injection ---
export const adminKycApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET PENDING KYC PROFILES (LIST)
    getPendingProfiles: builder.query<
      PaginatedPendingProfilesResponse,
      GetPendingProfilesQueryParams | void
    >({
      query: (params) => ({
        url: '/admin/kyc/pending-profiles/',
        method: 'GET',
        params: params || {},
      }),
      transformResponse: (
        response: ApiResponse<PendingProfileApiItem[]> | PendingProfileApiItem[]
      ): PaginatedPendingProfilesResponse => {
        let rawItems: PendingProfileApiItem[] = [];

        if (isWrappedApiResponse<PendingProfileApiItem[]>(response)) {
          rawItems = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          rawItems = response;
        }

        return {
          results: rawItems,
          count: rawItems.length,
          next: null,
          previous: null,
        };
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('[getPendingProfiles] Transformed Output Data:', data);
        } catch (error: unknown) {
          console.error('[getPendingProfiles] API Error Response:', error);
        }
      },
      providesTags: [{ type: 'KYC', id: 'LIST' }],
    }),

    // 2. GET SINGLE KYC PROFILE DETAILS BY UUID
    getPendingProfileByUuid: builder.query<SingleKycProfileResponse, string>({
      query: (uuid) => ({
        url: `/admin/kyc/pending-profiles/${uuid}/`,
        method: 'GET',
      }),
      transformResponse: (
        response: ApiResponse<SingleKycProfileResponse> | SingleKycProfileResponse
      ): SingleKycProfileResponse => {
        if (isWrappedApiResponse<SingleKycProfileResponse>(response)) {
          return response.data;
        }
        return response;
      },
      async onQueryStarted(uuid, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('[getPendingProfileByUuid] Unwrapped Profile Data:', data);
        } catch (error: unknown) {
          console.error('[getPendingProfileByUuid] API Error Response:', error);
        }
      },
      providesTags: (_result, _error, uuid) => [{ type: 'KYC', id: uuid }],
    }),

    // 3. POST REVIEW SUBMISSION
    reviewSubmission: builder.mutation<
      ReviewSubmissionResponse,
      ReviewSubmissionPayload
    >({
      query: (payload) => ({
        url: '/admin/kyc/pending-profiles/review-submission/',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (
        response: ApiResponse<ReviewSubmissionResponse> | ReviewSubmissionResponse
      ): ReviewSubmissionResponse => {
        if (isWrappedApiResponse<ReviewSubmissionResponse>(response)) {
          return response.data;
        }
        return response;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        console.log('[reviewSubmission] Submitting review payload:', payload);
        try {
          const { data } = await queryFulfilled;
          console.log('[reviewSubmission] Success response:', data);
        } catch (error: unknown) {
          console.error('[reviewSubmission] API Error Response:', error);
        }
      },
      invalidatesTags: (result) => [
        { type: 'KYC', id: 'LIST' },
        ...(result?.kyc_profile_uuid
          ? [{ type: 'KYC' as const, id: result.kyc_profile_uuid }]
          : []),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPendingProfilesQuery,
  useLazyGetPendingProfilesQuery,
  useGetPendingProfileByUuidQuery,
  useReviewSubmissionMutation,
} = adminKycApi;