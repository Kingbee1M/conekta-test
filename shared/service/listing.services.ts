import { apiSlice } from '@/lib/api';
import { PaginatedListingList, Listing } from '@/types';
import { PaymentFrequencyEnum } from '../enums/paymentFreqency.enums';
import { AmenitiesEnum } from '../enums/amenities.enums';
import { FeeTypeEnum } from '../enums/feeType.enums';
import { setProperties } from '../store/listingSlice';
import { ViewPropertyState } from '../store/viewPropertySlice';

export interface FeeOption {
  fee: number;
  frequency: PaymentFrequencyEnum;
  fee_type: FeeTypeEnum;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  purpose: 'sale' | 'rent' | string;
  property_type: 'residential' | 'commercial' | string;
  category: 'land' | 'building' | string; 
  street: string;
  city: string;
  state: string;
  lga: string;
  structure: string;
  currency: 'NGN' | 'USD' | string;
  base_price: number;
  amenities?: AmenitiesEnum[];
  square_meters?: string;
  bathrooms?: number;
  bedrooms?: number;
  toilets?: number;
  parking_spaces?: number;
  images?: string[];
  primary_image_index?: number;
  payment_frequency?: PaymentFrequencyEnum;
  fees?: FeeOption[];
}

export type UpdateListingPayload = Partial<CreateListingPayload>;

export interface UpdateListingArgs {
  uuid: string;
  payload: UpdateListingPayload;
}

// Wrapper interface matching API responses that nest listing inside `data`
export interface SingleListingApiResponse {
  data: ViewPropertyState;
}

export const listingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. GET ALL LISTINGS
    getListings: builder.query<PaginatedListingList, { page?: number; search?: string } | void>({
      query: (params) => ({
        url: '/listings/me/',
        method: 'GET',
        params: params || {},
      }),
      providesTags: [{ type: 'Listing', id: 'LIST' }],
      
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.results && data.data.results.length > 0) {
            dispatch(setProperties(data.data.results));
          }
        } catch (error) {
          console.error('Failed to pull listing list cache values:', error);
        }
      },
    }),

    // 2. CREATE NEW LISTING
    createListing: builder.mutation<Listing, CreateListingPayload>({
      query: (body) => ({
        url: '/listings/me/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),

    // 3. GET LISTING BY UUID
    getListingByUuid: builder.query<SingleListingApiResponse, string>({
      query: (uuid) => ({
        url: `/listings/me/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, uuid) => [{ type: 'Listing', id: uuid }],
      keepUnusedDataFor: 0,
    }),

    // 4. UPDATE LISTING BY UUID (PATCH)
    updateListingByUuid: builder.mutation<unknown, UpdateListingArgs>({
      query: ({ uuid, payload }) => ({
        url: `/listings/me/${uuid}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: 'Listing', id: uuid },
        { type: 'Listing', id: 'LIST' },
      ],
    }),

    // 5. DELETE LISTING BY UUID (DELETE)
    deleteListingByUuid: builder.mutation<{ message?: string } | void, string>({
      query: (uuid) => ({
        url: `/listings/me/${uuid}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, uuid) => [
        { type: 'Listing', id: uuid },
        { type: 'Listing', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetListingsQuery,
  useLazyGetListingsQuery, 
  useGetListingByUuidQuery,
  useCreateListingMutation,
  useUpdateListingByUuidMutation,
  useDeleteListingByUuidMutation,
} = listingApi;