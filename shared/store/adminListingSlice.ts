import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listingApiSlice } from '@/shared/service/admin/adminlisting.services';
import {
  PropertyListing,
  AdminListingsQueryParams,
  AdminListingsResponse,
} from '@/shared/service/admin/types/listingTypes';

interface AdminListingState {
  listings: PropertyListing[];
  count: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  activeTab: string;
  searchQuery: string;
}

const initialState: AdminListingState = {
  listings: [],
  count: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  activeTab: 'All Listings',
  searchQuery: '',
};

// Async Thunk to fetch listings using RTK Query endpoint under the hood
export const fetchListings = createAsyncThunk<
  AdminListingsResponse,
  AdminListingsQueryParams | undefined,
  { rejectValue: string }
>('adminListing/fetchListings', async (params, { dispatch, rejectWithValue }) => {
  try {
    const result = await dispatch(
      listingApiSlice.endpoints.getListings.initiate(params)
    ).unwrap();
    return result;
  } catch (err: unknown) {
    return rejectWithValue(
     (err instanceof Error ? err.message : String(err)) || 'Failed to fetch admin listings'
    );
  }
});

const adminListingSlice = createSlice({
  name: 'adminListing',
  initialState,
  reducers: {
    setListingPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setListingPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.currentPage = 1;
      state.activeTab = 'All Listings';
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchListings.fulfilled,
        (state, action: PayloadAction<AdminListingsResponse>) => {
          state.loading = false;
          state.listings = action.payload.results;
          state.count = action.payload.count;
        }
      )
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const {
  setListingPage,
  setListingPageSize,
  setActiveTab,
  setSearchQuery,
  resetFilters,
} = adminListingSlice.actions;

export default adminListingSlice.reducer;