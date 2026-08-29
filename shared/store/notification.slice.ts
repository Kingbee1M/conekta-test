import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@/shared/service/notification.types';
import { notificationApi } from '@/shared/service/notification.services';

interface NotificationState {
  unreadOnlyFilter: boolean;
  activeNotification: NotificationItem | null;
  unreadCount: number;
}

const initialState: NotificationState = {
  unreadOnlyFilter: false,
  activeNotification: null,
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadOnlyFilter: (state, action: PayloadAction<boolean>) => {
      state.unreadOnlyFilter = action.payload;
    },
    setActiveNotification: (state, action: PayloadAction<NotificationItem | null>) => {
      state.activeNotification = action.payload;
    },
    clearActiveNotification: (state) => {
      state.activeNotification = null;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Automatically keep state.unreadCount in sync when unread count query succeeds
    builder.addMatcher(
      notificationApi.endpoints.getUnreadCount.matchFulfilled,
      (state, { payload }) => {
        state.unreadCount = payload.count;
      }
    );
  },
});

export const {
  setUnreadOnlyFilter,
  setActiveNotification,
  clearActiveNotification,
  setUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;