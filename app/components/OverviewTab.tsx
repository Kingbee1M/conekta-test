'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LuCalendar, LuShield } from "react-icons/lu";
import { TenantData } from '@/shared/service/customer services/customerTypes';
import { PaymentFrequencyEnum } from '@/shared/enums/paymentFreqency.enums';
import ArtisanSosCarousel from './customer/ArtisanSOS';

interface OverviewTabProps {
  tenantData: TenantData;
  onNavigateToChat: (channel: 'landlord' | 'roommates') => void;
  onNavigateToMaintenance: () => void;
}

export default function OverviewTab({ tenantData, onNavigateToChat }: OverviewTabProps) {
  const frequencyLabels: Record<PaymentFrequencyEnum, string> = {
    [PaymentFrequencyEnum.ONE_OFF]: 'One-Off',
    [PaymentFrequencyEnum.MONTHLY]: 'Monthly',
    [PaymentFrequencyEnum.QUARTERLY]: 'Quarterly',
    [PaymentFrequencyEnum.YEARLY]: 'Yearly',
  };

  const formattedPaymentFrequency = frequencyLabels[tenantData.billing.frequency] || 'Yearly';

  const progressPercent = Math.round(
    (tenantData.billing.elapsedTenancyDays / tenantData.billing.totalTenancyDays) * 100
  );

  return (
    <>
      {/* MAIN METRIC COLUMNS */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
        {/* Tenancy Progress & Rent Clock */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tenant Ledger</h3>
              <h2 className="text-xl font-bold text-gray-900 mt-1">Tenancy Lifecycle Status</h2>
            </div>
            <span className="px-3.5 py-1 bg-primary-green/10 text-primary-green text-xs font-bold rounded-full">Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-y border-gray-50">
            <div>
              <span className="text-xs text-gray-400 font-semibold">Rent Value</span>
              <p className="text-2xl font-black text-primary-green mt-1">₦{(tenantData.billing.rentAmount / 1000000).toFixed(1)}M</p>
              <p className="text-[10px] text-gray-400 font-medium capitalize mt-0.5">Renewable {formattedPaymentFrequency}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold">Due Date</span>
              <p className="text-2xl font-bold text-gray-800 mt-1 flex items-center gap-1.5"><LuCalendar className="text-gray-400" /> Aug 31</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">2026 Season Calendar</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold">Time Remaining</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{tenantData.billing.daysRemaining} Days</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Before renewal grace window</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Tenancy Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-primary-green rounded-full" 
              />
            </div>
          </div>
        </motion.div>

        {/* Landlord Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 bg-gray-50">
              <Image fill src={tenantData.landlord.avatar} alt="Landlord Avatar" className="object-cover" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <span className="text-[10px] text-primary-green font-bold uppercase tracking-wider">Property Owner</span>
              <h4 className="text-base font-bold text-gray-900 mt-0.5">{tenantData.landlord.name}</h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Active landlord since 2021</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onNavigateToChat('landlord')}
            className="w-full sm:w-auto px-5 py-3.5 bg-primary-green hover:bg-[#1d5d39] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs cursor-pointer"
          >
            Direct Message Owner
          </motion.button>
        </motion.div>

        {/* Extra Utility Splitting Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-4"
          >
            <h3 className="text-sm font-bold text-gray-900">Utility Split Tracker</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: 'IKEDC Electricity Token', amount: '₦15,000', label: 'Due in 3 days' },
                { name: 'Fiber Broadband Internet', amount: '₦8,000', label: 'Subscribed till Aug 12' }
              ].map((u, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{u.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{u.label}</p>
                  </div>
                  <span className="text-sm font-black text-primary-green">{u.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-4 justify-between"
          >
            <div>
              <h3 className="text-sm font-bold text-gray-900">Conekta Shield Protection</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">
                Your apartment is insured under Conekta Rent Assurance. Any sudden structural hazards are resolved automatically.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary-green text-xs font-bold mt-2">
              <LuShield className="text-lg shrink-0" />
              <span>Shield Coverage Active</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SIDEBAR ROOMMATES */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="col-span-1 lg:col-span-4 flex flex-col gap-6"
      >
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Co-Living Directory</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Tenants registered inside this compound</p>
          </div>
          <div className="flex flex-col gap-4">
            {tenantData.neighbors.map((n) => (
              <div key={n.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                    <Image fill src={n.avatar} alt={n.name} className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{n.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{n.room}</p>
                  </div>
                </div>
                {n.isRoommate && (
                  <span className="text-[9px] font-extrabold bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-md">
                    Roommate
                  </span>
                )}
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onNavigateToChat('roommates')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200/85 text-gray-800 text-xs font-bold rounded-2xl transition-colors text-center cursor-pointer"
          >
            Open Co-living Board
          </motion.button>
        </div>

        <ArtisanSosCarousel/>
      </motion.div>
    </>
  );
}