'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useEffect, useState } from 'react';
import ListerTopBar from '@/app/components/ui/listerTopbar';
import descover from '@/public/svg/discover.svg'
import cash from '@/public/svg/cash.svg'
import bag from '@/public/svg/suitcase.svg'
import shake from '@/public/svg/shake.svg'
import Image from 'next/image';
import Link from 'next/link';
import ListerHero from '@/app/components/listerHero';
import ListerPieChart from '@/app/components/listerPieChart';
import { FaPlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaHouseMedical } from "react-icons/fa6";
import { MdVerifiedUser } from "react-icons/md";
import { LuCircleHelp } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger, } from '@/components/ui/tooltip';
import LineChartComp from '@/app/components/ui/lineChartcomp';
import { ActivityType, RecentActivityItem } from '@/shared/enums/activity';
import RecentActivityComp from '@/app/components/ui/recentActivites';

const sampleActivities: RecentActivityItem[] = [
  {
    id: 'act_01',
    type: ActivityType.SOLD_LISTING,
    title: 'Penthouse Suite Sold',
    description: 'Unit 4B moved to closed contract',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 minutes ago
  },
  {
    id: 'act_02',
    type: ActivityType.OFFER_RECEIVED,
    title: 'Offer on Meadow Lane',
    description: 'Submitted backup offer of $840k',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: 'act_03',
    type: ActivityType.CREATE_LISTING,
    title: 'New Luxury Villa Listed',
    description: 'Published 12 Skyview Terraces live',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: 'act_04',
    type: ActivityType.APPOINTMENT_BOOKED,
    title: 'Viewing Scheduled',
    description: 'John Doe booked standard walkthrough',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
  },
  {
    id: 'act_05',
    type: ActivityType.EDIT_LISTING,
    title: 'Price Adjusted',
    description: 'Reduced Urban Loft down by 4%',
    timestamp: '2026-05-25T14:00:00Z', 
  }
];

export default function ListerDashboard() {
  const params = useParams();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pillNav = [
    { title: 'Discover', icon: descover, link: '/' },
    { title: 'Finance', icon: cash, link: '/' },
    { title: 'Manage', icon: bag, link: '/' },
    { title: 'Impact', icon: shake, link: '/' },
  ];

  const miniMenu = [
    { title: 'Create Listing', icon: <FaHouseMedical />, color: 'bg-emerald-600' },
    { title: 'Get Verified', icon: <MdVerifiedUser />, color: 'bg-blue-600' },
    { title: 'Need Help', icon: <LuCircleHelp />, color: 'bg-zinc-600' },
  ];

  const sampleHousesListed = [
  { id: 1, created_at: "2026-01-14T12:00:00Z" },
  { id: 2, created_at: "2026-02-20T15:30:00Z" },
  { id: 3, created_at: "2026-02-22T09:15:00Z" },
  { id: 4, created_at: "2026-05-10T10:41:51Z" },
  { id: 5, created_at: "2026-05-25T08:41:51Z" },
];

const mockPropertiesSold = [
  // --- 2026 Sales ---
  { id: "s_2601", created_at: "2026-01-14T10:30:00Z", price: 450000 },
  { id: "s_2602", created_at: "2026-01-28T14:15:00Z", price: 320000 },
  { id: "s_2603", created_at: "2026-02-12T09:00:00Z", price: 510000 },
  { id: "s_2604", created_at: "2026-02-20T16:45:00Z", price: 290000 },
  { id: "s_2605", created_at: "2026-03-05T11:20:00Z", price: 415000 },
  { id: "s_2606", created_at: "2026-05-10T13:10:00Z", price: 620000 },
  { id: "s_2607", created_at: "2026-05-24T08:41:51Z", price: 385000 },

  // --- 2025 Sales ---
  { id: "s_2501", created_at: "2025-02-18T15:22:00Z", price: 310000 },
  { id: "s_2502", created_at: "2025-03-11T11:05:00Z", price: 495000 },
  { id: "s_2503", created_at: "2025-04-25T14:50:00Z", price: 530000 },
  { id: "s_2504", created_at: "2025-06-02T09:15:00Z", price: 275000 },
  { id: "s_2505", created_at: "2025-06-19T16:30:00Z", price: 420000 },
  { id: "s_2506", created_at: "2025-07-04T12:00:00Z", price: 680000 },
  { id: "s_2507", created_at: "2025-09-15T10:10:00Z", price: 390000 },
  { id: "s_2508", created_at: "2025-10-22T13:40:00Z", price: 440000 },
  { id: "s_2509", created_at: "2025-11-05T14:15:00Z", price: 315000 },
  { id: "s_2510", created_at: "2025-12-18T09:00:00Z", price: 560000 },

  // --- 2024 Sales ---
  { id: "s_2401", created_at: "2024-03-20T10:00:00Z", price: 285000 },
  { id: "s_2402", created_at: "2024-04-15T15:30:00Z", price: 399000 },
  { id: "s_2403", created_at: "2024-07-22T11:12:00Z", price: 460000 },
  { id: "s_2404", created_at: "2024-08-05T14:00:00Z", price: 520000 },
  { id: "s_2405", created_at: "2024-08-19T09:45:00Z", price: 340000 },
  { id: "s_2406", created_at: "2024-11-12T16:20:00Z", price: 410000 },
];


  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/log-in');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full min-h-full max-w-7xl gap-7 mx-auto flex flex-col relative pb-20">
      <ListerTopBar />

      {/* Pill Navigation */}
      <div>
        <div className='w-full flex gap-3 mt-5 text-sm'>
          {pillNav.map((pill, index) => (
            <Link href={pill.link} key={index} className='flex gap-2 px-3 py-1 rounded-full hover:bg-primary-green/10 border-[#00000033] border-solid border items-center transition-colors'>
              <Image src={pill.icon} alt={pill.title} width={12} height={12} className='w-3' />
              <span className='text-primary-green font-medium'>{pill.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics Grid Row */}
      <div className='w-full grid grid-cols-[7fr_3fr] grid-rows-[260px] gap-5 mt-5'>
        <ListerHero />
        <ListerPieChart />
      </div>

      {/* FLATING BUTTON */}
      <section className='fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50'>
        
        {/* Child Submenu Cluster Section */}
        <div 
  className={`fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50 transition-all ${
    isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
  }`}
  /* pointer-events-none: Allows users to click things BEHIND the menu when closed.
    pointer-events-auto: Restores interaction safely when open.
  */
>
  
  {/* Child Submenu Cluster Section */}
  <div className="flex flex-col items-center gap-3 w-full">
    {miniMenu.map((mini, index) => (
      <div 
        key={index} 
        className="transition-all duration-300 ease-out transform origin-bottom flex items-center justify-center"
        style={{
          transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen 
            ? 'translateY(0) scale(1)' 
            : `translateY(${(miniMenu.length - index) * 45}px) scale(0.4)`,
        }}
      >
        <Tooltip>
          {/* pointer-events-auto explicitly ensures the buttons work when visible */}
          <TooltipTrigger asChild>
            <button className={`w-11 h-11 rounded-full ${mini.color} text-white flex items-center justify-center text-lg shadow-md hover:scale-110 active:scale-95 transition-transform duration-150 pointer-events-auto`}>
              {mini.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-semibold text-xs shadow-md">
            {mini.title}
          </TooltipContent>
        </Tooltip>
      </div>
    ))}
  </div>

  {/* Master Control Trigger Button */}
  <button 
    className="bg-primary-green w-14 h-14 rounded-full flex justify-center items-center shadow-lg hover:bg-[#1c5836] text-white text-xl active:scale-95 transition-all duration-300 relative overflow-hidden pointer-events-auto" 
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-90' : 'rotate-0'}`}>
      {isMenuOpen ? <FaTimes /> : <FaPlus />}
    </div>
  </button>

</div>

        {/* Master Control Trigger Button */}
        <button 
          className="bg-primary-green w-14 h-14 rounded-full flex justify-center items-center shadow-lg hover:bg-[#1c5836] text-white text-xl active:scale-95 transition-all duration-300 relative overflow-hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Smooth internal rotation toggle for icon swap */}
          <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-90' : 'rotate-0'}`}>
            {isMenuOpen ? <FaTimes /> : <FaPlus />}
          </div>
        </button>
      </section>

      
      <section className='grid grid-cols-3 gap-3 grid-rows-[200px]'>
          <LineChartComp data={sampleHousesListed} title='Total Properties' />
          <LineChartComp data={mockPropertiesSold} title='Properties Sold' />
          <RecentActivityComp activities={sampleActivities} />
      </section>
    </div>
  );
}