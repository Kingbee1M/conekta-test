'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuBell,
  LuCheckCheck,
  LuFileText,
  LuTag,
  LuKey,
  LuUserCheck,
  LuInfo,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuExternalLink,
  LuArrowLeft,
  LuInbox,
} from 'react-icons/lu';
import { HomeIcon, CheckCircle2 } from 'lucide-react';

import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/shared/service/notification.services';

import { NotificationItem } from '@/shared/service/notification.types';

import {
  setUnreadOnlyFilter,
  setActiveNotification,
  clearActiveNotification,
} from '@/shared/store/notification.slice';

import { RootState } from '@/shared/store/store';

// Skeleton Component for Loading State
const NotificationSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-start gap-4 animate-pulse"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
            <div className="h-3 bg-slate-200 rounded-md w-16" />
          </div>
          <div className="h-3 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-200 rounded-md w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default function NotificationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Select values from notification slice
  const unreadOnlyFilter = useSelector(
    (state: RootState) => state.notification.unreadOnlyFilter
  );
  const activeNotification = useSelector(
    (state: RootState) => state.notification.activeNotification
  );

  // RTK Query hooks
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

  // Helper for dynamic contextual icons
  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application':
        return <LuFileText className="w-5 h-5 text-lister-blue shrink-0" />;
      case 'offer':
        return <LuTag className="w-5 h-5 text-primary-green shrink-0" />;
      case 'lease':
        return <LuKey className="w-5 h-5 text-purple-600 shrink-0" />;
      case 'listing':
        return <HomeIcon className="w-5 h-5 text-artisan-orange shrink-0" />;
      case 'kyc':
        return <LuUserCheck className="w-5 h-5 text-indigo-600 shrink-0" />;
      default:
        return <LuInfo className="w-5 h-5 text-secondary-color shrink-0" />;
    }
  };

  // Helper for deep-linking payload entity references
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

  const handleNotificationClick = (item: NotificationItem) => {
    dispatch(setActiveNotification(item));
    if (!item.read_at) {
      markAsRead(item.uuid);
    }
  };

  return (
    <main className="min-h-screen bg-app-background text-text-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Button & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-secondary-color hover:text-text-primary transition-colors cursor-pointer group"
          >
            <LuArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-lister-background p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2.5">
                <LuBell className="text-primary-green w-6 h-6" /> Notifications
              </h1>
              <p className="text-xs sm:text-sm text-secondary-color mt-1 font-medium">
                Manage your activity updates, applications, and system alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll || notifications.length === 0}
              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary-green hover:bg-primary-green-hover px-4 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
            >
              <LuCheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => {
              dispatch(setUnreadOnlyFilter(false));
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !unreadOnlyFilter
                ? 'bg-primary-green text-white shadow-xs'
                : 'text-secondary-color hover:bg-tertiary-green'
            }`}
          >
            All Notifications
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch(setUnreadOnlyFilter(true));
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              unreadOnlyFilter
                ? 'bg-primary-green text-white shadow-xs'
                : 'text-secondary-color hover:bg-tertiary-green'
            }`}
          >
            Unread Only
          </button>
        </div>

        {/* Notifications Feed */}
        {isLoading || isFetching ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          unreadOnlyFilter ? (
            /* Empty State: Unread Filter */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-tertiary-green flex items-center justify-center text-primary-green">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">No unread notifications</h3>
              <p className="text-xs text-secondary-color mt-1">
                You&apos;ve caught up on all your alerts. Switch to &ldquo;All Notifications&ldquo; to view your history.
              </p>
            </div>
          ) : (
            /* Empty State: All Notifications Filter */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <LuInbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">No notifications yet</h3>
              <p className="text-xs text-secondary-color mt-1">
                When you receive updates on applications, offers, or leases, they will appear here.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {notifications.map((item) => {
                const isUnread = item.read_at === null;
                const link = getNotificationLink(item);

                return (
                  <motion.div
                    key={item.uuid}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                      isUnread
                        ? 'bg-tertiary-green/60 border-primary-fixed-dim shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Left Accent Bar for unread items */}
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-green" />
                    )}

                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0 mt-0.5">
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-secondary-color shrink-0">
                          {new Date(item.created_at).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-secondary-color mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      {link && (
                        <Link
                          href={link}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-2.5 text-xs font-extrabold text-primary-green hover:text-primary-green-hover transition-colors"
                        >
                          View Details <LuExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {isUnread && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-primary-green shrink-0 mt-2"
                        title="Unread"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs font-semibold text-secondary-color">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-xl border border-slate-200 text-text-primary hover:bg-tertiary-green transition-all disabled:opacity-40 cursor-pointer"
              >
                <LuChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-xl border border-slate-200 text-text-primary hover:bg-tertiary-green transition-all disabled:opacity-40 cursor-pointer"
              >
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Notification Detail Modal */}
      <AnimatePresence>
        {activeNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative"
            >
              <button
                type="button"
                onClick={() => dispatch(clearActiveNotification())}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LuX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-tertiary-green border border-primary-fixed-dim">
                  {getNotificationIcon(activeNotification.type)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-green">
                    {activeNotification.type}
                  </span>
                  <h3 className="text-base font-bold text-text-primary leading-snug">
                    {activeNotification.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-secondary-color leading-relaxed mb-6">
                {activeNotification.message}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                <span>
                  Received:{' '}
                  {new Date(activeNotification.created_at).toLocaleString()}
                </span>
                {getNotificationLink(activeNotification) && (
                  <Link
                    href={getNotificationLink(activeNotification)!}
                    onClick={() => dispatch(clearActiveNotification())}
                    className="flex items-center gap-1 font-bold text-primary-green hover:underline"
                  >
                    Open <LuExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}