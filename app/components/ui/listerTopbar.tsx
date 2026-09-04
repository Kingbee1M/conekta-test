'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { CiSearch } from 'react-icons/ci';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoChevronDownSharp } from 'react-icons/io5';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Import the RTK Query hook
import { useGetUnreadCountQuery } from '@/shared/service/notification.socket'; // Adjust path as needed

export default function ListerTopBar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch dynamic unread notifications count
    const { data: unreadData } = useGetUnreadCountQuery();
    const unreadCount = unreadData?.count ?? 0;

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

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
        profileName || session?.user?.profile?.full_name || '';

    const nameParts = currentName.split(/\s+/).filter(Boolean);

    const initial =
        nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : currentName.charAt(0).toUpperCase() || '?';

    const role = session?.active_role || 'Lister';

    const firstName =
        listerProfile?.first_name ||
        session?.user?.profile?.full_name?.split(' ')[0] ||
        'there';

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    return (
        <>
            <header className="hidden md:flex w-full items-center justify-between">
                {/* GREETING */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="min-w-0"
                >
                    <p className="mb-1 text-[13px] font-medium text-gray-400">
                        {formattedDate}
                    </p>

                    <div className="flex items-center gap-2">
                        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">
                            Good morning, {firstName}
                        </h1>

                        <motion.span
                            initial={{ rotate: 0 }}
                            whileHover={{
                                rotate: [0, -12, 12, -8, 8, 0],
                                transition: { duration: 0.5 },
                            }}
                            className="inline-block origin-bottom text-xl cursor-default"
                        >
                            👋
                        </motion.span>
                    </div>

                    <p className="mt-1 text-[13px] text-gray-500">
                        Here&apos;s what&apos;s happening with your properties today.
                    </p>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.05,
                        ease: 'easeOut',
                    }}
                    className="flex items-center gap-5"
                >
                    {/* SEARCH */}
                    <motion.button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        whileHover={{
                            y: -2,
                            scale: 1.01,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                        }}
                        className="
                            group
                            flex h-11 min-w-47.5
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
                        <motion.div
                            whileHover={{
                                scale: 1.12,
                                rotate: -8,
                            }}
                        >
                            <CiSearch className="text-[22px]" />
                        </motion.div>

                        <span className="flex-1 text-left text-[13px] font-medium">
                            Search properties
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

                    {/* NOTIFICATIONS */}
                    <Link
                        href="/inbox"
                        aria-label="Notifications"
                    >
                        <motion.div
                            whileHover={{
                                y: -2,
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                            }}
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
                                    rotate: [0, -10, 10, -7, 7, 0],
                                }}
                                transition={{ duration: 0.45 }}
                            >
                                <IoIosNotificationsOutline className="text-[25px]" />
                            </motion.div>

                            {/* Dynamic Notification Badge */}
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

                    {/* DIVIDER */}
                    <div className="h-8 w-px bg-gray-200/80" />

                    {/* ROLE SELECTOR */}
                    <motion.button
                        type="button"
                        whileHover={{
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                        }}
                        className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            px-2
                            py-1.5
                            transition-colors
                            hover:bg-gray-50
                        "
                    >
                        <motion.span
                            whileHover={{
                                scale: 1.08,
                                rotate: 3,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                            }}
                            className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-xl
                                bg-secondary-green
                                text-xs
                                font-bold
                                text-tertiary-green
                            "
                        >
                            L
                        </motion.span>

                        <div className="hidden xl:block text-left">
                            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">
                                Current role
                            </p>

                            <p className="mt-0.5 text-[13px] font-semibold text-gray-800">
                                {role}
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ y: 2 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                            }}
                        >
                            <IoChevronDownSharp
                                className="
                                    text-[11px]
                                    text-gray-400
                                    transition-colors
                                    group-hover:text-gray-700
                                "
                            />
                        </motion.div>
                    </motion.button>

                    {/* PROFILE */}
                    <Link href="/my-profile">
                        <motion.div
                            whileHover={{
                                y: -2,
                                x: 1,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 25,
                            }}
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                px-2
                                py-1.5
                                transition-colors
                                hover:bg-gray-50
                            "
                        >
                            <motion.span
                                whileHover={{
                                    scale: 1.08,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 20,
                                }}
                                className="
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
                                "
                            >
                                {initial}
                            </motion.span>

                            <div className="hidden xl:block max-w-32.5">
                                <p className="truncate text-[13px] font-semibold text-gray-800">
                                    {currentName || 'Profile'}
                                </p>

                                <p className="mt-0.5 text-[11px] text-gray-400 transition-colors group-hover:text-gray-500">
                                    View profile
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            </header>

            <AnimatePresence>
                {searchOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSearchOpen(false)}
                            className="
                                fixed
                                inset-0
                                z-40
                                bg-black/20
                                backdrop-blur-[2px]
                            "
                        />

                        {/* Search dialog */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -20,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -15,
                                scale: 0.98,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 350,
                                damping: 28,
                            }}
                            className="
                                fixed
                                left-1/2
                                top-[15%]
                                z-50
                                w-[min(640px,calc(100vw-32px))]
                                -translate-x-1/2
                                overflow-hidden
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                shadow-[0_25px_80px_rgba(0,0,0,0.15)]
                            "
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4">
                                <CiSearch className="shrink-0 text-2xl text-gray-400" />

                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Search your properties..."
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-base
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        px-2
                                        py-1
                                        text-[11px]
                                        font-medium
                                        text-gray-400
                                        transition-colors
                                        hover:bg-gray-100
                                        hover:text-gray-600
                                    "
                                >
                                    ESC
                                </button>
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Search content */}
                            <div className="px-5 py-8">
                                {searchQuery ? (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Search results
                                        </p>

                                        <p className="mt-3 text-sm text-gray-500">
                                            Searching for{' '}
                                            <span className="font-medium text-gray-800">
                                                &quot;{searchQuery}&quot;
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="
                                            mx-auto
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-secondary-green
                                            text-tertiary-green
                                        ">
                                            <CiSearch className="text-2xl" />
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-gray-800">
                                            Search your properties
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Search by property name, location,
                                            type or status.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="
                                flex
                                items-center
                                justify-between
                                border-t
                                border-gray-100
                                bg-gray-50/70
                                px-5
                                py-3
                            ">
                                <span className="text-[11px] text-gray-400">
                                    Press ESC to close
                                </span>

                                <span className="text-[11px] text-gray-400">
                                    Search
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}