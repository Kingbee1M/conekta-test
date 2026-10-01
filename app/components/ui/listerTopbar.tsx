'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { CiSearch } from 'react-icons/ci';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// RTK Query Imports
import { useGetUnreadCountQuery } from '@/shared/service/notification.socket';
import { useLazyGetListingsQuery } from '@/shared/service/listing.services';

// Synthesized Web Audio API sound for notification bell hover/click
const playBellSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Fallback if audio policy restricts context
  }
};

function getGreeting(firstName: string) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();

  if (month === 1 && day === 1) return `Happy New Year, ${firstName}! 🎉`;
  if (month === 2 && day === 14) return `Happy Valentine's Day, ${firstName}! ❤️`;
  if (month === 10 && day === 31) return `Happy Halloween, ${firstName}! 🎃`;
  if (month === 12 && day === 25) return `Merry Christmas, ${firstName}! 🎄`;

  if (hours < 12) return `Good morning, ${firstName}`;
  if (hours < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
}

export default function ListerTopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  // Unread Notifications Hook
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  // Lazy Query Hook for Listings Search
  const [triggerSearch, { data: searchResults, isFetching }] = useLazyGetListingsQuery();

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      if (modifierKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced Auto-Search Hook
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(() => {
      triggerSearch({ search: searchQuery.trim() });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, triggerSearch]);

  const { listerProfile, session } = useSelector(
    (state: RootState) => state.auth
  );

  const profileName = [
    listerProfile?.first_name,
    listerProfile?.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const currentName =
    profileName || session?.user?.profile?.full_name || 'User';

  const nameParts = currentName.split(/\s+/).filter(Boolean);

  const initial =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : currentName.charAt(0).toUpperCase() || '?';

  const firstName =
    listerProfile?.first_name ||
    session?.user?.profile?.full_name?.split(' ')[0] ||
    'there';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const greetingText = getGreeting(firstName);

  // Safely retrieve listed properties array
  const listings = searchResults?.data?.results || [];

  return (
    <>
      <header className="hidden md:flex w-full items-center justify-between gap-6">
        {/* GREETING */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-w-0 shrink-0"
        >
          <p className="mb-1 text-[13px] font-medium text-gray-400">
            {formattedDate}
          </p>

          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">
              {greetingText}
            </h1>
          </div>

          <p className="mt-1 text-[13px] text-gray-500">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </motion.div>

        {/* SEARCH BAR TRIGGER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1 max-w-xl mx-2"
        >
          <motion.button
            type="button"
            onClick={() => setSearchOpen(true)}
            whileHover={{ y: -1, scale: 1.005 }}
            whileTap={{ scale: 0.99 }}
            className="
              group
              flex h-11 w-full
              items-center gap-3
              rounded-2xl
              border border-gray-200/80
              bg-white
              px-4
              text-gray-500
              shadow-[0_2px_8px_rgba(0,0,0,0.03)]
              transition-colors
              hover:border-gray-300
              hover:text-gray-800
            "
          >
            <motion.div whileHover={{ scale: 1.12, rotate: -8 }}>
              <CiSearch className="text-[22px]" />
            </motion.div>

            <span className="flex-1 text-left text-[13px] font-medium truncate">
              Search properties, bookings, or settings...
            </span>

            <kbd
              className="
                hidden xl:inline-flex
                h-6
                items-center
                rounded-lg
                border border-gray-200
                bg-gray-50
                px-2
                text-[10px]
                font-medium
                text-gray-400
              "
            >
              {typeof navigator !== 'undefined' &&
              navigator.platform.toUpperCase().includes('MAC')
                ? '⌘ K'
                : 'Ctrl K'}
            </kbd>
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE ACTIONS */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          className="flex items-center gap-4 shrink-0"
        >
          {/* PROFILE ICON */}
          <Link href="/my-profile">
            <div
              className="relative flex items-center justify-end"
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              <AnimatePresence>
                {isProfileHovered && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="overflow-hidden bg-gray-100 rounded-full py-1.5 pl-4 pr-12 shadow-sm border border-gray-200/60"
                  >
                    <div className="whitespace-nowrap pr-1 text-right">
                      <p className="text-[12px] font-semibold text-gray-800 leading-tight">
                        {currentName}
                      </p>
                      <p className="text-[10px] font-medium text-gray-500">
                        View profile
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.span
                animate={isProfileHovered ? { rotate: -360, x: -6 } : { rotate: 0, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="
                  absolute right-0 z-10
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-secondary-green
                  text-sm
                  font-bold
                  text-tertiary-green
                  ring-4
                  ring-secondary-green/20
                  cursor-pointer
                  shadow-sm
                "
              >
                {initial}
              </motion.span>
            </div>
          </Link>

          <div className="h-6 w-px bg-gray-200/80 mx-1" />

          {/* NOTIFICATION BELL */}
          <Link href="/inbox" aria-label="Notifications">
            <motion.div
              onMouseEnter={playBellSound}
              onClick={playBellSound}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="
                relative
                flex h-11 w-11
                items-center justify-center
                rounded-2xl
                text-gray-500
                transition-colors
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <motion.div
                whileHover={{
                  rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <IoIosNotificationsOutline className="text-[25px]" />
              </motion.div>

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    ring-2
                    ring-white
                    shadow-sm
                    animate-pulse
                  "
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </motion.div>
          </Link>
        </motion.div>
      </header>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="
                fixed left-1/2 top-[15%] z-50
                w-[min(640px,calc(100vw-32px))]
                -translate-x-1/2
                overflow-hidden
                rounded-2xl
                border border-gray-200
                bg-white
                shadow-[0_25px_80px_rgba(0,0,0,0.15)]
              "
            >
              {/* SEARCH INPUT BAR */}
              <div className="flex items-center gap-3 px-5 py-4">
                <CiSearch className="shrink-0 text-2xl text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties by title or location..."
                  className="
                    min-w-0 flex-1 bg-transparent
                    text-base text-gray-900 outline-none
                    placeholder:text-gray-400
                  "
                />
                {isFetching && (
                  <span className="text-xs font-semibold text-tertiary-green animate-pulse">
                    Searching...
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="
                    rounded-lg border border-gray-200 bg-gray-50
                    px-2 py-1 text-[11px] font-medium text-gray-400
                    transition-colors hover:bg-gray-100 hover:text-gray-600
                  "
                >
                  ESC
                </button>
              </div>

              <div className="h-px bg-gray-100" />

              {/* SEARCH RESULTS CONTAINER */}
              <div className="max-h-[380px] overflow-y-auto px-5 py-4">
                {searchQuery.trim() ? (
                  <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Results ({listings.length})
                    </p>

                    {listings.length > 0 ? (
                      <div className="space-y-2">
                        {listings.map((item) => (
                          <Link
                            key={item.uuid}
                            href={`/properties/${item.uuid}`}
                            onClick={() => setSearchOpen(false)}
                            className="
                              flex items-center gap-3 rounded-xl p-2.5
                              transition-colors hover:bg-gray-50
                            "
                          >
                            {item.cover_image ? (
                              <Image
                                src={item.cover_image}
                                alt={item.title}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                <CiSearch className="text-xl" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-sm font-semibold text-gray-800">
                                {item.title}
                              </h4>
                              <p className="truncate text-xs text-gray-400">
                                {[item.location.street, item.location.city, item.location.state]
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            </div>

                            {item.base_price && (
                              <span className="text-xs font-bold text-gray-900">
                                {item.currency} {item.base_price.toLocaleString()}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : !isFetching ? (
                      <p className="py-8 text-center text-sm text-gray-500">
                        No properties found matching &quot;{searchQuery}&quot;
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="
                      mx-auto flex h-12 w-12 items-center justify-center
                      rounded-2xl bg-secondary-green text-tertiary-green
                    ">
                      <CiSearch className="text-2xl" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-800">
                      Search your properties
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Search by property name, location, type or status.
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="
                flex items-center justify-between
                border-t border-gray-100 bg-gray-50/70
                px-5 py-3
              ">
                <span className="text-[11px] text-gray-400">Press ESC to close</span>
                <span className="text-[11px] text-gray-400">Search</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}