'use client';

import { LuStar, LuMapPin, LuBriefcase } from "react-icons/lu";
import { Artisan } from "@/shared/service/artisan services/types";

interface ArtisanCardProps {
  artisan: Artisan;
  isSelected?: boolean;
  onBookNow: (id: string) => void;
}

export default function ArtisanCard({ artisan, isSelected = false, onBookNow }: ArtisanCardProps) {
  const initials = artisan.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Capitalize service name for presentation display
  const serviceLabel = artisan.service.charAt(0).toUpperCase() + artisan.service.slice(1);

  return (
    <div 
      className={`bg-white rounded-3xl p-6 transition-all duration-200 border-2 ${
        isSelected 
          ? 'border-artisan-orange shadow-md ring-1 ring-artisan-orange/20' 
          : 'border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      {/* Top Header Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0 tracking-wider">
          {initials}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">{artisan.name}</h3>
          <p className="text-xs font-semibold text-gray-400 mt-1">{serviceLabel}</p>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 mt-2">
            <LuStar className="text-amber-500 fill-amber-500" />
            <span>{artisan.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-medium">({artisan.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Meta Location & History Stats */}
      <div className="flex flex-col gap-2 py-3 border-b border-gray-50 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-2">
          <LuMapPin className="text-gray-400 text-sm shrink-0" />
          <span>{artisan.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <LuBriefcase className="text-gray-400 text-sm shrink-0" />
          <span>{artisan.jobsCompleted} jobs completed</span>
        </div>
      </div>

      {/* Skill Dynamic Badge Tags */}
      <div className="flex flex-wrap gap-1.5 py-4">
        {artisan.skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-lg"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Pricing and Action Footer */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting from</span>
            <p className="text-base font-black text-gray-900 mt-0.5">
              ₦{artisan.hourlyRate.toLocaleString()}<span className="text-xs font-medium text-gray-500">/hr</span>
            </p>
          </div>
          {artisan.isVerified && (
            <span className="px-3 py-1 bg-[#009262] text-white text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              Verified
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onBookNow(artisan.id)}
          className="w-full py-3.5 bg-artisan-orange hover:bg-[#e04b00] text-white text-xs font-extrabold rounded-xl transition shadow-sm active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}