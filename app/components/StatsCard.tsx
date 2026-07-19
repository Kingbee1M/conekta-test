import { LuHouse, LuCreditCard, LuHeart } from 'react-icons/lu';

interface StatCardsProps {
  activeRentalsCount: number;
  rentPaidYtd: number;
  savedPropertiesCount: number;
}

export default function StatCards({ activeRentalsCount, rentPaidYtd, savedPropertiesCount }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1 */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex justify-between items-start">
        <div className="flex flex-col text-left">
          <span className="text-xl font-bold text-gray-800">{activeRentalsCount}</span>
          <span className="text-[11px] text-gray-400 font-semibold mt-0.5">Active Rental</span>
        </div>
        <div className="p-2 rounded-lg bg-gray-50 text-gray-400"><LuHouse className="text-base" /></div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex justify-between items-start">
        <div className="flex flex-col text-left">
          <span className="text-xl font-bold text-blue-600">₦{rentPaidYtd.toLocaleString()}</span>
          <span className="text-[11px] text-gray-400 font-semibold mt-0.5">Rent Paid (YTD)</span>
        </div>
        <div className="p-2 rounded-lg bg-blue-50/50 text-blue-500"><LuCreditCard className="text-base" /></div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex justify-between items-start">
        <div className="flex flex-col text-left">
          <span className="text-xl font-bold text-purple-600">{savedPropertiesCount}</span>
          <span className="text-[11px] text-gray-400 font-semibold mt-0.5">Saved Properties</span>
        </div>
        <div className="p-2 rounded-lg bg-purple-50/50 text-purple-400"><LuHeart className="text-base" /></div>
      </div>
    </div>
  );
}