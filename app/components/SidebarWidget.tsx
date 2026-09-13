'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { LuCalendar } from 'react-icons/lu';
import { RootState } from '@/shared/store/store';
import { useKycModal } from '@/lib/KycModalContext';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import ScheduleVisitPortal from './ScheduleVisit';
import CustomerComments from './CustomerComments';

interface SidebarWidgetProps {
  listingUuid: string;
  basePrice: string | number;
  paymentFrequency: string;
}

export default function SidebarWidget({
  listingUuid,
  basePrice,
  paymentFrequency,
}: SidebarWidgetProps) {
  const parsedPrice = Number(basePrice) || 0;
  const [isOpen, setIsOpen] = useState(false);

  // 1. Hook into KYC state & context
  const { openModal } = useKycModal();
  const { profile: kycProfile } = useSelector((state: RootState) => state.publicKyc);
  const kycStatus = kycProfile?.status ?? SubmissionStatusEnum.NOT_STARTED;

  // Format price into millions easily (e.g. 4500000 -> ₦4.5M)
  const formattedPriceInM =
    parsedPrice >= 1000000
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
              'Rent Small Small',
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

      {/* CARD 2: REPLACED WITH CUSTOMER COMMENTS SECTION */}
      <CustomerComments listingUuid={listingUuid} />
    </aside>
  );
}