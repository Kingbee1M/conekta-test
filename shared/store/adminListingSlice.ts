import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { listingApiSlice } from '@/shared/service/admin/adminlisting.services';
import { EmployeeListingDetail } from '@/shared/service/admin/types/listingTypes';
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

  // Single Property View State (Typed with EmployeeListingDetail)
  selectedProperty: EmployeeListingDetail | null;
  singleLoading: boolean;
  singleError: string | null;
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

  selectedProperty: null,
  singleLoading: false,
  singleError: null,
};

export const fetchListings = createAsyncThunk<
  AdminListingsResponse,
  AdminListingsQueryParams | undefined,
  { rejectValue: string }
>('adminListing/fetchListings', async (params, { dispatch, rejectWithValue }) => {

  const querySubscription = dispatch(
    listingApiSlice.endpoints.getAdminListings.initiate(params, { forceRefetch: true })
  );

  try {
    const data = await querySubscription.unwrap();

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
    querySubscription.unsubscribe();
  }
});

// Thunk to fetch a single property record by UUID returning EmployeeListingDetail
export const fetchAdminPropertyByUuid = createAsyncThunk<
  EmployeeListingDetail,
  string,
  { rejectValue: string }
>('adminListing/fetchAdminPropertyByUuid', async (uuid, { dispatch, rejectWithValue }) => {
  const querySubscription = dispatch(
    listingApiSlice.endpoints.getAdminListingByUuid.initiate(uuid, { forceRefetch: true })
  );

  try {
    const response = await querySubscription.unwrap();

    if (response?.data) {
      return response.data;
    }

    return rejectWithValue('Property record not found');
  } catch (err: unknown) {
    console.error('[fetchAdminPropertyByUuid Thunk] Error encountered:', err);

    if (err && typeof err === 'object' && 'status' in err) {
      const error = err as FetchBaseQueryError;
      const customData = error.data as CustomServerError | undefined;
      return rejectWithValue(customData?.message || 'Failed to fetch property details');
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('An unexpected error occurred');
  } finally {
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
    clearSelectedAdminProperty: (state) => {
      state.selectedProperty = null;
      state.singleError = null;
      state.singleLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List Cases
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
      })

      // Fetch Single Property Cases
      .addCase(fetchAdminPropertyByUuid.pending, (state) => {
        state.singleLoading = true;
        state.singleError = null;
      })
      .addCase(fetchAdminPropertyByUuid.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchAdminPropertyByUuid.rejected, (state, action) => {
        state.singleLoading = false;
        state.singleError = action.payload || 'Failed to retrieve property details';
      });
  },
});

export const {
  setListingPage,
  setListingPageSize,
  setActiveTab,
  setSearchQuery,
  resetFilters,
  clearSelectedAdminProperty,
} = adminListingSlice.actions;

export default adminListingSlice.reducer;