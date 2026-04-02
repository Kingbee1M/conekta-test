import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const apiSlice = createApi({
  reducerPath: 'api', // How it appears in Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['User', 'Vendor'],
  endpoints: (builder) => ({}),
});