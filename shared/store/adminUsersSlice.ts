import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { adminUserApiSlice } from '@/shared/service/admin/adminUsers.services';
import { 
  AdminUser, 
  PaginatedAdminUserResponse, 
  FetchAdminUsersQueryParams 
} from '@/shared/service/admin/types/adminUsersTypes';

interface AdminUserState {
  admins: AdminUser[];
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;

  // Added state for single admin employee
  selectedAdmin: AdminUser | null;
  singleLoading: boolean;
  singleError: string | null;
}

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
}

const initialState: AdminUserState = {
  admins: [],
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,

  // Initial single admin employee state
  selectedAdmin: null,
  singleLoading: false,
  singleError: null,
};

export const fetchAdminUsers = createAsyncThunk<
  PaginatedAdminUserResponse,
  FetchAdminUsersQueryParams | undefined,
  { rejectValue: string }
>(
  'admins/fetchAdminUsers',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        adminUserApiSlice.endpoints.getAdminUsers.initiate(params, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch admin users');
      }

      if (resultAction.data) {
        const rawData = resultAction.data as unknown as Record<string, unknown>;
        if (rawData.data && typeof rawData.data === 'object') {
          return rawData.data as PaginatedAdminUserResponse;
        }
        return resultAction.data as unknown as PaginatedAdminUserResponse;
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

// Added async thunk to fetch single admin user by UUID
export const fetchAdminUserByUuid = createAsyncThunk<
  AdminUser,
  string,
  { rejectValue: string }
>(
  'admins/fetchAdminUserByUuid',
  async (uuid, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        adminUserApiSlice.endpoints.getAdminUserByUuid.initiate(uuid, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch admin user details');
      }

      if (resultAction.data) {
        const rawData = resultAction.data as unknown as Record<string, unknown>;
        if (rawData.data && typeof rawData.data === 'object') {
          return rawData.data as AdminUser;
        }
        return resultAction.data as unknown as AdminUser;
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

const adminUserSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    setAdminPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setAdminPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearAdminState: (state) => {
      state.admins = [];
      state.error = null;
    },
    // Added reducer to clear selected single admin employee state
    clearSelectedAdmin: (state) => {
      state.selectedAdmin = null;
      state.singleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Existing fetchAdminUsers cases */
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as Record<string, unknown>;

        if (Array.isArray(action.payload?.results)) {
          state.admins = action.payload.results;
          state.count = action.payload.count ?? action.payload.results.length;
          state.next = action.payload.next ?? null;
          state.previous = action.payload.previous ?? null;
        } else if (payload?.data && typeof payload.data === 'object' && Array.isArray((payload.data as Record<string, unknown>).results)) {
          const nested = payload.data as PaginatedAdminUserResponse;
          state.admins = nested.results;
          state.count = nested.count ?? nested.results.length;
          state.next = nested.next ?? null;
          state.previous = nested.previous ?? null;
        } else if (Array.isArray(payload?.data)) {
          state.admins = payload.data as AdminUser[];
          state.count = (payload.count as number) ?? state.admins.length;
        } else if (Array.isArray(action.payload)) {
          state.admins = action.payload as unknown as AdminUser[];
          state.count = state.admins.length;
        } else {
          state.admins = [];
          state.count = 0;
        }
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : action.error.message || 'Failed to fetch admin users';
      })

      /* Added fetchAdminUserByUuid cases */
      .addCase(fetchAdminUserByUuid.pending, (state) => {
        state.singleLoading = true;
        state.singleError = null;
      })
      .addCase(fetchAdminUserByUuid.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.selectedAdmin = action.payload;
      })
      .addCase(fetchAdminUserByUuid.rejected, (state, action) => {
        state.singleLoading = false;
        state.singleError = typeof action.payload === 'string' 
          ? action.payload 
          : action.error.message || 'Failed to fetch admin user details';
      });
  },
});

export const { setAdminPage, setAdminPageSize, clearAdminState, clearSelectedAdmin } = adminUserSlice.actions;
export default adminUserSlice.reducer;