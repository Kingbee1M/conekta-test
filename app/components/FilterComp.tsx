'use client';

import React, { ComponentType } from 'react';
import CustomSelect from './ui/CustomSelect';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { propertyType } from '@/shared/enums/propertytype';
import { AmenitiesEnum } from '@/shared/enums/amenities.enums';
import {
  LuX,
  LuRotateCcw,
  LuWifi,
  LuTv,
  LuCar,
  LuWaves,
  LuDumbbell,
  LuShieldCheck,
  LuZap,
  LuSnowflake,
  LuTrees,
  LuCheck,
  LuFlame,
} from 'react-icons/lu';
import { HomeIcon, CheckCircle2 } from 'lucide-react';


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
  onClear?: () => void;
  onClose?: () => void;
}

const DEFAULT_FILTER_VALUES: FilterValues = {
  state: '',
  lga: '',
  propertyType: 'All Types',
  minPrice: 0,
  maxPrice: 150,
  bedrooms: 'Any',
  amenities: [],
};

// Icon mapping per amenity
const AMENITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  WiFi: LuWifi,
  'Wi-Fi': LuWifi,
  TV: LuTv,
  Cable: LuTv,
  Parking: LuCar,
  'Free Parking': LuCar,
  Pool: LuWaves,
  'Swimming Pool': LuWaves,
  Gym: LuDumbbell,
  Fitness: LuDumbbell,
  Security: LuShieldCheck,
  '24/7 Security': LuShieldCheck,
  Power: LuZap,
  '24/7 Power': LuZap,
  Electricity: LuZap,
  AC: LuSnowflake,
  'Air Conditioning': LuSnowflake,
  Garden: LuTrees,
  Balcony: HomeIcon,
  Kitchen: LuFlame,
};

export default function PropertyFilter({
  values,
  onChange,
  onApply,
  onClear,
  onClose,
}: PropertyFilterProps) {
  const handleValueChange = (
    key: keyof FilterValues,
    value: string | number | string[]
  ) => {
    const newValues = { ...values, [key]: value };
    if (key === 'state') newValues.lga = '';
    onChange(newValues);
  };

  const handleClearFilters = () => {
    onChange(DEFAULT_FILTER_VALUES);
    if (onClear) {
      onClear();
    }
  };

  const toggleAmenity = (amenity: string) => {
    const current = [...values.amenities];
    if (current.includes(amenity)) {
      handleValueChange(
        'amenities',
        current.filter((a) => a !== amenity)
      );
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

  const isFiltered =
    values.state !== '' ||
    values.lga !== '' ||
    values.propertyType !== 'All Types' ||
    values.minPrice > 0 ||
    values.maxPrice < 150 ||
    values.bedrooms !== 'Any' ||
    values.amenities.length > 0;

  return (
    <div className="w-full bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-5 h-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-primary-green">Filters</h2>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-primary-green" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LuRotateCcw size={12} />
              Reset
            </button>
          )}

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
            >
              <LuX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Location
        </label>
        <div className="grid grid-cols-2 gap-2">
          <CustomSelect
            options={Object.values(NigeriaStateEnum)}
            selected={values.state}
            onChange={(val) => handleValueChange('state', val)}
            defaultValue="State"
          />
          <CustomSelect
            options={
              values.state
                ? NIGERIA_LGA_MAP[values.state as NigeriaStateEnum] || []
                : []
            }
            selected={values.lga}
            onChange={(val) => handleValueChange('lga', val)}
            defaultValue={values.state ? 'LGA' : 'Choose state'}
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Property Type
        </label>
        <CustomSelect
          options={Object.values(propertyType)}
          selected={values.propertyType}
          onChange={(val) => handleValueChange('propertyType', val)}
          defaultValue="All Types"
        />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold tracking-wide">
          <span className="uppercase text-stone-500">Price Range</span>
          <span className="text-primary-green font-semibold">
            ₦{values.minPrice.toFixed(0)}M - ₦{values.maxPrice.toFixed(0)}M
          </span>
        </div>
        <div className="relative w-full h-5 flex items-center select-none py-1">
          <div className="absolute left-0 right-0 h-1.5 bg-stone-100 rounded-full" />
          <div
            className="absolute h-1.5 bg-primary-green rounded-full z-10"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="150"
            value={values.minPrice}
            onChange={handleMinPriceChange}
            className="slider-input absolute w-full pointer-events-none appearance-none bg-transparent h-1.5 outline-none z-20"
          />
          <input
            type="range"
            min="0"
            max="150"
            value={values.maxPrice}
            onChange={handleMaxPriceChange}
            className="slider-input absolute w-full pointer-events-none appearance-none bg-transparent h-1.5 outline-none z-20"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Bedrooms
        </label>
        <div className="flex items-center gap-1.5">
          {bedroomOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleValueChange('bedrooms', opt)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                values.bedrooms === opt
                  ? 'bg-primary-green text-white border-primary-green shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Amenities
          </label>
          {values.amenities.length > 0 && (
            <span className="text-[11px] font-semibold text-primary-green bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {values.amenities.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.values(AmenitiesEnum).map((amenity) => {
            const isChecked = values.amenities.includes(amenity);
            const IconComponent = AMENITY_ICONS[amenity] || CheckCircle2;

            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-left select-none ${
                  isChecked
                    ? 'bg-emerald-50/80 border-primary-green text-primary-green font-semibold shadow-2xs'
                    : 'bg-stone-50/60 border-stone-200/80 text-stone-600 hover:bg-stone-100/70 hover:text-stone-900'
                }`}
              >
                <IconComponent
                  className={`text-sm shrink-0 ${
                    isChecked ? 'text-primary-green' : 'text-stone-400'
                  }`}
                />
                <span className="text-xs font-medium truncate flex-1">
                  {amenity}
                </span>
                {isChecked && (
                  <LuCheck className="text-xs text-primary-green shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="pt-2 border-t border-stone-100">
        <button
          onClick={onApply}
          className="w-full py-3.5 bg-primary-green hover:bg-[#1d5d39] text-white text-sm font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          {onClose ? 'Show Listings' : 'Apply Filters'}
        </button>
      </div>

      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #00ac72;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .slider-input::-moz-range-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #00ac72;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}