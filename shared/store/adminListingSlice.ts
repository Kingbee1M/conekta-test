import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
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

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
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

export const fetchListings = createAsyncThunk<
  AdminListingsResponse,
  AdminListingsQueryParams | undefined,
  { rejectValue: string }
>('adminListing/fetchListings', async (params, { dispatch, rejectWithValue }) => {
  console.log('[fetchListings Thunk] Initiated with params:', params);

  const querySubscription = dispatch(
    listingApiSlice.endpoints.getListings.initiate(params, { forceRefetch: true })
  );

  try {
    // Calling .unwrap() unwraps the RTK Query payload directly or throws if fetch fails
    const data = await querySubscription.unwrap();
    console.log('[fetchListings Thunk] Successfully retrieved data:', data);

    if (data) {
      return data as AdminListingsResponse;
    }

    return rejectWithValue('No data returned from service');
  } catch (err: unknown) {
    console.error('[fetchListings Thunk] Error encountered:', err);

    if (err && typeof err === 'object' && 'status' in err) {
      const error = err as FetchBaseQueryError;
      const customData = error.data as CustomServerError | undefined;
      return rejectWithValue(customData?.message || 'Failed to fetch admin listings');
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('An unexpected error occurred');
  } finally {
    // Guarantee unsubscription ONLY after promise resolution completes
    querySubscription.unsubscribe();
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
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as Record<string, unknown>;

        if (Array.isArray(action.payload?.results)) {
          state.listings = action.payload.results;
          state.count = action.payload.count ?? action.payload.results.length;
        } else if (
          payload?.data &&
          typeof payload.data === 'object' &&
          Array.isArray((payload.data as Record<string, unknown>).results)
        ) {
          const nested = payload.data as AdminListingsResponse;
          state.listings = nested.results;
          state.count = nested.count ?? nested.results.length;
        } else if (Array.isArray(payload?.data)) {
          state.listings = payload.data as PropertyListing[];
          state.count = (payload.count as number) ?? state.listings.length;
        } else if (Array.isArray(action.payload)) {
          state.listings = action.payload as unknown as PropertyListing[];
          state.count = state.listings.length;
        } else {
          state.listings = [];
          state.count = 0;
        }
      })
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