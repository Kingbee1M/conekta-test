'use client';

import AddPropertyModal from '@/app/components/ui/addProperty';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { FlatUserData, Listing } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import Image from 'next/image';
import { IoChevronDownOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SortOption } from '@/types';
import button1 from '@/public/svg/button-option1.svg';
import button2 from '@/public/svg/button-option2.svg';
import { PropertyCategoryFilter } from '@/shared/enums/propertysFilter.enums';

import { FaBuildingColumns, FaDollarSign } from "react-icons/fa6";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { useLazyGetListingsQuery } from '@/shared/service/listing.services';
import ListerPropertyCard from '@/app/components/lister/ListerPropertyCard';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

import { motion, AnimatePresence } from 'framer-motion';
import { CiSearch } from 'react-icons/ci';
import { LuKey } from 'react-icons/lu';
import { useGetUnreadCountQuery } from '@/shared/service/notification.socket';

export default function Properties() {
    const [openAdd, setOpenAdd] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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

    const firstName =
        listerProfile?.first_name ||
        session?.user?.profile?.full_name?.split(' ')[0] ||
        'there';
    
    
    const propertiesList = useSelector(
        (state: RootState) => state.listing.propertiesList
    );

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('Newest');
    const sortRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState<3 | 4 | 5>(3);
    const [handleFilter, setHandleFilter] = useState<PropertyCategoryFilter>(PropertyCategoryFilter.ALL);
    const { data: unreadData } = useGetUnreadCountQuery();
    const unreadCount = unreadData?.count ?? 0;
    // RTK Lazy Query
    const [triggerGetListings, { data: listingsData, isLoading, isFetching }] = useLazyGetListingsQuery();

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchVal);
            setCurrentPage(1); // Reset page on new search
        }, 400);
        return () => clearTimeout(handler);
    }, [searchVal]);

    // Fetch listings when page or debounced search changes
    useEffect(() => {
        triggerGetListings({
            page: currentPage,
            search: debouncedSearch || undefined,
        }, true);
    }, [currentPage, debouncedSearch, triggerGetListings]);

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const pillNav = [
        { title: 'All Properties', icon: FaBuildingColumns, filter: PropertyCategoryFilter.ALL },
        { title: 'Residential', icon: BsFillHouseCheckFill, filter: PropertyCategoryFilter.RESIDENTIAL },
        { title: 'Commercial', icon: FaDollarSign, filter: PropertyCategoryFilter.COMMERCIAL },
        { title: 'Short Lets', icon: LuKey, filter: PropertyCategoryFilter.SHORT_LET },
    ];

    const sortOptions: SortOption[] = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

    // Pagination Meta Calculation
    const paginationMeta = useMemo(() => {
        // Fallbacks based on backend PaginatedListingList response structure
        const totalCount = listingsData?.data?.count ?? propertiesList?.length ?? 0;
        const hasNext = Boolean(listingsData?.data?.next);
        const hasPrevious = Boolean(listingsData?.data?.previous);
        const totalPages = Math.ceil(totalCount / 10) || 1;

        return {
            totalCount,
            hasNext,
            hasPrevious,
            totalPages,
        };
    }, [listingsData, propertiesList]);

    // --- FILTER & SORT PROCESSING ---
    const processedResults = useMemo(() => {
        if (!propertiesList || !Array.isArray(propertiesList)) {
            return [];
        }

        // 1. Filter Stage
        const filtered = propertiesList.filter((item: Listing) => {
            if (
                !handleFilter ||
                handleFilter === PropertyCategoryFilter.ALL ||
                String(handleFilter).toUpperCase() === 'ALL'
            ) {
                return true;
            }

            const rawRecord = item as unknown as ListingResult;
            const rawCategory =
                rawRecord.category ||
                (rawRecord as Record<string, unknown>).property_category ||
                '';

            const targetFilter = String(handleFilter).trim().toUpperCase();
            const currentCategory = String(rawCategory).trim().toUpperCase();

            return (
                currentCategory === targetFilter ||
                currentCategory.includes(targetFilter)
            );
        });

        // 2. Sort Stage
        const sorted = [...filtered].sort((a: Listing, b: Listing) => {
            const rawA = a as unknown as Record<string, unknown>;
            const rawB = b as unknown as Record<string, unknown>;

            const priceA = Number(rawA.base_price || rawA.price || 0);
            const priceB = Number(rawB.base_price || rawB.price || 0);

            const dateA = new Date((rawA.created_at || rawA.createdAt || 0) as string | number).getTime();
            const dateB = new Date((rawB.created_at || rawB.createdAt || 0) as string | number).getTime();

            const viewsA = Number(rawA.views || rawA.views_count || 0);
            const viewsB = Number(rawB.views || rawB.views_count || 0);

            switch (sortBy) {
                case 'Price: Low to High':
                    return priceA - priceB;
                case 'Price: High to Low':
                    return priceB - priceA;
                case 'Most Popular':
                    return viewsB - viewsA;
                case 'Newest':
                default:
                    return dateB - dateA;
            }
        });

        return sorted;
    }, [propertiesList, handleFilter, sortBy]);

    // Dynamic grid columns layout map based on selection
    const gridColsClass = {
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5',
    }[cols];

    const isDataLoading = isLoading || isFetching;

    return (
        <section className='flex flex-col gap-5 md:gap-6 p-4 md:p-0'>
            {/* TOP HEADER SECTION */}
            <div className="w-full">
                {/* DESKTOP / TABLET TOP BAR */}
                <header className="hidden md:flex w-full items-center justify-between">
                    {/* GREETING */}
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="min-w-0"
                    >
                        <p className="mb-1 text-[13px] font-medium text-gray-400">
                            {new Intl.DateTimeFormat('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date())}
                        </p>

                        <div className="flex items-center gap-2">
                            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">
                                Good morning, {firstName || 'there'}
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

                    {/* RIGHT SIDE ACTIONS */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
                        className="flex items-center gap-4"
                    >
                        {/* ADD PROPERTY BUTTON */}
                        <motion.button
                            type="button"
                            onClick={() => setOpenAdd(true)}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="
                                flex h-11 items-center gap-2 rounded-2xl
                                bg-primary-green px-4 text-xs font-semibold
                                text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer
                            "
                        >
                            <IoMdAdd className="text-lg" />
                            <span>Add Property</span>
                        </motion.button>

                        {/* SEARCH TRIGGER BUTTON */}
                        <div className="relative flex items-center bg-[#F0F0F0] px-3.5 rounded-2xl border border-gray-200/60 h-11 w-64 text-gray-500">
                            <CiSearch className="text-[20px] shrink-0 mr-2 text-gray-400" />
                            <input
                                type="search"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                className="w-full bg-transparent text-[13px] font-medium outline-none text-gray-800 placeholder:text-gray-400"
                                placeholder="Search properties..."
                            />
                        </div>

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

                        {/* PROFILE LINK */}
                        <Link href="/my-profile">
                            <motion.div
                                whileHover={{ y: -2, x: 1 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-gray-50"
                            >
                                <motion.span
                                    whileHover={{ scale: 1.08 }}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-green text-sm font-bold text-tertiary-green ring-4 ring-secondary-green/20"
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

                {/* MOBILE TOP BAR HEADER */}
                <div className="flex md:hidden flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                        <div className="flex items-center gap-3">
                            <Link href="/lister/inbox" className="text-gray-600 hover:text-gray-900">
                                <IoIosNotificationsOutline className="text-2xl" />
                            </Link>
                            <Link href="/my-profile" className="h-8 w-8 rounded-full bg-secondary-green flex items-center justify-center font-bold text-tertiary-green text-xs">
                                {initial}
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center w-full">
                        <div className="flex gap-2 items-center bg-[#F0F0F0] px-3 rounded-xl border border-gray-200/40 h-10 flex-1">
                            <CiSearch className="text-gray-400 text-lg shrink-0" />
                            <input
                                type="search"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                className="w-full bg-transparent text-sm outline-none text-gray-800"
                                placeholder="Search properties..."
                            />
                        </div>
                        <button
                            onClick={() => setOpenAdd(true)}
                            className="flex items-center justify-center gap-1 bg-primary-green text-white px-3 h-10 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                        >
                            <IoMdAdd className="text-base" /> Add
                        </button>
                    </div>
                </div>

                {/* ADD PROPERTY MODAL */}
                <AddPropertyModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
            </div>

            {/* FILTER & SORT TOOLS ROW */}
            <div className='w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-2 lg:mt-5'>
                {/* PILL NAVIGATIONS */}
                <div className='w-full lg:w-auto flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 text-sm scroll-smooth snap-x'>
                    {pillNav.map((pill, index) => {
                        const isActive = handleFilter === pill.filter;
                        return (
                            <button 
                                onClick={() => setHandleFilter(pill.filter)} 
                                key={index} 
                                className={`flex gap-2 px-3.5 py-2 rounded-full items-center transition-all text-xs font-semibold cursor-pointer whitespace-nowrap snap-start ${
                                    isActive
                                        ? 'bg-primary-green text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <pill.icon className="text-[13px]" />
                                <span className={`${isActive ? 'text-white': ''}`}>{pill.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid Layout Toggles & Sort Dropdown */}
                <div className="flex gap-3 justify-between sm:justify-end items-center w-full lg:w-auto">
                    <div className='hidden sm:flex gap-1.5 items-center bg-gray-100 p-1 rounded-lg'>
                        <button className={`p-1.5 rounded-md transition-colors ${cols === 3 ? 'bg-white shadow-sm' : 'text-gray-400'}`} onClick={() => setCols(3)}>
                            <Image src={button1} alt="3 Grid" width={14} height={14} />
                        </button>
                        <button className={`p-1.5 rounded-md transition-colors ${cols === 4 ? 'bg-white shadow-sm' : 'text-gray-400'}`} onClick={() => setCols(4)}>
                            <Image src={button2} alt="4 Grid" width={14} height={14} />
                        </button>                
                    </div>

                    {/* Sort Dropdown */}
                    <div ref={sortRef} className="relative text-sm select-none w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer text-xs"
                        >
                            <span>Sort by: <span className="text-primary-green font-semibold">{sortBy}</span></span>
                            <IoChevronDownOutline className={`text-xs text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-full sm:w-44 z-50 overflow-hidden">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setSortBy(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                                            sortBy === option 
                                                ? 'bg-primary-green/10 text-primary-green font-bold' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PROPERTY GRID SECTION */}
            {isDataLoading ? (
                <div className={`grid ${gridColsClass} gap-5 w-full`}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="h-80 w-full bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
                    ))}
                </div>
            ) : processedResults.length > 0 ? (
                <div className="flex flex-col gap-6">
                    <div className={`grid ${gridColsClass} gap-5 w-full`}>
                        {processedResults.map((item) => (
                            <ListerPropertyCard 
                                key={item.uuid} 
                                listing={item as unknown as ListingResult} 
                            />
                        ))}
                    </div>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
                        <p className="text-xs text-gray-500">
                            Showing page <span className="font-semibold text-gray-800">{currentPage}</span> of{' '}
                            <span className="font-semibold text-gray-800">{paginationMeta.totalPages}</span> ({paginationMeta.totalCount} total items)
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || isDataLoading}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <IoChevronBack /> Previous
                            </button>

                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1)
                                    .slice(Math.max(0, currentPage - 3), Math.min(paginationMeta.totalPages, currentPage + 2))
                                    .map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                                                currentPage === pageNum
                                                    ? 'bg-primary-green text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage >= paginationMeta.totalPages || isDataLoading}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next <IoChevronForward />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                    <p className="text-base font-semibold text-gray-700">No properties found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search term.</p>
                </div>
            )}
        </section>
    );
}