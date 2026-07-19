'use client';

import { LuSparkles, LuCheckCheck, LuArrowRight } from "react-icons/lu";

interface ArtisanAdBannerProps {
  onJoinAsArtisan: () => void;
}

export default function ArtisanAdBanner({ onJoinAsArtisan }: ArtisanAdBannerProps) {
  return (
    <div className="w-full bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden border border-emerald-800/30">
      {/* Decorative Background Glows */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-12 w-60 h-20 bg-[#deff9a]/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Text Block */}
        <div className="max-w-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#deff9a] text-xs font-bold uppercase tracking-wider">
            <LuSparkles />
            <span>Grow Your Business With Us</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white">
            Are you a skilled artisan? Come create an account today!
          </h2>
          <p className="text-xs md:text-sm text-emerald-200/80 font-medium leading-relaxed mt-1">
            Connect directly with verified property managers, landlords, and residents in your immediate locality. Build your reputation, manage bookings seamlessly, and get paid securely.
          </p>

          {/* Core Mini Selling Points */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[11px] md:text-xs font-semibold text-emerald-100/90">
            <div className="flex items-center gap-1.5">
              <LuCheckCheck className="text-[#deff9a] shrink-0" />
              <span className="text-white">Zero upfront listing fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuCheckCheck className="text-[#deff9a] shrink-0" />
              <span className="text-white">Instant payout processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuCheckCheck className="text-[#deff9a] shrink-0" />
              <span className="text-white">Flexible scheduling manager</span>
            </div>
          </div>
        </div>

        {/* Right Action Call-To-Action Item */}
        <div className="shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={onJoinAsArtisan}
            className="w-full lg:w-auto px-6 py-4 bg-[#deff9a] hover:bg-[#cbe68e] text-emerald-950 text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Create Provider Account</span>
            <LuArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}