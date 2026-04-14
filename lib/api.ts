import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clearUserInfo } from '@/shared/store/authSlice';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 1. Define the base query as a separate constant
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    // Standard headers (Cookies are handled automatically by the browser)
    return headers;
  },
});

// 2. Create the "Smart" wrapper for Re-Authentication
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  
  // First, try the original request
  let result = await baseQuery(args, api, extraOptions);

  // Check if we got a 401 Unauthorized (Access Token Expired)
  if (result.error && result.error.status === 401) {
    console.warn('Access token expired. Attempting silent refresh...');

    // Try to get a new access token via the refresh endpoint
    // The HttpOnly refresh cookie is sent automatically by the browser here
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      console.log('Refresh successful! Retrying original request...');
      
      // Retry the initial request that failed
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed (Both tokens likely expired) -> NUKE EVERYTHING
      console.error('Refresh token expired. Clearing local storage and logging out.');
      
      api.dispatch(clearUserInfo());
      
      // Force redirect to login if we are on the client
      if (typeof window !== 'undefined') {
        window.location.href = '/log-in';
      }
    }
  }

  return result;
};

// 3. Update the apiSlice to use the new baseQueryWithReauth
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth, // <--- Swap it here
  tagTypes: ['User', 'Vendor'],
  endpoints: (builder) => ({
    // Your endpoints go here...
  }),
});