'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useEffect, useState } from 'react';
import ListerTopBar from '@/app/components/ui/listerTopbar';
import Link from 'next/link';
import ListerHero from '@/app/components/listerHero';
import ListerPieChart from '@/app/components/listerPieChart';
import { FaPlus, FaHouseMedical, FaBuilding, FaArrowRight } from "react-icons/fa6";
import { MdVerifiedUser } from "react-icons/md";
import { LuCircleHelp } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import LineChartComp from '@/app/components/ui/lineChartcomp';
import { ActivityType, RecentActivityItem } from '@/shared/enums/activity';
import RecentActivityComp from '@/app/components/ui/recentActivites';
import AddPropertyModal from '@/app/components/ui/addProperty';
import Image from 'next/image';
import { useLazyGetListingsQuery } from '@/shared/service/listing.services';
import { ListingResult } from '@/shared/service/customer services/customerTypes';
import { FaTimes } from 'react-icons/fa';

const realEstateData = [
  { name: 'Active Listed', value: 32, color: '#157145' },
  { name: 'Rented Out', value: 14, color: '#3b82f6' },
  { name: 'Under Maintenance', value: 5, color: '#f59e0b' }
];

const sampleActivities: RecentActivityItem[] = [
  {
    id: 'act_01',
    type: ActivityType.SOLD_LISTING,
    title: 'Penthouse Suite Sold',
    description: 'Unit 4B moved to closed contract',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'act_02',
    type: ActivityType.OFFER_RECEIVED,
    title: 'Offer on Meadow Lane',
    description: 'Submitted backup offer of $840k',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'act_03',
    type: ActivityType.CREATE_LISTING,
    title: 'New Luxury Villa Listed',
    description: 'Published 12 Skyview Terraces live',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'act_04',
    type: ActivityType.APPOINTMENT_BOOKED,
    title: 'Viewing Scheduled',
    description: 'John Doe booked standard walkthrough',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
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
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  // Redux Selectors
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const propertiesList = useSelector((state: RootState) => state.listing.propertiesList);

  // RTK Query for properties
  const [triggerGetListings, { isLoading, isFetching }] = useLazyGetListingsQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/log-in');
      return;
    }
    // Fetch latest properties on mount
    triggerGetListings({}, true);
  }, [isAuthenticated, router, triggerGetListings]);

  // Extract latest 3 uploaded listings
  const latestThreeListings: ListingResult[] = (propertiesList || []).slice(0, 3) as unknown as ListingResult[];
  console.log(latestThreeListings)
  const addPropertyFunc = () => {
    setOpenAdd(!openAdd);
  };

  const routeToSupport = () => {
    router.push('/support');
  };

  const miniMenu = [
    { title: 'Create Listing', icon: <FaHouseMedical />, color: 'bg-emerald-600', func: addPropertyFunc },
    { title: 'Get Verified', icon: <MdVerifiedUser />, color: 'bg-blue-600', func: addPropertyFunc },
    { title: 'Need Help', icon: <LuCircleHelp />, color: 'bg-zinc-600', func: routeToSupport },
  ];

  const sampleHousesListed = [
    { id: 1, created_at: "2026-01-14T12:00:00Z" },
    { id: 2, created_at: "2026-02-20T15:30:00Z" },
    { id: 3, created_at: "2026-02-22T09:15:00Z" },
    { id: 4, created_at: "2026-05-10T10:41:51Z" },
    { id: 5, created_at: "2026-05-25T08:41:51Z" },
  ];

  const mockPropertiesSold = [
    { id: "s_2601", created_at: "2026-01-14T10:30:00Z", price: 450000 },
    { id: "s_2602", created_at: "2026-01-28T14:15:00Z", price: 320000 },
    { id: "s_2603", created_at: "2026-02-12T09:00:00Z", price: 510000 },
    { id: "s_2604", created_at: "2026-02-20T16:45:00Z", price: 290000 },
    { id: "s_2605", created_at: "2026-03-05T11:20:00Z", price: 415000 },
    { id: "s_2606", created_at: "2026-05-10T13:10:00Z", price: 620000 },
    { id: "s_2607", created_at: "2026-05-24T08:41:51Z", price: 385000 },
  ];

  const isDataLoading = isLoading || isFetching;

  return (
    <div className="w-full min-h-full max-w-7xl gap-7 mx-auto flex flex-col relative pb-20">
      <ListerTopBar />

      {/* Analytics Grid Row */}
      <div className='w-full grid grid-cols-1 md:grid-cols-[7fr_3fr] grid-rows-[260px] gap-y-20 md:gap-y-5 md:gap-x-5 mt-5 mb-16'>
        <ListerHero />
        <ListerPieChart 
          title="Commercial Portfolio" 
          data={realEstateData} 
          isLive={true} 
        />
      </div>

      {/* FLOATING ACTION MENU */}
      <section className='fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50'>
        <div 
          className={`fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50 transition-all ${
            isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-3 w-full">
            {miniMenu.map((mini, index) => (
              <div
                onClick={mini.func} 
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
                  <TooltipTrigger asChild>
                    <button className={`cursor-pointer w-11 h-11 rounded-full ${mini.color} text-white flex items-center justify-center text-lg shadow-md hover:scale-110 active:scale-95 transition-transform duration-150 pointer-events-auto`}>
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

          <AddPropertyModal isOpen={openAdd} onClose={()=> setOpenAdd(false)} />

          <button 
            className="bg-primary-green w-14 h-14 rounded-full flex justify-center items-center shadow-lg hover:bg-[#1c5836] text-white text-xl active:scale-95 transition-all duration-300 relative overflow-hidden pointer-events-auto" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-90' : 'rotate-0'}`}>
              {isMenuOpen ? <FaTimes /> : <FaPlus />}
            </div>
          </button>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-3 grid-rows-[200px]'>
        <LineChartComp data={sampleHousesListed} title='Total Properties' />
        <LineChartComp data={mockPropertiesSold} title='Properties Sold' />
        <RecentActivityComp activities={sampleActivities} />
      </section>

      {/* LATEST UPLOADS SECTION */}
      <section className="w-full flex flex-col gap-4 mt-4">
        {/* Header Block */}
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Latest Uploads</h1>
            <p className="text-xs text-gray-500 font-medium">Your most recent 3 property submissions</p>
          </div>
          <Link 
            href="/properties"
            className="text-xs font-semibold text-primary-green hover:underline flex items-center gap-1.5 transition-all"
          >
            <span>View All</span>
            <FaArrowRight className="text-[10px]" />
          </Link> 
        </div>

        {/* LIST TABLE CONTAINER */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {isDataLoading ? (
            /* Skeleton Loading State */
            <div className="divide-y divide-gray-100">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-20 shrink-0" />
                  <div className="h-6 bg-gray-200 rounded-full w-16 shrink-0" />
                </div>
              ))}
            </div>
          ) : latestThreeListings.length === 0 ? (
            /* Empty State */
            <div className="w-full py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-primary-green flex items-center justify-center mb-3">
                <FaBuilding className="text-xl" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">No properties uploaded yet</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                When you create listings, your latest 3 properties will show up here.
              </p>
              <button
                onClick={() => setOpenAdd(true)}
                className="mt-4 px-4 py-2 bg-primary-green text-white text-xs font-semibold rounded-xl hover:bg-[#1c5836] transition-colors cursor-pointer"
              >
                + Add Property
              </button>
            </div>
          ) : (
            /* Real Data List View */
            <div className="divide-y divide-gray-100 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 hidden md:table-cell">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {latestThreeListings.map((item) => {
                    const imgUrl = item.cover_image || item.images?.[0] || '/jpg/house1.jpg';
                    const address = `${item.location.lga}, ${item.location.state}` || 'Lagos, Nigeria';

                    return (
                      <tr key={item.uuid || item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title & Image Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 min-w-50">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60">
                              <Image 
                                src={imgUrl} 
                                alt={item.title || 'Property'} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate max-w-55">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate max-w-55 mt-0.5">
                                {address}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="py-3 px-4 text-gray-600 font-medium hidden sm:table-cell whitespace-nowrap">
                          {item.category || item.category || 'Residential'}
                        </td>

                        {/* Price Column */}
                        <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap">
                          {item.currency || '₦'}{Number(item.base_price || 0).toLocaleString()}
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-4 hidden md:table-cell whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.is_active !== false
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {item.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Action Link Column */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/properties/${item.uuid}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-green hover:underline"
                          >
                            <span>View</span>
                            <FaArrowRight className="text-[10px]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}