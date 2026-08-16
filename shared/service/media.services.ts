import { apiSlice, ApiResponse } from '@/lib/api';

export interface MediaUploadPayload {
  file: File;
  media_type: 'image' | 'document';
}

export interface MediaUploadResponse {
  media_uuid?: string;
  uuid?: string;
  id?: string;
  url: string;
  message?: string;
}

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<ApiResponse<MediaUploadResponse>, MediaUploadPayload>({
      query: ({ file, media_type }: MediaUploadPayload) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', media_type);

        return {
          url: '/media/upload/',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: ApiResponse<MediaUploadResponse>) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = mediaApi;
