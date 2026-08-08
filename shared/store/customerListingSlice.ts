import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  customerListingApiSlice,
  FetchCustomerListingsQueryParams,
} from '@/shared/service/customer services/customerListing.services';
import { PaginatedListingList } from '@/shared/service/customer services/types/customerTypes';
import { ListingResult } from '../service/customer services/customerTypes';

interface CustomerListingState {
  listings: ListingResult[];
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  // Filters state
  searchQuery: string;
  category: string;
  purpose: string;
  state: string;
  lga: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities: string;
  paymentFrequency: string;
}

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
}

const initialState: CustomerListingState = {
  listings: [],
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  searchQuery: '',
  category: '',
  purpose: '',
  state: '',
  lga: '',
  minPrice: undefined,
  maxPrice: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  amenities: '',
  paymentFrequency: '',
};

export const fetchCustomerListings = createAsyncThunk<
  PaginatedListingList,
  FetchCustomerListingsQueryParams | undefined,
  { rejectValue: string }
>(
  'customerListing/fetchCustomerListings',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        customerListingApiSlice.endpoints.getCustomerListings.initiate(
          params,
          { forceRefetch: true }
        )
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(
          customData?.message || 'Failed to fetch customer listings'
        );
      }

      if (resultAction.data) {
        return resultAction.data as unknown as PaginatedListingList;
      }

      return rejectWithValue('No data returned');
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const customerListingSlice = createSlice({
  name: 'customerListing',
  initialState,
  reducers: {
    setCustomerPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCustomerPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.currentPage = 1;
    },
    setFilterPurpose: (state, action: PayloadAction<string>) => {
      state.purpose = action.payload;
      state.currentPage = 1;
    },
    setFilterLocation: (
      state,
      action: PayloadAction<{ state?: string; lga?: string }>
    ) => {
      if (action.payload.state !== undefined) state.state = action.payload.state;
      if (action.payload.lga !== undefined) state.lga = action.payload.lga;
      state.currentPage = 1;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ minPrice?: number; maxPrice?: number }>
    ) => {
      state.minPrice = action.payload.minPrice;
      state.maxPrice = action.payload.maxPrice;
      state.currentPage = 1;
    },
    setFilterBedrooms: (state, action: PayloadAction<number | undefined>) => {
      state.bedrooms = action.payload;
      state.currentPage = 1;
    },
    setFilterAmenities: (state, action: PayloadAction<string>) => {
      state.amenities = action.payload;
      state.currentPage = 1;
    },
    setPaymentFrequency: (state, action: PayloadAction<string>) => {
      state.paymentFrequency = action.payload;
      state.currentPage = 1;
    },
    resetCustomerFilters: (state) => {
      state.currentPage = 1;
      state.searchQuery = '';
      state.category = '';
      state.purpose = '';
      state.state = '';
      state.lga = '';
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.bedrooms = undefined;
      state.bathrooms = undefined;
      state.amenities = '';
      state.paymentFrequency = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerListings.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as Record<string, unknown>;

        if (Array.isArray(action.payload?.results)) {
          state.listings = action.payload.results as unknown as ListingResult[];
          state.count = action.payload.count ?? action.payload.results.length;
          state.next = action.payload.next ?? null;
          state.previous = action.payload.previous ?? null;
        } else if (
          payload?.data &&
          typeof payload.data === 'object' &&
          Array.isArray((payload.data as Record<string, unknown>).results)
        ) {
          const nested = payload.data as PaginatedListingList;
          state.listings = nested.results as unknown as ListingResult[];
          state.count = nested.count ?? nested.results.length;
          state.next = nested.next ?? null;
          state.previous = nested.previous ?? null;
        } else if (Array.isArray(payload?.data)) {
          state.listings = payload.data as unknown as ListingResult[];
          state.count = (payload.count as number) ?? state.listings.length;
        } else if (Array.isArray(action.payload)) {
          state.listings = action.payload as unknown as ListingResult[];
          state.count = state.listings.length;
        } else {
          state.listings = [];
          state.count = 0;
        }
      })
      .addCase(fetchCustomerListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch customer listings';
      });
  },
});

export const {
  setCustomerPage,
  setCustomerPageSize,
  setSearchQuery,
  setFilterCategory,
  setFilterPurpose,
  setFilterLocation,
  setPriceRange,
  setFilterBedrooms,
  setFilterAmenities,
  setPaymentFrequency,
  resetCustomerFilters,
} = customerListingSlice.actions;

export default customerListingSlice.reducer;