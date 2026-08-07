import { apiSlice } from '@/lib/api';
import { PaginatedListingList, Listing } from '@/types';
import { PaymentFrequencyEnum } from '../enums/paymentFreqency.enums';
import { AmenitiesEnum } from '../enums/amenities.enums';
import { FeeTypeEnum } from '../enums/feeType.enums';
import { setProperties } from '../store/listingSlice';
import { setViewProperty } from '../store/viewPropertySlice';
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
      
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.results && data.data.results.length > 0) {
            dispatch(setProperties(data.data.results));
          }
        } catch (error) {
          console.error('Failed to pull listing list cache values:', error);
        }
      },
    }),


    // 3. CREATE NEW LISTING
    createListing: builder.mutation<Listing, CreateListingPayload>({
      query: (body) => ({
        url: '/listings/me/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),

    getListingByUuid: builder.query<PaginatedListingList, string>({
      query: (uuid) => ({
        url: `/listings/me/${uuid}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, uuid) => [{ type: 'Listing', id: uuid }],
      
      async onQueryStarted(uuid, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const propertyDetails = data.data;
          
          dispatch(setViewProperty(propertyDetails as unknown as ViewPropertyState)); 
        } catch (error) {
          console.error(`Failed to fetch property details for UUID ${uuid}:`, error);
        }
      },
    }),
  }),
  overrideExisting: false,
});


export const { 
  useGetListingsQuery,
  useLazyGetListingsQuery, 
  useGetListingByUuidQuery,
  useCreateListingMutation 
} = listingApi;