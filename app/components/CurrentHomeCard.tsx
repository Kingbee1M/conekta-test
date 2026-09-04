import { HomeOverviewData } from "./profile/profileTypes";

interface CurrentHomeCardProps {
  home: HomeOverviewData;
  onPaymentTrigger: (home: HomeOverviewData) => void;
}

export default function CurrentHomeCard({ home, onPaymentTrigger }: CurrentHomeCardProps) {
  const progressPercent = (home.rentPaidMonths / home.totalRentMonths) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Current Home</h4>
          <h2 className="text-base font-bold text-gray-800 mt-1">{home.title}</h2>
          <p className="text-xs text-gray-500">{home.address}</p>
        </div>
        <span className="bg-emerald-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-md">
          {home.status}
        </span>
      </div>

      {/* Rent Payment Progression Horizontal Metric Segment */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-[11px] font-semibold">
          <span className="text-gray-400">Rent Payment Progress</span>
          <span className="text-gray-700">{home.rentPaidMonths} of {home.totalRentMonths} months</span>
        </div>
        {/* Progress Bar Container Track */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Call to action payment trigger panel row */}
      <div className="flex justify-between items-center mt-4 pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Next Payment Due</span>
          <span className="text-xs font-bold text-gray-700 mt-0.5">{home.nextPaymentDue}</span>
        </div>
        <button 
          onClick={() => onPaymentTrigger(home)}
          className="bg-[#00AC72] hover:bg-[#009663] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}