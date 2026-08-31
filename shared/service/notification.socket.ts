import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

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

/* -------------------------------------------------------------------------- */
/* WebSocket                                                                  */
/* -------------------------------------------------------------------------- */

let activeSocket: WebSocket | null = null;
let isExplicitlyClosing = false;

/**
 * Store the active notification socket.
 */
export const setNotificationSocketInstance = (
  socket: WebSocket | null
) => {
  activeSocket = socket;
};

/**
 * Get the active notification socket.
 */
export const getNotificationSocketInstance =
  (): WebSocket | null => {
    return activeSocket;
  };

/**
 * WebSocket URL.
 *
 * Authentication is handled by the backend using
 * the HttpOnly access-token cookie.
 *
 * IMPORTANT:
 * No token is read from localStorage.
 * No ?token= parameter is added.
 */
export const getNotificationSocketUrl =
  (): string => {
    return (
      process.env.NEXT_PUBLIC_WS_URL ||
      "wss://conekta.onrender.com/ws/notifications/"
    );
  };

/**
 * Connect to the notification WebSocket.
 */
export const connectNotificationSocket = (
  onMessage?: (
    message: NotificationSocketMessage
  ) => void
): WebSocket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  /*
   * Reuse an existing socket if it is already
   * connected or in the process of connecting.
   */
  if (
    activeSocket &&
    (
      activeSocket.readyState === WebSocket.OPEN ||
      activeSocket.readyState ===
        WebSocket.CONNECTING
    )
  ) {
    console.log(
      "[Notifications] Reusing existing WebSocket."
    );

    return activeSocket;
  }

  isExplicitlyClosing = false;

  const url = getNotificationSocketUrl();

  console.log(
    "[Notifications] Connecting to WebSocket..."
  );

  /*
   * The browser handles the HttpOnly cookie
   * during the WebSocket handshake.
   */
  const socket = new WebSocket(url);

  activeSocket = socket;

  socket.onopen = () => {
    console.log(
      "[Notifications] WebSocket connected."
    );
  };

  socket.onmessage = (event) => {
    try {
      const message: NotificationSocketMessage =
        JSON.parse(event.data);

      console.log(
        "[Notifications] Received:",
        message
      );

      onMessage?.(message);
    } catch (error) {
      console.error(
        "[Notifications] Failed to parse message:",
        error
      );
    }
  };

  socket.onerror = (error) => {
    if (isExplicitlyClosing) {
      return;
    }

    console.error(
      "[Notifications] WebSocket error:",
      error
    );
  };

  socket.onclose = (event) => {
    if (!isExplicitlyClosing) {
      console.log(
        "[Notifications] WebSocket closed:",
        {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        }
      );
    }

    if (activeSocket === socket) {
      activeSocket = null;
    }
  };

  return socket;
};

/**
 * Disconnect the active notification WebSocket.
 */
export const disconnectNotificationSocket =
  () => {
    const socket = activeSocket;

    if (!socket) {
      return;
    }

    isExplicitlyClosing = true;

    activeSocket = null;

    /*
     * Only close an active/connecting socket.
     */
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState ===
        WebSocket.CONNECTING
    ) {
      socket.close(
        1000,
        "Provider unmounted"
      );
    }
  };

/**
 * Send a message through the active WebSocket.
 */
export const sendSocketMessage = (
  data: unknown
): boolean => {
  if (
    !activeSocket ||
    activeSocket.readyState !==
      WebSocket.OPEN
  ) {
    console.warn(
      "[Notifications] WebSocket is not connected."
    );

    return false;
  }

  try {
    activeSocket.send(
      JSON.stringify(data)
    );

    return true;
  } catch (error) {
    console.error(
      "[Notifications] Failed to send WebSocket message:",
      error
    );

    return false;
  }
};

/* -------------------------------------------------------------------------- */
/* REST API                                                                   */
/* -------------------------------------------------------------------------- */

export const notificationApi =
  createApi({
    reducerPath:
      "notificationApi",

    baseQuery: fetchBaseQuery({
      baseUrl:
        "https://conekta.onrender.com",

      credentials: "include",
    }),

    tagTypes: [
      "Notifications",
      "UnreadCount",
    ],

    endpoints: (builder) => ({
      getNotifications:
        builder.query<
          NotificationListResponse,
          { unread?: boolean } | void
        >({
          query: (params) => {
            const searchParams =
              new URLSearchParams();

            if (params?.unread) {
              searchParams.set(
                "unread",
                "true"
              );
            }

            const queryString =
              searchParams.toString();

            return {
              url: `/api/v1/notifications/${
                queryString
                  ? `?${queryString}`
                  : ""
              }`,
              method: "GET",
            };
          },

          providesTags: [
            "Notifications",
          ],
        }),

      getUnreadCount:
        builder.query<
          UnreadCountResponse,
          void
        >({
          query: () => ({
            url: "/api/v1/notifications/unread_count/",
            method: "GET",
          }),

          providesTags: [
            "UnreadCount",
          ],
        }),

      markNotificationAsRead:
        builder.mutation<
          unknown,
          string
        >({
          query: (uuid) => ({
            url: `/api/v1/notifications/${uuid}/read/`,
            method: "POST",
          }),

          invalidatesTags: [
            "Notifications",
            "UnreadCount",
          ],
        }),

      markAllNotificationsAsRead:
        builder.mutation<
          unknown,
          void
        >({
          query: () => ({
            url: "/api/v1/notifications/mark-all-read/",
            method: "POST",
          }),

          invalidatesTags: [
            "Notifications",
            "UnreadCount",
          ],
        }),
    }),
  });

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;