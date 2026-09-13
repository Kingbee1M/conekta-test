import { apiSlice } from '@/lib/api';
import {
  ListingComment,
  CreateCommentArgs,
  UpdateCommentArgs,
  DeleteCommentArgs,
} from './types/customerListingComments.types';

export const customerListingCommentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. GET ALL COMMENTS FOR A LISTING
    getListingComments: builder.query<ListingComment[], string>({
      query: (listingUuid) => ({
        url: `/listings/${listingUuid}/comments/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, listingUuid) => [
        { type: 'Comment', id: `LIST_${listingUuid}` },
      ],
    }),

    // 2. CREATE A COMMENT / REPLY
    createListingComment: builder.mutation<ListingComment, CreateCommentArgs>({
      query: ({ listingUuid, payload }) => ({
        url: `/listings/${listingUuid}/comments/`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { listingUuid }) => [
        { type: 'Comment', id: `LIST_${listingUuid}` },
      ],
    }),

    // 3. UPDATE A COMMENT (PATCH)
    updateListingComment: builder.mutation<ListingComment, UpdateCommentArgs>({
      query: ({ listingUuid, commentUuid, payload }) => ({
        url: `/listings/${listingUuid}/comments/${commentUuid}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { listingUuid }) => [
        { type: 'Comment', id: `LIST_${listingUuid}` },
      ],
    }),

    // 4. DELETE A COMMENT (DELETE)
    deleteListingComment: builder.mutation<void, DeleteCommentArgs>({
      query: ({ listingUuid, commentUuid }) => ({
        url: `/listings/${listingUuid}/comments/${commentUuid}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { listingUuid }) => [
        { type: 'Comment', id: `LIST_${listingUuid}` },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetListingCommentsQuery,
  useLazyGetListingCommentsQuery,
  useCreateListingCommentMutation,
  useUpdateListingCommentMutation,
  useDeleteListingCommentMutation,
} = customerListingCommentsApi;