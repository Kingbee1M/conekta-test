'use client';

import AddPropertyModal from '@/app/components/ui/addProperty';
import { useState, useEffect, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { FlatUserData, Listing } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import Image from 'next/image';
import { IoChevronDownOutline } from 'react-icons/io5';
import PropertyGrid from '@/app/components/ui/propertyGrid';
import { SortOption } from '@/types';
import button1 from '@/public/svg/button-option1.svg';
import button2 from '@/public/svg/button-option2.svg';
import { PropertyFilter } from '@/shared/enums/propertysFilter.enums';

import { FaBuildingColumns } from "react-icons/fa6";
import { BiDoorOpen } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa6";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { FaHouseCircleXmark } from "react-icons/fa6";
// Notice we switched this to the LAZY version of your query hook
import { useLazyGetListingsQuery } from '@/shared/service/listing.services';

export default function Properties() {
    const [openAdd, setOpenAdd] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Auth selectors
    const { profile } = useSelector((state: RootState) => state.auth);
    
    const propertiesList = useSelector(
        (state: RootState) => state.listing.propertiesList
    );

    const typedUser = profile as FlatUserData & { user?: FlatUserData } | null;
    const firstName = typedUser?.profile?.first_name || '';
    const lastName = typedUser?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('Newest');
    const sortRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState<3 | 4 | 5>(3);
    const [handleFilter, setHandleFilter] = useState<PropertyFilter>(PropertyFilter.ALL);

    // 1. Get the lazy trigger function
    const [triggerGetListings, { isLoading, isFetching }] = useLazyGetListingsQuery();

    // 2. Handle Search Debounce
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchVal), 400);
        return () => clearTimeout(handler);
    }, [searchVal]);

    // 3. SECURE CONTROLLED FETCH (Only triggers on mount and when debouncedSearch changes)
    useEffect(() => {
        triggerGetListings({
            search: debouncedSearch || undefined,
        }, true); // "true" prefers cached data if it exists to save bandwidth
    }, [debouncedSearch, triggerGetListings]);

    // Close the sort menu if clicked outside
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

    const filteredResults = (propertiesList || []).filter((item: Listing) => {
        if (
            handleFilter === PropertyFilter.ALL || 
            String(handleFilter).toLowerCase() === 'all' ||
            !handleFilter
        ) {
            return true; 
        }
        const rawStatus = (item as unknown as Record<string, unknown>).listing_status || (item as unknown as Record<string, unknown>).status || '';
        
        if (!rawStatus) return false;
        return String(rawStatus).toLowerCase() === String(handleFilter).toLowerCase();
    });

    return (
        <section className='flex flex-col gap-6'>
            <div className='w-full flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <h1 className="text-2xl font-bold">Properties</h1>
                    <div className='flex gap-3 items-center bg-[#F0F0F0] px-3 rounded-xl border border-gray-200/40 h-[38px]'>
                        <FaSearch className='text-gray-400 text-sm'/>
                        <input 
                            type="search" 
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="w-80 bg-transparent text-sm outline-none text-gray-800" 
                            placeholder="Search properties..." 
                        />
                    </div>
                    <button onClick={() => setOpenAdd(true)} className='flex gap-1 font-semibold items-center bg-primary-green text-white px-4 h-[38px] rounded-xl text-sm transition-opacity hover:opacity-90 shadow-sm cursor-pointer'>
                        <IoMdAdd className='text-lg'/> Add Property
                    </button>
                </div>
                <div className='flex items-center gap-4 text-xl'>
                    <Link href={`/lister/inbox`} className="text-gray-600 hover:text-gray-900"><IoIosNotificationsOutline /></Link>
                    <Link href={'/my-profile'} className='h-10 w-10 rounded-full bg-secondary-green flex justify-center items-center font-bold'>
                        <span className='text-tertiary-green text-sm'>{initial}</span>
                    </Link>
                </div>
                <AddPropertyModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
            </div>

            <div className='w-full flex justify-between items-center mt-5'>
                {/* PILL NAVIGATIONS */}
                <div className='w-1/2 flex gap-3 text-sm'>
                    {pillNav.map((pill, index) => {
                        const isActive = handleFilter === pill.filter;
                        return (
                            <button 
                                onClick={() => setHandleFilter(pill.filter)} 
                                key={index} 
                                className={`flex gap-2 px-4 py-1.5 rounded-full items-center transition-all text-xs font-semibold cursor-pointer ${
                                    isActive
                                        ? 'bg-primary-green text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <pill.icon />
                                <span className={`${isActive ? 'text-white': ''}`}>{pill.title}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-3 items-center">
                    <div className='flex gap-1.5 items-center bg-gray-100 p-1 rounded-lg'>
                        <button className={`p-1.5 rounded-md transition-colors ${cols === 3 ? 'bg-white shadow-sm' : 'text-gray-400'}`} onClick={() => setCols(3)}><Image src={button1} alt="3 Grid" width={14} height={14} /></button>
                        <button className={`p-1.5 rounded-md transition-colors ${cols === 4 ? 'bg-white shadow-sm' : 'text-gray-400'}`} onClick={() => setCols(4)}><Image src={button2} alt="4 Grid" width={14} height={14} /></button>                
                    </div>

                    <div ref={sortRef} className="relative text-sm select-none">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer text-xs"
                        >
                            <span>Sort by: <span className="text-primary-green font-semibold">{sortBy}</span></span>
                            <IoChevronDownOutline className={`text-xs text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-44 z-50 overflow-hidden">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setSortBy(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
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

            <PropertyGrid 
                sortBy={sortBy} 
                gridSize={cols} 
                properties={filteredResults} 
                isLoading={isLoading || isFetching} 
            />
        </section>
    );
}