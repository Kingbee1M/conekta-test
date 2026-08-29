import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {PaginatedNotificationsResponse,
GetNotificationsParams,
NotificationItem,
MarkAllReadResponse,
UnreadCountResponse} from './notification.types'

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notifications', 'UnreadCount'],
  endpoints: (builder) => ({
    // 1. GET /notifications/
    getNotifications: builder.query<PaginatedNotificationsResponse, GetNotificationsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.unread !== undefined) queryParams.append('unread', params.unread.toString());
        
        const queryString = queryParams.toString();
        return `/api/v1/notifications/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Notifications'],
    }),

    // 2. POST /notifications/{uuid}/read/
    markAsRead: builder.mutation<NotificationItem, string>({
      query: (uuid) => ({
        url: `/api/v1/notifications/${uuid}/read/`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    // 3. POST /notifications/mark-all-read/
    markAllAsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/api/v1/notifications/mark-all-read/',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    // 4. GET /notifications/unread_count/
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/api/v1/notifications/unread_count/',
      providesTags: ['UnreadCount'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetUnreadCountQuery,
} = notificationApi;