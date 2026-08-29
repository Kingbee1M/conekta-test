'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';

import { useDispatch } from 'react-redux';

import { LuInfo, LuX } from 'react-icons/lu';

import {
  MdCheckCircleOutline,
  MdOutlineCancel,
} from 'react-icons/md';

import { FiAlertTriangle } from 'react-icons/fi';

import {
  notificationApi,
  NotificationItem,
  NotificationSocketMessage,
  connectNotificationSocket,
  disconnectNotificationSocket,
  getNotificationSocketInstance,
} from '@/shared/service/notification.socket';

import { playNotificationSound } from './notificationSound';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const generateId = (): string => {
  if (
    typeof window !== 'undefined' &&
    window.crypto?.randomUUID
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;
};

/* -------------------------------------------------------------------------- */
/* Toast types                                                                */
/* -------------------------------------------------------------------------- */

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?:
    | 'default'
    | 'success'
    | 'error'
    | 'warning';
  duration?: number;
}

interface NotificationContextType {
  toasts: Toast[];
  addToast: (
    toast: Omit<Toast, 'id'>
  ) => void;
  removeToast: (
    id: string
  ) => void;
}

const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined);

/* -------------------------------------------------------------------------- */
/* Toast styles                                                               */
/* -------------------------------------------------------------------------- */

const variantStyles = {
  success: {
    border: 'border-emerald-200',
    accent: 'bg-[#00AC72]',
    icon: (
      <MdCheckCircleOutline className="w-5 h-5 text-[#00AC72] shrink-0" />
    ),
    titleColor: 'text-gray-900',
  },

  error: {
    border: 'border-red-200',
    accent: 'bg-red-500',
    icon: (
      <MdOutlineCancel className="w-5 h-5 text-red-500 shrink-0" />
    ),
    titleColor: 'text-gray-900',
  },

  warning: {
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    icon: (
      <FiAlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
    ),
    titleColor: 'text-gray-900',
  },

  default: {
    border: 'border-gray-200',
    accent: 'bg-gray-800',
    icon: (
      <LuInfo className="w-5 h-5 text-gray-700 shrink-0" />
    ),
    titleColor: 'text-gray-900',
  },
};

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const dispatch = useDispatch();

  /* ------------------------------------------------------------------------ */
  /* Refs                                                                    */
  /* ------------------------------------------------------------------------ */

  const socketRef =
    useRef<WebSocket | null>(null);

  const connectSocketRef =
    useRef<(() => void) | null>(null);

  const reconnectTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | number| null>(
      null
    );

  const reconnectAttemptsRef =
    useRef(0);

  const isUnmountedRef =
    useRef(false);

  const intentionalDisconnectRef =
    useRef(false);

  const authErrorRef =
    useRef(false);

  const errorToastShownRef =
    useRef(false);

  /* ------------------------------------------------------------------------ */
  /* Toast functions                                                          */
  /* ------------------------------------------------------------------------ */

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );
    },
    []
  );

  const addToast = useCallback(
    (
      toast: Omit<Toast, 'id'>
    ) => {
      const id = generateId();

      const newToast: Toast = {
        ...toast,
        id,
      };

      setToasts((prev) => [
        ...prev,
        newToast,
      ]);

      const duration =
        toast.duration ?? 5000;

      if (
        duration > 0 &&
        typeof window !== 'undefined'
      ) {
        window.setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  /* ------------------------------------------------------------------------ */
  /* Notification type → toast variant                                       */
  /* ------------------------------------------------------------------------ */

  const getToastVariant = useCallback(
    (
      type?: NotificationItem['type']
    ): Toast['variant'] => {
      switch (type) {
        case 'application':
        case 'offer':
        case 'lease':
          return 'success';

        case 'kyc':
        case 'listing':
          return 'warning';

        default:
          return 'default';
      }
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /* Incoming notification                                                    */
  /* ------------------------------------------------------------------------ */

  const handleNotification =
    useCallback(
      (
        message: NotificationSocketMessage
      ) => {
        console.log(
          '[Notifications] Incoming message:',
          message
        );

        if (
          message.event !==
            'notification.created' ||
          !message.notification
        ) {
          console.log(
            '[Notifications] Ignoring event:',
            message.event
          );

          return;
        }

        const notification =
          message.notification;

        /* Refresh notification queries. */
        dispatch(
          notificationApi.util.invalidateTags([
            'Notifications',
            'UnreadCount',
          ])
        );

        /* Play notification sound. */
        try {
          playNotificationSound();
        } catch (error) {
          console.warn(
            '[Audio] Could not play notification sound:',
            error
          );
        }

        /* Show toast. */
        addToast({
          title:
            notification.title,
          description:
            notification.message,
          variant:
            getToastVariant(
              notification.type
            ),
          duration: 6000,
        });
      },
      [
        addToast,
        dispatch,
        getToastVariant,
      ]
    );

  /* ------------------------------------------------------------------------ */
  /* Connect                                                                  */
  /* ------------------------------------------------------------------------ */

  const connectSocket =
    useCallback(() => {
      if (
        isUnmountedRef.current
      ) {
        return;
      }

      /*
       * Don't keep retrying after the backend has
       * explicitly rejected authentication.
       */
      if (
        authErrorRef.current
      ) {
        console.warn(
          '[Notifications] Authentication failed. Waiting for a new session.'
        );

        return;
      }

      /*
       * Use the socket service as the source of truth.
       */
      const existingSocket =
        getNotificationSocketInstance();

      if (
        existingSocket &&
        (
          existingSocket.readyState ===
            WebSocket.OPEN ||
          existingSocket.readyState ===
            WebSocket.CONNECTING
        )
      ) {
        socketRef.current =
          existingSocket;

        return;
      }

      /*
       * Also check our local reference.
       */
      if (
        socketRef.current &&
        (
          socketRef.current.readyState ===
            WebSocket.OPEN ||
          socketRef.current.readyState ===
            WebSocket.CONNECTING
        )
      ) {
        return;
      }

      console.log(
        '[Notifications] Attempting WebSocket connection...'
      );

      intentionalDisconnectRef.current =
        false;

      const socket =
        connectNotificationSocket(
          handleNotification
        );

      if (!socket) {
        console.warn(
          '[Notifications] Could not create WebSocket.'
        );

        return;
      }

      socketRef.current =
        socket;

      /*
       * The socket service already handles
       * onmessage/onopen/onerror/onclose.
       *
       * These listeners only handle Provider-specific
       * behavior.
       */

      socket.addEventListener(
        'open',
        () => {
          /*
           * Ignore an old/stale socket.
           */
          if (
            socketRef.current !==
            socket
          ) {
            return;
          }

          console.log(
            '%c[Notifications] WebSocket connected successfully!',
            'color: #00AC72; font-weight: bold;'
          );

          reconnectAttemptsRef.current =
            0;

          errorToastShownRef.current =
            false;

          authErrorRef.current =
            false;

          addToast({
            title:
              'Real-Time Connected',

            description:
              'Notification service is live and ready.',

            variant:
              'success',

            duration: 3000,
          });
        }
      );

      socket.addEventListener(
        'error',
        (error) => {
          console.error(
            '[Notifications] Provider WebSocket error:',
            error
          );
        }
      );

      socket.addEventListener(
        'close',
        (event) => {
          /*
           * Only clear our ref if this is
           * still our current socket.
           */
          if (
            socketRef.current ===
            socket
          ) {
            socketRef.current =
              null;
          }

          console.log(
            '[Notifications] WebSocket closed:',
            {
              code:
                event.code,
              reason:
                event.reason,
              wasClean:
                event.wasClean,
            }
          );

          /*
           * 4001 means authentication failed.
           */
          if (
            event.code === 4001
          ) {
            authErrorRef.current =
              true;

            console.error(
              '[Notifications] Authentication rejected by server (4001).'
            );

            if (
              !errorToastShownRef.current
            ) {
              errorToastShownRef.current =
                true;

              addToast({
                title:
                  'Notification Authentication Failed',

                description:
                  'Your session could not be authenticated for real-time notifications.',

                variant:
                  'error',

                duration: 5000,
              });
            }

            return;
          }

          /*
           * Don't reconnect when this is
           * an intentional shutdown.
           */
          if (
            intentionalDisconnectRef.current ||
            isUnmountedRef.current
          ) {
            return;
          }

          /*
           * Prevent duplicate reconnect timers.
           */
          if (
            reconnectTimeoutRef.current !==
            null
          ) {
            window.clearTimeout(
              reconnectTimeoutRef.current
            );

            reconnectTimeoutRef.current =
              null;
          }

          reconnectAttemptsRef.current +=
            1;

          /*
           * 2s, 4s, 6s...
           * Maximum 30 seconds.
           */
          const delay =
            Math.min(
              reconnectAttemptsRef.current *
                2000,
              30000
            );

          console.log(
            `[Notifications] Reconnecting in ${
              delay / 1000
            }s...`
          );

          reconnectTimeoutRef.current =
            window.setTimeout(() => {
              reconnectTimeoutRef.current =
                null;

              if (
                isUnmountedRef.current ||
                intentionalDisconnectRef.current
              ) {
                return;
              }

              /*
               * DO NOT call connectSocket()
               * directly here.
               *
               * Use the ref so the React Compiler
               * doesn't report a declaration-order
               * / immutability violation.
               */
              connectSocketRef.current?.();
            }, delay);
        }
      );
    }, [
      addToast,
      handleNotification,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Keep reconnect ref synchronized                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
  isUnmountedRef.current = false;
  intentionalDisconnectRef.current = false;
  authErrorRef.current = false;

  // Initiate connection
  connectSocket();

  return () => {
  isUnmountedRef.current = true;
  intentionalDisconnectRef.current = true;

  if (reconnectTimeoutRef.current !== null) {
    window.clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;
  }

  const currentSocket = getNotificationSocketInstance();

  // ONLY close if the connection was fully opened.
  // Aborting during CONNECTING triggers an instant 1006 error during React Strict Mode double-invoke.
  if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
    disconnectNotificationSocket();
  }
};
}, [])

  /* ------------------------------------------------------------------------ */
  /* WebSocket lifecycle                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    isUnmountedRef.current =
      false;

    intentionalDisconnectRef.current =
      false;

    authErrorRef.current =
      false;

    /*
     * Establish the connection.
     */
    connectSocket();

    return () => {
      console.log(
        '[Notifications] Provider cleanup.'
      );

      isUnmountedRef.current =
        true;

      intentionalDisconnectRef.current =
        true;

      /*
       * Cancel pending reconnect.
       */
      if (
        reconnectTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          reconnectTimeoutRef.current
        );

        reconnectTimeoutRef.current =
          null;
      }

      /*
       * Close active socket.
       */
      disconnectNotificationSocket();

      socketRef.current =
        null;
    };
  }, [connectSocket]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 w-full max-w-88 pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config =
            variantStyles[
              toast.variant ??
                'default'
            ];

          return (
            <div
              key={toast.id}
              className={`relative overflow-hidden bg-white ${config.border} border rounded-xl shadow-lg shadow-gray-200/50 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-4`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`}
              />

              <div className="flex items-start gap-3 p-3.5 pl-4">
                <div className="mt-0.5">
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  {toast.title && (
                    <h4
                      className={`text-xs font-bold ${config.titleColor} leading-snug tracking-tight`}
                    >
                      {toast.title}
                    </h4>
                  )}

                  {toast.description && (
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">
                      {
                        toast.description
                      }
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeToast(
                      toast.id
                    )
                  }
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                  aria-label="Close notification"
                >
                  <LuX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useNotification() {
  const context =
    useContext(
      NotificationContext
    );

  if (
    context === undefined
  ) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }

  return context;
}