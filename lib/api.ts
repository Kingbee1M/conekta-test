import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

export interface ApiResponse<T = unknown> {
  status_code: number;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: 'include', // 👈 Keeps cookies flowing natively
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: '/auth/refresh/', method: 'POST' }, 
          api,
          extraOptions
        );

        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.error("Auth refresh failed! Preventing hard reload loop.");
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Listing', 'CustomerListings', 'adminCustomer', 'adminListers', 'adminListing', 'adminUser'],
  endpoints: (_builder) => ({}),
});


export const executeCoreRequest = async <T = unknown>(
  args: string | FetchArgs, 
  apiContext?: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2] = {}
): Promise<T> => {
  

  const fallbackApi: Parameters<BaseQueryFn>[1] = apiContext || {
    signal: new AbortController().signal,
    abort: (reason) => { console.warn(`Abort called: ${reason}`); },
    dispatch: () => {}, 
    getState: () => ({}),
    extra: undefined,
    endpoint: 'customThunk',
    type: 'query'
  };
  
  const result = await baseQueryWithReauth(args, fallbackApi, extraOptions);
  
  if (result.error) {
    throw result.error;
  }
  
  return result.data as T;
};