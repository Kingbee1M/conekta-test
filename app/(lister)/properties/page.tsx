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
import { IoChevronDownOutline } from 'react-icons/io5';
import { SortOption } from '@/types';
import button1 from '@/public/svg/button-option1.svg';
import button2 from '@/public/svg/button-option2.svg';
import { PropertyFilter } from '@/shared/enums/propertysFilter.enums';

import { FaBuildingColumns } from "react-icons/fa6";
import { BiDoorOpen } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa6";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { FaHouseCircleXmark } from "react-icons/fa6";
import { useLazyGetListingsQuery } from '@/shared/service/listing.services';
import ListerPropertyCard from '@/app/components/lister/ListerPropertyCard';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

export default function Properties() {
    const [openAdd, setOpenAdd] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Auth selectors
    const { listerProfile } = useSelector((state: RootState) => state.auth);
    
    const propertiesList = useSelector(
        (state: RootState) => state.listing.propertiesList
    );

    const typedUser = listerProfile as FlatUserData & { user?: FlatUserData } | null;
    const firstName = typedUser?.profile?.first_name || '';
    const lastName = typedUser?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('Newest');
    const sortRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState<3 | 4 | 5>(3);
    const [handleFilter, setHandleFilter] = useState<PropertyFilter>(PropertyFilter.ALL);

    const [triggerGetListings, { isLoading, isFetching }] = useLazyGetListingsQuery();

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchVal), 400);
        return () => clearTimeout(handler);
    }, [searchVal]);

    useEffect(() => {
        triggerGetListings({
            search: debouncedSearch || undefined,
        }, true);
    }, [debouncedSearch, triggerGetListings]);

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
        { title: 'All', icon: FaBuildingColumns, filter: PropertyFilter.ALL },
        { title: 'Available', icon: BiDoorOpen, filter: PropertyFilter.AVAILABLE },
        { title: 'Sold', icon: FaDollarSign, filter: PropertyFilter.SOLD },
        { title: 'Rented', icon: BsFillHouseCheckFill, filter: PropertyFilter.RENTED },
        { title: 'Deactivated', icon: FaHouseCircleXmark, filter: PropertyFilter.DEACTIVATED },
    ];

    const sortOptions: SortOption[] = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

    // --- FILTER & SORT PROCESSING ---
    const processedResults = useMemo(() => {
        if (!propertiesList || !Array.isArray(propertiesList)) {
            return [];
        }

        // 1. Filter Stage
        const filtered = propertiesList.filter((item: Listing) => {
            if (
                handleFilter === PropertyFilter.ALL || 
                String(handleFilter).toLowerCase() === 'all' ||
                !handleFilter
            ) {
                return true; 
            }

            const rawRecord = item as unknown as Record<string, unknown>;
            const rawStatus = rawRecord.listing_status || rawRecord.status || rawRecord.state || '';
            return String(rawStatus).trim().toLowerCase() === String(handleFilter).trim().toLowerCase();
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
            <div className='w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
                <div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full md:w-auto'>
                    <div className='flex justify-between items-center w-full md:w-auto'>
                        <h1 className="text-2xl font-bold">Properties</h1>
                        
                        {/* Profile & Notifications (Mobile only) */}
                        <div className='flex md:hidden items-center gap-3 text-xl'>
                            <Link href={`/lister/inbox`} className="text-gray-600 hover:text-gray-900"><IoIosNotificationsOutline /></Link>
                            <Link href={'/my-profile'} className='h-8 w-8 rounded-full bg-secondary-green flex justify-center items-center font-bold'>
                                <span className='text-tertiary-green text-xs'>{initial}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search & Add Action Wrapper */}
                    <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
                        <div className='flex gap-3 items-center bg-[#F0F0F0] px-3 rounded-xl border border-gray-200/40 h-9.5 flex-1 md:flex-none'>
                            <FaSearch className='text-gray-400 text-sm shrink-0'/>
                            <input 
                                type="search" 
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                className="w-full md:w-64 bg-transparent text-sm outline-none text-gray-800" 
                                placeholder="Search properties..." 
                            />
                        </div>
                        <button onClick={() => setOpenAdd(true)} className='flex gap-1 font-semibold items-center justify-center bg-primary-green text-white px-4 h-9.5 rounded-xl text-sm transition-opacity hover:opacity-90 shadow-sm cursor-pointer w-full sm:w-auto'>
                            <IoMdAdd className='text-lg'/> Add Property
                        </button>
                    </div>
                </div>

                {/* Profile & Notifications (Desktop/Tablet only) */}
                <div className='hidden md:flex items-center gap-4 text-xl'>
                    <Link href={`/lister/inbox`} className="text-gray-600 hover:text-gray-900"><IoIosNotificationsOutline /></Link>
                    <Link href={'/my-profile'} className='h-10 w-10 rounded-full bg-secondary-green flex justify-center items-center font-bold'>
                        <span className='text-tertiary-green text-sm'>{initial}</span>
                    </Link>
                </div>
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

            {/* PROPERTY GRID SECTION USING PropertyCard2 */}
            {isDataLoading ? (
                <div className={`grid ${gridColsClass} gap-5 w-full`}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="h-80 w-full bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
                    ))}
                </div>
            ) : processedResults.length > 0 ? (
                <div className={`grid ${gridColsClass} gap-5 w-full`}>
                    {processedResults.map((item) => (
                        <ListerPropertyCard 
                            key={item.uuid} 
                            listing={item as unknown as ListingResult} 
                        />
                    ))}
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