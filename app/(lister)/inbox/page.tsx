'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowUpRight,
  Wrench,
  CheckCircle2,
  InboxIcon,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import {
  LuFileText,
  LuTag,
  LuKey,
  LuUserCheck,
  LuInfo,
  LuExternalLink,
} from 'react-icons/lu';

// RTK Query Services & Types
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/shared/service/notification.services';
import { NotificationItem } from '@/shared/service/notification.types';

// Redux Slice Actions & Types
import {
  setUnreadOnlyFilter,
  setActiveNotification,
  clearActiveNotification,
} from '@/shared/store/notification.slice';
import { RootState } from '@/shared/store/store';

// Loading Skeleton UI matching Lister styling
const ListerNotificationSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5 animate-pulse"
      >
        <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded-md w-1/3" />
            <div className="h-2.5 bg-slate-200 rounded-md w-12" />
          </div>
          <div className="h-2 bg-slate-200 rounded-md w-3/4" />
          <div className="h-2 bg-slate-200 rounded-md w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

export default function Inbox() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 1. Redux Selectors
  const unreadOnlyFilter = useSelector(
    (state: RootState) => state.notification.unreadOnlyFilter
  );
  const activeNotification = useSelector(
    (state: RootState) => state.notification.activeNotification
  );

  // 2. RTK Query Hooks
  const { data, isLoading, isFetching } = useGetNotificationsQuery(
    {
      page: currentPage,
      page_size: pageSize,
      unread: unreadOnlyFilter ? true : undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 3. Helper to determine icon by notification category
  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application':
        return <LuFileText className="w-4 h-4 text-sky-600 shrink-0" />;
      case 'offer':
        return <LuTag className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'lease':
        return <LuKey className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'listing':
        return <ArrowUpRight className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'kyc':
        return <LuUserCheck className="w-4 h-4 text-indigo-600 shrink-0" />;
      default:
        return <LuInfo className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  // 4. Helper for deep link extraction from payload
  const getNotificationLink = (item: NotificationItem): string | null => {
    if (!item.data || typeof item.data === 'string') return null;
    const { application_uuid, offer_uuid, lease_uuid, listing_uuid } = item.data;

    if (item.type === 'application' && application_uuid) return `/applications/${application_uuid}`;
    if (item.type === 'offer' && offer_uuid) return `/offers/${offer_uuid}`;
    if (item.type === 'lease' && lease_uuid) return `/leases/${lease_uuid}`;
    if (item.type === 'listing' && listing_uuid) return `/listings/${listing_uuid}`;
    if (item.type === 'kyc') return `/settings/kyc`;

    return null;
  };

  // 5. Client side search filter
  const filteredNotifications = notifications.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  });

  // 6. Handle Item Selection & Mark-as-read
  const handleSelectNotification = (item: NotificationItem) => {
    dispatch(setActiveNotification(item));
    if (!item.read_at) {
      markAsRead(item.uuid);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 md:p-10 space-y-6 overflow-x-hidden">

      {/* HEADER TOPBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Inbox
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage system activity, tenant requests, and notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => markAllAsRead()}
          disabled={isMarkingAll || notifications.length === 0}
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-green hover:bg-emerald-700 px-4 py-2.5 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* DYNAMIC INBOX GRID */}
      <div className="flex gap-5 items-start relative min-h-145">

        {/* LEFT PANEL: NOTIFICATION LIST */}
        <motion.div
          animate={{
            width: activeNotification ? '420px' : '100%',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 shrink-0 overflow-hidden"
        >
          {/* SEARCH BAR */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full bg-slate-100/80 text-xs font-medium text-slate-800 pl-10 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary-green/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* FILTER CHIPS */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                dispatch(setUnreadOnlyFilter(false));
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                !unreadOnlyFilter
                  ? 'bg-primary-green text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                dispatch(setUnreadOnlyFilter(true));
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                unreadOnlyFilter
                  ? 'bg-primary-green text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              Unread Only
            </button>
          </div>

          {/* NOTIFICATION FEED */}
          {isLoading || isFetching ? (
            <ListerNotificationSkeleton />
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              {unreadOnlyFilter ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">All caught up!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No unread notifications left.</p>
                </>
              ) : (
                <>
                  <InboxIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No notifications found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your updates will appear here.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-135 overflow-y-auto pr-1">
              {filteredNotifications.map((item) => {
                const isSelected = activeNotification?.uuid === item.uuid;
                const isUnread = item.read_at === null;

                return (
                  <div
                    key={item.uuid}
                    onClick={() => handleSelectNotification(item)}
                    className={`relative flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary-green/10 border border-primary-green/20 shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 absolute left-2 top-1/2 -translate-y-1/2" />
                    )}

                    {/* Icon Avatar Frame */}
                    <div className="w-11 h-11 rounded-full shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200/60">
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mb-1.5">
                        {item.message}
                      </p>

                      <span className="inline-block text-[9px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* RIGHT PANEL: NOTIFICATION DETAIL READ VIEW */}
        <AnimatePresence mode="popLayout">
          {activeNotification && (
            <motion.div
              key={activeNotification.uuid}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 min-h-145 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* HEADER TOPBAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {getNotificationIcon(activeNotification.type)}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {activeNotification.title}
                        </h2>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                          {activeNotification.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Received {new Date(activeNotification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT ACTION BUTTONS */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getNotificationLink(activeNotification) && (
                        <Link
                          href={getNotificationLink(activeNotification)!}
                          className="px-3.5 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View target item</span>
                          <LuExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {activeNotification.type === 'application' && (
                        <button
                          type="button"
                          className="px-4 py-2 rounded-full bg-primary-green hover:bg-emerald-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">Take Action</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch(clearActiveNotification())}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-1 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* NOTIFICATION MESSAGE BODY */}
                <div className="py-6">
                  <div className="text-center my-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Notification Details
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 max-w-2xl">
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                      {activeNotification.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER METADATA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Notification ID: {activeNotification.uuid}</span>
                <span className="capitalize">Status: {activeNotification.read_at ? 'Read' : 'Unread'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}