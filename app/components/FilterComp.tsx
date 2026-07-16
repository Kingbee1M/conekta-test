'use client';

import CustomSelect from './ui/CustomSelect';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { propertyType } from '@/shared/enums/propertytype';
import { AmenitiesEnum } from '@/shared/enums/amenities.enums';
import { LuX } from "react-icons/lu";

interface FilterValues {
  state: string;
  lga: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  amenities: string[];
}

interface PropertyFilterProps {
  values: FilterValues;
  onChange: (updatedValues: FilterValues) => void;
  onApply: () => void;
  onClose?: () => void; // For mobile close button
}

export default function PropertyFilter({ values, onChange, onApply, onClose }: PropertyFilterProps) {
  
  const handleValueChange = (key: keyof FilterValues, value: string | number | string[]) => {
    const newValues = { ...values, [key]: value };
    if (key === 'state') newValues.lga = '';
    onChange(newValues);
  };

  const toggleAmenity = (amenity: string) => {
    const current = [...values.amenities];
    if (current.includes(amenity)) {
      handleValueChange('amenities', current.filter((a) => a !== amenity));
    } else {
      handleValueChange('amenities', [...current, amenity]);
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minVal = Number(e.target.value);
    if (minVal < values.maxPrice) handleValueChange('minPrice', minVal);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Number(e.target.value);
    if (maxVal > values.minPrice) handleValueChange('maxPrice', maxVal);
  };

  const minPercent = (values.minPrice / 150) * 100;
  const maxPercent = (values.maxPrice / 150) * 100;
  const bedroomOptions = ['Any', '1', '2', '3', '4+'];

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-7 h-fit">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 bg-gray-50 rounded-full text-gray-500">
            <LuX size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Location</label>
        <div className="flex flex-col gap-3">
          <CustomSelect options={Object.values(NigeriaStateEnum)} selected={values.state} onChange={(val) => handleValueChange('state', val)} defaultValue="Select State" />
          <CustomSelect options={values.state ? NIGERIA_LGA_MAP[values.state as NigeriaStateEnum] || [] : []} selected={values.lga} onChange={(val) => handleValueChange('lga', val)} defaultValue={values.state ? "Select LGA" : "Choose state"} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Property Type</label>
        <CustomSelect options={Object.values(propertyType)} selected={values.propertyType} onChange={(val) => handleValueChange('propertyType', val)} defaultValue="All Types" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">
          Price Range: ₦{values.minPrice.toFixed(1)}M - ₦{values.maxPrice.toFixed(1)}M
        </label>
        <div className="relative w-full h-6 flex items-center select-none">
          <div className="absolute left-0 right-0 h-1.5 bg-gray-100 rounded-full" />
          <div className="absolute h-1.5 bg-[#0a0a14] rounded-full z-10" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
          <input type="range" min="0" max="150" value={values.minPrice} onChange={handleMinPriceChange} className="slider-input absolute w-full pointer-events-none appearance-none bg-transparent h-1.5 outline-none z-20" />
          <input type="range" min="0" max="150" value={values.maxPrice} onChange={handleMaxPriceChange} className="slider-input absolute w-full pointer-events-none appearance-none bg-transparent h-1.5 outline-none z-20" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Bedrooms</label>
        <div className="flex items-center gap-2">
          {bedroomOptions.map((opt) => (
            <button key={opt} type="button" onClick={() => handleValueChange('bedrooms', opt)} className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${values.bedrooms === opt ? 'bg-primary-green text-white border-primary-green' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>{opt}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-gray-700">Amenities</label>
        <div className="flex flex-col gap-3">
          {Object.values(AmenitiesEnum).map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={values.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="w-5 h-5 rounded-md border-gray-300 text-primary-green focus:ring-primary-green transition cursor-pointer" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={onApply} className="w-full py-4 bg-primary-green hover:bg-[#1d5d39] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]">
        {onClose ? 'Show Listings' : 'Apply Filters'}
      </button>

      <style jsx>{`
        .slider-input::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; border: 2px solid #0a0a14; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .slider-input::-moz-range-thumb { pointer-events: auto; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; border: 2px solid #0a0a14; cursor: pointer; }
      `}</style>
    </div>
  );
}