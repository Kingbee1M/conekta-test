import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { customerApiSlice } from '@/shared/service/admin/customer.services';
import { 
  CustomerProfile, 
  PaginatedCustomerResponse, 
  FetchCustomersQueryParams 
} from '@/shared/service/admin/types/customerTypes';

interface CustomerState {
  customers: CustomerProfile[];
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;

  // Single customer selection state
  selectedCustomer: CustomerProfile | null;
  singleLoading: boolean;
  singleError: string | null;
}

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
}

const initialState: CustomerState = {
  customers: [],
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,

  selectedCustomer: null,
  singleLoading: false,
  singleError: null,
};

// Fetch Paginated Customers List Thunk
export const fetchCustomers = createAsyncThunk<
  PaginatedCustomerResponse,
  FetchCustomersQueryParams | undefined,
  { rejectValue: string }
>(
  'customers/fetchCustomers',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        customerApiSlice.endpoints.getCustomers.initiate(params, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch customers');
      }

      if (resultAction.data) {
        return resultAction.data;
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

// Fetch Single Customer Detail Thunk
export const fetchCustomerByUuid = createAsyncThunk<
  CustomerProfile,
  string,
  { rejectValue: string }
>(
  'customers/fetchCustomerByUuid',
  async (uuid, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        customerApiSlice.endpoints.getCustomerByUuid.initiate(uuid, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();
      console.log("user uuid", uuid)
      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch customer details');
      }

      if (resultAction.data) {
        return resultAction.data;
      }

      return rejectWithValue('No customer details returned');
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearCustomerState: (state) => {
      state.customers = [];
      state.error = null;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.singleError = null;
      state.singleLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCustomers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as Record<string, unknown>;

        if (Array.isArray(action.payload?.results)) {
          state.customers = action.payload.results;
          state.count = action.payload.count ?? action.payload.results.length;
          state.next = action.payload.next ?? null;
          state.previous = action.payload.previous ?? null;
        } else if (payload?.data && typeof payload.data === 'object' && Array.isArray((payload.data as Record<string, unknown>).results)) {
          const nested = payload.data as PaginatedCustomerResponse;
          state.customers = nested.results;
          state.count = nested.count ?? nested.results.length;
          state.next = nested.next ?? null;
          state.previous = nested.previous ?? null;
        } else if (Array.isArray(payload?.data)) {
          state.customers = payload.data as CustomerProfile[];
          state.count = (payload.count as number) ?? state.customers.length;
        } else if (Array.isArray(action.payload)) {
          state.customers = action.payload as unknown as CustomerProfile[];
          state.count = state.customers.length;
        } else {
          state.customers = [];
          state.count = 0;
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch customers';
      })

      // Handle fetchCustomerByUuid
      .addCase(fetchCustomerByUuid.pending, (state) => {
        state.singleLoading = true;
        state.singleError = null;
      })
      .addCase(fetchCustomerByUuid.fulfilled, (state, action) => {
        state.singleLoading = false;
        const rawPayload = action.payload as unknown as Record<string, unknown>;
        if (rawPayload?.data && typeof rawPayload.data === 'object') {
          state.selectedCustomer = rawPayload.data as CustomerProfile;
        } else {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(fetchCustomerByUuid.rejected, (state, action) => {
        state.singleLoading = false;
        state.singleError = action.payload ?? 'Failed to fetch customer details';
      });
  },
});

export const { 
  setPage, 
  setPageSize, 
  clearCustomerState, 
  clearSelectedCustomer 
} = customerSlice.actions;

export default customerSlice.reducer;