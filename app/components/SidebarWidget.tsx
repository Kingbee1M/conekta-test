'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { LuCalendar, LuTrendingUp } from 'react-icons/lu';
import { RootState } from '@/shared/store/store';
import { useKycModal } from '@/lib/KycModalContext';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import ScheduleVisitPortal from './ScheduleVisit';

interface SidebarWidgetProps {
  basePrice: string;
  paymentFrequency: string;
}

export default function SidebarWidget({ basePrice, paymentFrequency }: SidebarWidgetProps) {
  const parsedPrice = parseFloat(basePrice) || 0;
  const [isOpen, setIsOpen] = useState(false);

  // 1. Hook into KYC state & context
  const { openModal } = useKycModal();
  const { profile: kycProfile } = useSelector((state: RootState) => state.publicKyc);
  const kycStatus = kycProfile?.status ?? SubmissionStatusEnum.NOT_STARTED;

  // Format price into millions easily (e.g. 4500000 -> ₦4.5M)
  const formattedPriceInM = parsedPrice >= 1000000 
    ? `₦${(parsedPrice / 1000000).toFixed(1)}M` 
    : `₦${parsedPrice.toLocaleString()}`;

  // 2. Intercept schedule action based on KYC status
  const handleScheduleVisit = () => {
    if (kycStatus !== SubmissionStatusEnum.APPROVED) {
      openModal();
      return;
    }
    setIsOpen(true);
  };

  return (
    <aside className="w-full flex flex-col gap-6 sticky top-24">
      
      {/* CARD 1: MAIN PRICING & PAYMENT OPTIONS */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            {formattedPriceInM}
          </h2>
          <p className="text-gray-400 text-xs font-medium mt-1">
            Per {paymentFrequency || 'Year'}
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleScheduleVisit}
            className="w-full py-4 bg-primary-green text-white hover:bg-primary-green-hover font-bold rounded-2xl border border-gray-200 shadow-sm transition active:scale-[0.98] text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LuCalendar className="text-lg text-white shrink-0" />
            Schedule Visit
          </button>

          {isOpen && (
            <ScheduleVisitPortal onClose={() => setIsOpen(false)} />
          )}
        </div>

        {/* Payment Methods Checklists */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Payment Options Available:
          </span>
          <div className="flex flex-col gap-2.5">
            {[
              'Full Rent',
              'Rent Now Pay Later',
              'Rent Small Small'
            ].map((option, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary-green flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-green" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD 2: PURPLE FRACTIONAL INVESTMENT WIDGET */}
      <div className="bg-white rounded-3xl border border-violet-100/60 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2.5 text-violet-700">
          <LuTrendingUp className="text-2xl shrink-0" />
          <h3 className="text-base font-extrabold tracking-tight">Investment Opportunity</h3>
        </div>
        
        <p className="text-xs text-violet-600/80 font-medium -mt-1 leading-relaxed">
          Own a fraction of this property and earn monthly yields as a passive investment stream.
        </p>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-violet-600/70">Price per unit</span>
            <span className="text-violet-900">₦0.5M</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-violet-600/70">Units available</span>
            <span className="text-violet-900">4 / 10</span>
          </div>

          <div className="w-full h-2 bg-violet-100 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-violet-600 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        <button
          type="button"
          className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-sm shadow-violet-900/10 hover:shadow-md transition active:scale-[0.98] text-sm"
        >
          Invest Now
        </button>
      </div>
    </aside>
  );
}