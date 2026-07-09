import { apiSlice, ApiResponse } from '@/lib/api';

export interface MediaUploadPayload {
  file: string;
  media_type: 'image' | 'video';
}

export interface MediaUploadResponse {
  url: string;
  message?: string;
}

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<ApiResponse<MediaUploadResponse>, MediaUploadPayload>({
      query: (payload: MediaUploadPayload) => ({
        url: '/media/upload/',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<MediaUploadResponse>) => {
        console.log('[Media Service API Response]:', response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = mediaApi;