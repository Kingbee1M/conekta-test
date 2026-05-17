import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clearUserInfo } from '@/shared/store/authSlice';
import { Mutex } from 'async-mutex';

// Create a new mutex instance to prevent multiple concurrent refresh calls
const mutex = new Mutex();

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // CRITICAL: This allows the browser to send HttpOnly cookies
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Wait for the mutex to be available (in case another request is currently refreshing)
  await mutex.waitForUnlock();
  
  let result = await baseQuery(args, api, extraOptions);

  // 2. If unauthorized, handle re-auth logic
  if (result.error && result.error.status === 401) {
    
    // Check if the mutex is already locked (another request is already refreshing)
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        console.warn('Access token expired. Attempting silent refresh...');
        
        // Use a simple string or FetchArgs for the refresh endpoint
        const refreshResult = await baseQuery(
          { url: '/auth/refresh/', method: 'POST' }, 
          api, 
          extraOptions
        );

        if (refreshResult.data) {
          console.log('Refresh successful! Retrying original request...');
          // 3. Retry the initial request
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.error('Refresh token expired. Logging out.');
          api.dispatch(clearUserInfo());
          if (typeof window !== 'undefined') {
            window.location.href = '/log-in';
          }
        }
      } finally {
        // 4. Release the lock so other pending requests can proceed
        release();
      }
    } else {
      // If the mutex was locked, wait for it to unlock and then retry the original request
      // with the newly refreshed cookie
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Vendor'],
  endpoints: (builder) => ({
    // Endpoints go here
  }),
});