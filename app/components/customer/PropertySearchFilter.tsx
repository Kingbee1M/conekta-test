'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin, Building, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CustomSelect from '../ui/CustomSelect';
import { structureType } from '@/shared/enums/structure.enum';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { useLazyGetCustomerListingsQuery } from '@/shared/service/customer services/customerListing.services';

const STATE_OPTIONS = Object.values(NigeriaStateEnum);
const TYPE_OPTIONS = Object.values(structureType);

const BUDGET_RANGES = [
  { label: '₦1,000,000 - ₦3,000,000', min: 1000000, max: 3000000 },
  { label: '₦3,000,000 - ₦10,000,000', min: 3000000, max: 10000000 },
  { label: '₦10,000,000 - ₦50,000,000', min: 10000000, max: 50000000 },
  { label: '₦50,000,000+', min: 50000000, max: undefined },
];

export default function PropertySearchFilter() {
  const [state, setState] = useState<string>(NigeriaStateEnum.LAGOS);
  const [area, setArea] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [triggerSearch, { data, isFetching }] = useLazyGetCustomerListingsQuery();

  // Resolve LGAs based on selected state
  const activeStateEnumKey = (Object.keys(NigeriaStateEnum) as Array<keyof typeof NigeriaStateEnum>).find(
    (key) => NigeriaStateEnum[key] === state
  );
  const areaOptions = activeStateEnumKey ? NIGERIA_LGA_MAP[NigeriaStateEnum[activeStateEnumKey]] : [];

  // Parse budget range option
  const selectedBudgetObj = BUDGET_RANGES.find((b) => b.label === budget);

  // Trigger search on state updates with debouncing
  useEffect(() => {
    const hasActiveFilters = Boolean(state || area || type || budget || searchQuery.trim().length > 0);

    if (!hasActiveFilters) {
      return;
    }

    const timer = setTimeout(() => {
      triggerSearch({
        state: state || undefined,
        lga: area || undefined,
        category: type || undefined,
        min_price: selectedBudgetObj?.min,
        max_price: selectedBudgetObj?.max,
        search: searchQuery.trim() || undefined,
        page_size: 5,
      });
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [state, area, type, budget, searchQuery, triggerSearch, selectedBudgetObj]);

  // Click outside listener to close the dynamic popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateChange = (newState: string) => {
    setState(newState);
    setArea('');
  };

  const results = data?.data?.results || [];

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mr-auto px-4 z-30">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-stone-50/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-3.5 shadow-xl border border-stone-200/60 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-stone-200 gap-3 md:gap-0"
      >
        {/* TEXT SEARCH */}
        <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
          <label className="text-[10px] font-bold tracking-widest text-[#00AC72] uppercase mb-0.5 pointer-events-none">
            Keyword
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="e.g. Duplex, Lekki..."
            className="w-full bg-transparent text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none"
          />
        </div>

        {/* STATE */}
        <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
          <label className="text-[10px] font-bold tracking-widest text-[#00AC72] uppercase mb-0.5 pointer-events-none">
            State
          </label>
          <CustomSelect
            options={STATE_OPTIONS}
            selected={state}
            onChange={handleStateChange}
            defaultValue="Select State"
          />
        </div>

        {/* AREA / LGA */}
        <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
          <label className="text-[10px] font-bold tracking-widest text-[#00AC72] uppercase mb-0.5 pointer-events-none">
            Area / LGA
          </label>
          <CustomSelect
            options={areaOptions}
            selected={area}
            onChange={setArea}
            defaultValue={state ? 'Select LGA' : 'Select State First'}
          />
        </div>

        {/* STRUCTURE TYPE */}
        <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
          <label className="text-[10px] font-bold tracking-widest text-[#00AC72] uppercase mb-0.5 pointer-events-none">
            Type
          </label>
          <CustomSelect
            options={TYPE_OPTIONS}
            selected={type}
            onChange={setType}
            defaultValue="Any structure"
          />
        </div>

        {/* BUDGET */}
        <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
          <label className="text-[10px] font-bold tracking-widest text-[#00AC72] uppercase mb-0.5 pointer-events-none">
            Budget
          </label>
          <CustomSelect
            options={BUDGET_RANGES.map((b) => b.label)}
            selected={budget}
            onChange={setBudget}
            defaultValue="Any budget"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full md:w-auto px-8 py-3.5 bg-[#00AC72] hover:bg-[#009663] text-white font-bold text-sm rounded-xl md:rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* POP-UP OVERLAY FOR SEARCH RESULTS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute left-4 right-4 top-full mt-3 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-stone-200/80 p-4 z-50 max-h-105 overflow-y-auto scrollbar-none"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Live Results ({data?.data.count ?? results.length})
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-10 text-stone-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#00AC72]" />
                <span className="text-sm font-medium">Fetching matching properties...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-sm">
                No matching properties found for your current criteria.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {results.map((item) => (
                  <Link
                    key={item.uuid}
                    href={`/properties/${item.uuid}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#00AC72] group-hover:bg-[#00AC72] group-hover:text-white transition-colors">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-800 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <MapPin className="w-3 h-3 text-[#00AC72]" />
                          <span>
                            {item.location.lga}, {item.location.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#00AC72]">
                        ₦{item.base_price.toLocaleString()}
                      </span>
                      {item.payment_frequency && (
                        <span className="text-[10px] text-stone-400 block uppercase">
                          /{item.payment_frequency}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}