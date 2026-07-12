'use client'
import AddPropertyModal from '@/app/components/ui/addProperty'
import {useState, useEffect, useRef} from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { FlatUserData } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import Image from 'next/image';
import descover from '@/public/svg/discover.svg'
import cash from '@/public/svg/cash.svg'
import bag from '@/public/svg/suitcase.svg'
import shake from '@/public/svg/shake.svg'
import { IoChevronDownOutline } from 'react-icons/io5';
import PropertyGrid from '@/app/components/ui/propertyGrid';
import { SortOption } from '@/types';
import { MOCK_INVENTORY } from '../[slug]/page';
import button1 from '@/public/svg/button-option1.svg'
import button2 from '@/public/svg/button-option2.svg'
import button3 from '@/public/svg/button-option3.svg'
import { GridColsOption } from '@/app/components/ui/propertyGrid';
import { PropertyFilter } from '@/shared/enums/propertysFilter.enums';

import { FaBuildingColumns } from "react-icons/fa6";
import { BiDoorOpen } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa6";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { FaHouseCircleXmark } from "react-icons/fa6";



export default function Properties () {
    const [openAdd, setOpenAdd] = useState(false)
    const { user } = useSelector((state: RootState) => state.auth);
    const typedUser = user as FlatUserData & { user?: FlatUserData } | null;
    const targetUserObj = typedUser?.user || typedUser;
    const firstName = targetUserObj?.profile?.first_name || '';
    const lastName = targetUserObj?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('Newest');
    const sortRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState<GridColsOption>(3);

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

    const [handleFilter, setHandleFilter] = useState<PropertyFilter>(PropertyFilter.ALL);
        const pillNav = [
        { title: 'All', icon: FaBuildingColumns, filter: PropertyFilter.ALL },
        { title: 'Avaliable', icon: BiDoorOpen, filter:PropertyFilter.AVAILABLE},
        { title: 'Sold', icon: FaDollarSign, filter:PropertyFilter.SOLD},
        { title: 'Rented', icon: BsFillHouseCheckFill, filter:PropertyFilter.RENTED},
        { title: 'Deactivated', icon: FaHouseCircleXmark, filter:PropertyFilter.DEACTIVATED},
    ];

    const sortOptions: SortOption[] = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

    return (
        <section className='flex flex-col gap-6'>
            <div className='w-full flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <h1 className="text-2xl font-bold">Properties</h1>
                    <div className='flex gap-3 items-center bg-[#F0F0F0] px-2 rounded-md'>
                        <FaSearch className='font-bold'/>
                        <input type="search" className="w-80 p-2 " placeholder="Search properties..." />
                    </div>
                    <button onClick={() => setOpenAdd(true)} className='flex gap-1 font-semibold items-center bg-[#F0F0F0] p-2 rounded-lg text-sm text-black!'>
                        <IoMdAdd className='text-xl font-extrabold'/> Add Property
                    </button>
                </div>
                <div className='flex items-center gap-4 text-xl'>
                    <Link href={`/lister/inbox`}><IoIosNotificationsOutline /></Link>
                    <Link href={'/my-profile'} className='h-10 w-10 rounded-full bg-secondary-green flex justify-center items-center'>
                        <span className='text-tertiary-green'>{initial}</span>
                    </Link>
                </div>
                <AddPropertyModal isOpen={openAdd} onClose={()=> setOpenAdd(false)} />
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
                        className={`flex gap-2 px-3 py-1 rounded-full items-center transition-all ${
                            isActive
                            ? 'bg-primary-green text-white'
                            : 'bg-white border border-[#00000033] border-solid text-slate-500 hover:text-slate-800 hover:bg-primary-green/10'
                        }`}
                        >
                        <pill.icon className='' />
                        <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{pill.title}</span>
                        </button>
                    )}
                    )}
                </div>


                <div className="flex gap-3 items-center">
                    <div className='flex gap-3 items-center'>
                        <button className='p-2 border border-black rounded-sm' onClick={() => setCols(3)}><Image src={button1} alt="Button 1" width={10} height={10} /></button>
                        <button className='p-2 border border-black rounded-sm' onClick={() => setCols(4)}><Image src={button2} alt="Button 2" width={10} height={10} /></button>                
                    </div>

                    <div ref={sortRef} className="relative text-sm select-none">
                    <button
                        type="button"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                    >
                        <span>Sort by: <span className="text-primary-green font-semibold">{sortBy}</span></span>
                        <IoChevronDownOutline className={`text-xs text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* FLOATING ACTION OVERLAY BOX */}
                    {isSortOpen && (
                        <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-44 z-50 animate-in fade-in slide-in-from-top-1 duration-100 overflow-hidden">
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


            <PropertyGrid sortBy={sortBy} gridSize={cols} properties={MOCK_INVENTORY} />
        </section>
    )
}