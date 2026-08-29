import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NotificationData {
  [key: string]: unknown;
}

export type NotificationType =
  | "application"
  | "offer"
  | "lease"
  | "kyc"
  | "listing"
  | "default"
  | "system"
  | "account"
  | "comment";

export interface NotificationItem {
  uuid: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export interface NotificationSocketMessage {
  event: "notification.created" | string;
  notification?: NotificationItem;
  [key: string]: unknown;
}

export interface NotificationListResponse {
  results?: NotificationItem[];
  notifications?: NotificationItem[];
  unread_count?: number;
}

export interface UnreadCountResponse {
  count: number;
}

let activeSocket: WebSocket | null = null;
let isExplicitlyClosing = false;

export const setNotificationSocketInstance = (socket: WebSocket | null) => {
  activeSocket = socket;
};

export const getNotificationSocketInstance = (): WebSocket | null => {
  return activeSocket;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Constructs the WebSocket URL with fallback authentication query token
 */
export const getNotificationSocketUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://conekta.onrender.com/ws/notifications/";
  
  // Retrieve token from your client storage or state
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    console.warn("[Notifications] No auth token found. Skipping WS connection.");
    return "";
  }

  // Append token to the upgrade handshake
  const wsUrl = new URL(baseUrl);
  wsUrl.searchParams.set("token", token);

  return wsUrl.toString();
};

/**
 * Connect to the notification WebSocket with connection state locks
 */
export const connectNotificationSocket = (
  onMessage?: (message: NotificationSocketMessage) => void
): WebSocket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (
    activeSocket &&
    (activeSocket.readyState === WebSocket.OPEN ||
      activeSocket.readyState === WebSocket.CONNECTING)
  ) {
    return activeSocket;
  }

  const url = getNotificationSocketUrl();
  if (!url) return null;

  isExplicitlyClosing = false;
  console.log("[Notifications] Connecting to WebSocket...");

  const socket = new WebSocket(url);
  activeSocket = socket;

  socket.onopen = () => {
    console.log("[Notifications] WebSocket connected.");
  };

  socket.onmessage = (event) => {
    try {
      const message: NotificationSocketMessage = JSON.parse(event.data);
      console.log("[Notifications] Received:", message);
      onMessage?.(message);
    } catch (error) {
      console.error("[Notifications] Failed to parse message:", error);
    }
  };

  socket.onerror = (error) => {
    // Ignore suppressed errors caused by intentional teardowns in dev mode
    if (isExplicitlyClosing) return;
    console.error("[Notifications] WebSocket error:", error);
  };

  socket.onclose = (event) => {
    if (!isExplicitlyClosing) {
      console.log("[Notifications] WebSocket closed.", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    }

    if (activeSocket === socket) {
      activeSocket = null;
    }
  };

  return socket;
};

/**
 * Safely disconnect the active notification WebSocket
 */
export const disconnectNotificationSocket = () => {
  if (!activeSocket) return;

  isExplicitlyClosing = true;

  // Only close if it's already connecting or connected
  if (
    activeSocket.readyState === WebSocket.OPEN ||
    activeSocket.readyState === WebSocket.CONNECTING
  ) {
    activeSocket.close(1000, "Provider unmounted");
  }

  activeSocket = null;
};

export const sendSocketMessage = (data: unknown): boolean => {
  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    console.warn("[Notifications] WebSocket is not connected.");
    return false;
  }

  try {
    activeSocket.send(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to send WebSocket message:", error);
    return false;
  }
};

/**
 * REST API Definition
 */
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://conekta.onrender.com",
    credentials: "include",
  }),
  tagTypes: ["Notifications", "UnreadCount"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      { unread?: boolean } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.unread) {
          searchParams.set("unread", "true");
        }
        const queryString = searchParams.toString();
        return {
          url: `/api/v1/notifications/${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["Notifications"],
    }),
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: "/api/v1/notifications/unread_count/",
        method: "GET",
      }),
      providesTags: ["UnreadCount"],
    }),
    markNotificationAsRead: builder.mutation<unknown, string>({
      query: (uuid) => ({
        url: `/api/v1/notifications/${uuid}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
    markAllNotificationsAsRead: builder.mutation<unknown, void>({
      query: () => ({
        url: "/api/v1/notifications/mark-all-read/",
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;