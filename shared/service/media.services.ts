import { apiSlice, ApiResponse } from '@/lib/api';
import { MediaType } from '../enums/media-type.enum';

export interface MediaUploadPayload {
  file: Blob | File;
  media_type: MediaType;
}

export interface MediaUploadResponse {
  id: string;
  url: string;
  status: string;
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
