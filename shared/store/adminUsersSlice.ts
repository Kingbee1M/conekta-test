import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { adminUserApiSlice } from '@/shared/service/admin/adminUsers.services';
import {
  AdminUserListItem,
  AdminUserDetail,
  AdminUsersSummary,
  PaginatedAdminUserResponse,
  FetchAdminUsersQueryParams,
  CreateAdminUserPayload,
} from '@/shared/service/admin/types/adminUsersTypes';

interface AdminUserState {
  // Table listing state
  admins: AdminUserListItem[];
  summary: AdminUsersSummary | null;
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;

  // Single admin employee state
  selectedAdmin: AdminUserDetail | null;
  singleLoading: boolean;
  singleError: string | null;

  // Create admin employee state
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
}

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
}

// Payload interface extending CreateAdminUserPayload to optionally allow explicit page params
export type CreateAdminUserThunkArgs = CreateAdminUserPayload & {
  page?: number;
  pageSize?: number;
};

const initialState: AdminUserState = {
  admins: [],
  summary: null,
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,

  selectedAdmin: null,
  singleLoading: false,
  singleError: null,

  createLoading: false,
  createError: null,
  createSuccess: false,
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

export const fetchAdminUserByUuid = createAsyncThunk<
  AdminUserDetail,
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
          return rawData.data as AdminUserDetail;
        }
        return resultAction.data as unknown as AdminUserDetail;
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

export const createAdminUser = createAsyncThunk<
  AdminUserDetail,
  CreateAdminUserThunkArgs,
  { rejectValue: string }
>(
  'admins/createAdminUser',
  async (payloadWithParams, { rejectWithValue, dispatch, getState }) => {
    try {
      // Extract page / pageSize if passed explicitly, separated from API body payload
      const { page: argPage, pageSize: argPageSize, ...payload } = payloadWithParams;

      const promise = dispatch(
        adminUserApiSlice.endpoints.createAdminUser.initiate(payload as CreateAdminUserPayload)
      );

      const resultAction = await promise;
      promise.reset();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to create admin account');
      }

      if (resultAction.data) {
        // Safely extract slice state from store with fallbacks
        const rootState = getState() as Record<string, unknown>;
        const adminSliceState = (rootState.admins || rootState.adminUser || {}) as Partial<AdminUserState>;

        const pageToFetch = argPage ?? adminSliceState.currentPage ?? 1;
        const pageSizeToFetch = argPageSize ?? adminSliceState.pageSize ?? 10;

        // Refresh the admin table list on success
        dispatch(
          fetchAdminUsers({
            page: pageToFetch,
            page_size: pageSizeToFetch,
          })
        );

        const rawData = resultAction.data as unknown as Record<string, unknown>;
        if (rawData.data && typeof rawData.data === 'object') {
          return rawData.data as AdminUserDetail;
        }
        return resultAction.data as unknown as AdminUserDetail;
      }

      return rejectWithValue('No data returned from creation endpoint');
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('An unexpected error occurred during creation');
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
      state.summary = null;
      state.count = 0;
      state.next = null;
      state.previous = null;
      state.error = null;
    },
    clearSelectedAdmin: (state) => {
      state.selectedAdmin = null;
      state.singleError = null;
    },
    resetCreateAdminState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetchAdminUsers cases */
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (payload && Array.isArray(payload.results)) {
          state.admins = payload.results;
          state.summary = payload.summary ?? null;
          state.count = payload.count ?? payload.results.length;
          state.next = payload.next ?? null;
          state.previous = payload.previous ?? null;
        } else {
          state.admins = [];
          state.summary = null;
          state.count = 0;
          state.next = null;
          state.previous = null;
        }
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Failed to fetch admin users';
      })

      /* fetchAdminUserByUuid cases */
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
        state.singleError =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Failed to fetch admin user details';
      })

      /* createAdminUser cases */
      .addCase(createAdminUser.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createAdminUser.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Failed to create admin user';
      });
  },
});

export const {
  setAdminPage,
  setAdminPageSize,
  clearAdminState,
  clearSelectedAdmin,
  resetCreateAdminState,
} = adminUserSlice.actions;

export default adminUserSlice.reducer;