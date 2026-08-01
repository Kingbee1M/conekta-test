import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { customerApiSlice } from '@/shared/service/admin/customer.services';
import { CustomerProfile, PaginatedCustomerResponse, FetchCustomersQueryParams } from '@/shared/service/admin/types/customerTypes';

interface CustomerState {
  customers: CustomerProfile[];
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
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
};

// Strongly-typed Async Thunk
export const fetchCustomers = createAsyncThunk<
  PaginatedCustomerResponse,
  FetchCustomersQueryParams | undefined,
  { rejectValue: string }
>(
  'customers/fetchCustomers',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const resultAction = await dispatch(customerApiSlice.endpoints.getCustomers.initiate(params));

      if ('error' in resultAction) {
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

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to page 1 when size changes
    },
    clearCustomerState: (state) => {
      state.customers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch customers';
      });
  },
});

export const { setPage, setPageSize, clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;