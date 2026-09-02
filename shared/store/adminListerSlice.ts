import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { listerApiSlice } from '../service/admin/lister.service';
import { 
  ListerProfile, 
  ListerTableRecord,
  PaginatedListerResponse, 
  SingleListerResponse,
  FetchListersQueryParams 
} from '@/shared/service/admin/types/listerTypes';

interface ListerState {
  listers: ListerTableRecord[] | ListerProfile[];
  selectedLister: ListerProfile | null;
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  singleLoading: boolean;
  error: string | null;
  singleError: string | null;
}

interface CustomServerError {
  message?: string;
  [key: string]: unknown;
}

const initialState: ListerState = {
  listers: [],
  selectedLister: null,
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  singleLoading: false,
  error: null,
  singleError: null,
};

export const fetchListers = createAsyncThunk<
  PaginatedListerResponse,
  FetchListersQueryParams | undefined,
  { rejectValue: string }
>(
  'listers/fetchListers',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        listerApiSlice.endpoints.getListers.initiate(params, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch listers');
      }

      if (resultAction.data) {
        return resultAction.data as PaginatedListerResponse;
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

export const fetchListerByUuid = createAsyncThunk<
  ListerProfile,
  string,
  { rejectValue: string }
>(
  'listers/fetchListerByUuid',
  async (uuid, { rejectWithValue, dispatch }) => {
    try {
      const promise = dispatch(
        listerApiSlice.endpoints.getListerByUuid.initiate(uuid, { forceRefetch: true })
      );

      const resultAction = await promise;
      promise.unsubscribe();

      if ('error' in resultAction && resultAction.error) {
        const error = resultAction.error as FetchBaseQueryError | undefined;
        const customData = error?.data as CustomServerError | undefined;
        return rejectWithValue(customData?.message || 'Failed to fetch lister details');
      }

      if (resultAction.data) {
        const res = resultAction.data as SingleListerResponse | ListerProfile;
        
        if ('data' in res && res.data) {
          return res.data; // Safely extracts inner ListerProfile if wrapped in SingleListerResponse
        }

        return res as ListerProfile;
      }

      return rejectWithValue('No lister data returned');
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const listerSlice = createSlice({
  name: 'listers',
  initialState,
  reducers: {
    setListerPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setListerPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearSelectedLister: (state) => {
      state.selectedLister = null;
      state.singleError = null;
    },
    clearListerState: (state) => {
      state.listers = [];
      state.selectedLister = null;
      state.error = null;
      state.singleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Listers List
      .addCase(fetchListers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as Record<string, unknown>;

        if (Array.isArray(action.payload?.results)) {
          state.listers = action.payload.results;
          state.count = action.payload.count ?? action.payload.results.length;
          state.next = action.payload.next ?? null;
          state.previous = action.payload.previous ?? null;
        } else if (payload?.data && typeof payload.data === 'object' && Array.isArray((payload.data as Record<string, unknown>).results)) {
          const nested = payload.data as PaginatedListerResponse;
          state.listers = nested.results;
          state.count = nested.count ?? nested.results.length;
          state.next = nested.next ?? null;
          state.previous = nested.previous ?? null;
        } else if (Array.isArray(payload?.data)) {
          state.listers = payload.data as ListerProfile[];
          state.count = (payload.count as number) ?? state.listers.length;
        } else if (Array.isArray(action.payload)) {
          state.listers = action.payload as unknown as ListerProfile[];
          state.count = state.listers.length;
        } else {
          state.listers = [];
          state.count = 0;
        }
      })
      .addCase(fetchListers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch listers';
      })

      // Fetch Single Lister
      .addCase(fetchListerByUuid.pending, (state) => {
        state.singleLoading = true;
        state.singleError = null;
      })
      .addCase(fetchListerByUuid.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.selectedLister = action.payload;
      })
      .addCase(fetchListerByUuid.rejected, (state, action) => {
        state.singleLoading = false;
        state.singleError = action.payload ?? 'Failed to fetch lister details';
      });
  },
});

export const { 
  setListerPage, 
  setListerPageSize, 
  clearSelectedLister, 
  clearListerState 
} = listerSlice.actions;

export default listerSlice.reducer;