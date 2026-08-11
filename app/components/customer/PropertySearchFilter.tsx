'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Loader2, MapPin, Building, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { structureType } from '@/shared/enums/structure.enum';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { useLazyGetCustomerListingsQuery } from '@/shared/service/customer services/customerListing.services';

// Dynamic animated placeholder prompts
export const SEARCH_PROMPTS = [
  // Budget-Focused & Shortlet
  'Search "3 bedroom apartment in Lekki, Lagos under 50M"...',
  'Try "Self-contain flat in Yaba, Lagos under 3 million"...',
  'Search "Shortlet apartment in Ikoyi for 150k per night"...',
  'Try "Duplex in Ikeja with budget around 10M to 30M"...',
  'Search "Cheap land for sale in Epe, Lagos under 5M"...',

  // Premium & Luxury
  'Search "Luxury penthouse in Banana Island with swimming pool"...',
  'Try "5 bedroom fully detached duplex in Maitama, Abuja"...',
  'Search "Oceanfront villa in Victoria Island"...',
  'Try "Fully furnished duplex in Guzape with elevator"...',

  // Location & Regional Specific
  'Search "Bungalow for sale in Abuja, Federal Capital Territory"...',
  'Try "4 bedroom duplex in GRA Phase 2, Port Harcourt"...',
  'Search "2 bedroom flat for rent in Bodija, Ibadan"...',
  'Try "Houses for sale near Asaba Airport, Delta State"...',
  'Search "Serviced apartment in Jabi, Abuja"...',

  // Land & Investment Opportunities
  'Search "Dry land with C of O in Ibeju-Lekki"...',
  'Try "Commercial plot along Express Road, Kano"...',
  'Search "Farmland for sale in Ogun State with C of O"...',
  'Try "2 plots of land in Centenary City, Enugu"...',

  // Commercial & Office Spaces
  'Search "Commercial shop in Victoria Island"...',
  'Try "Office space for rent in Central Business District, Abuja"...',
  'Search "Warehouse for rent in Ikeja Industrial Estate"...',
  'Try "Event center for sale in GRA, Benin City"...',

  // Specific Features & Utilities
  'Search "Serviced 3 bedroom flat with 24/7 power in Oniru"...',
  'Try "House for rent with private gym and cinema in Chevron"...',
  'Search "Smart home duplex in Katampe Extension"...',
  'Try "Pet-friendly apartment in Surulere with parking space"...',
];

const BUDGET_RANGES = [
  { label: '₦1,000,000 - ₦3,000,000', min: 1000000, max: 3000000 },
  { label: '₦3,000,000 - ₦10,000,000', min: 3000000, max: 10000000 },
  { label: '₦10,000,000 - ₦50,000,000', min: 10000000, max: 50000000 },
  { label: '₦50,000,000+', min: 50000000, max: undefined },
];

export default function PropertySearchFilter() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Typewriter effect states
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerSearch, { data, isFetching }] = useLazyGetCustomerListingsQuery();

  // 1. Typewriter Animation Effect
  useEffect(() => {
    const currentPrompt = SEARCH_PROMPTS[promptIndex];
    const typingSpeed = isDeleting ? 30 : 60;
    const pauseDuration = 2200;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPrompt.length) {
        setPlaceholderText(currentPrompt.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (!isDeleting && charIndex === currentPrompt.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentPrompt.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, promptIndex]);

  // 2. Client-side NLP Extractor to preserve backend structure parameters
  const parsedParameters = useMemo(() => {
    const queryLower = searchQuery.toLowerCase();
    if (!queryLower.trim()) return {};

    // Match State
    let detectedState: string | undefined = undefined;
    for (const st of Object.values(NigeriaStateEnum)) {
      if (queryLower.includes(st.toLowerCase())) {
        detectedState = st;
        break;
      }
    }

    // Match LGA
    let detectedLga: string | undefined = undefined;
    if (detectedState && NIGERIA_LGA_MAP[detectedState as NigeriaStateEnum]) {
      const lgas = NIGERIA_LGA_MAP[detectedState as NigeriaStateEnum];
      for (const lga of lgas) {
        if (queryLower.includes(lga.toLowerCase())) {
          detectedLga = lga;
          break;
        }
      }
    } else {
      for (const lgas of Object.values(NIGERIA_LGA_MAP)) {
        for (const lga of lgas) {
          if (queryLower.includes(lga.toLowerCase())) {
            detectedLga = lga;
            break;
          }
        }
        if (detectedLga) break;
      }
    }

    // Match Structure Type
    let detectedCategory: string | undefined = undefined;
    for (const type of Object.values(structureType)) {
      if (queryLower.includes(type.toLowerCase())) {
        detectedCategory = type;
        break;
      }
    }

    // Match Numbers/Prices (e.g., 5m, 10 million, 50,000,000)
    let min_price: number | undefined = undefined;
    let max_price: number | undefined = undefined;

    const millionMatch = queryLower.match(/(\d+)\s*(m|million)/i);
    if (millionMatch) {
      const val = parseInt(millionMatch[1], 10) * 1000000;
      if (queryLower.includes('under') || queryLower.includes('less than')) {
        max_price = val;
      } else if (queryLower.includes('above') || queryLower.includes('from')) {
        min_price = val;
      } else {
        max_price = val;
      }
    }

    return {
      state: detectedState,
      lga: detectedLga,
      category: detectedCategory,
      min_price,
      max_price,
    };
  }, [searchQuery]);

  // 3. Trigger debounced API query
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      triggerSearch({
        search: searchQuery.trim(),
        state: parsedParameters.state,
        lga: parsedParameters.lga,
        category: parsedParameters.category,
        min_price: parsedParameters.min_price,
        max_price: parsedParameters.max_price,
        page_size: 5,
      });
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, parsedParameters, triggerSearch]);

  // 4. Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = data?.data?.results || [];

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4 z-30">
      {/* MOVING GRADIENT BORDER CONTAINER */}
      <div className="relative p-[2.5px] rounded-full overflow-hidden shadow-2xl group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(42,133,69,0.25)]">
        {/* Animated Gradient Background Ring */}
        <div 
          className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, #2a8545, #80da90, #00B075, #9bf7aa, #1B4D3E, #2a8545)',
          }}
        />

        {/* PILL INNER FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) setIsOpen(true);
          }}
          className="relative bg-[#F5F2EB] dark:bg-stone-900 rounded-full px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-3 w-full backdrop-blur-xl"
        >
          {/* AI Search Icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2a8545]/10 text-[#2a8545] shrink-0">
            {isFetching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 animate-pulse" />
            )}
          </div>

          {/* INPUT FIELD WITH ANIMATED PLACEHOLDER */}
          <div className="flex-1 relative flex items-center overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setIsOpen(true);
              }}
              placeholder={placeholderText}
              className="w-full bg-transparent text-sm md:text-base font-medium text-[#262626] dark:text-stone-100 placeholder-[#5f5e5e] focus:outline-none pr-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* RIGHT SIDE: POWERED BY GOOGLE BADGE & BUTTON */}
          <div className="flex items-center gap-3 shrink-0 border-l border-stone-300 dark:border-stone-700 pl-3 md:pl-4">
            <div className="hidden sm:flex flex-col items-end pointer-events-none select-none">
              <span className="text-[9px] font-semibold tracking-wider text-[#5f5e5e] uppercase">
                Powered by
              </span>
              <span className="text-xs font-bold bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Google AI
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2a8545] hover:bg-[#80da90] hover:text-[#1B4D3E] text-white font-bold text-xs md:text-sm rounded-full shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* POP-UP OVERLAY FOR SEARCH RESULTS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-4 right-4 top-full mt-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 p-4 z-50 max-h-96 overflow-y-auto scrollbar-none"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 dark:border-stone-800 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  AI Results ({data?.data?.count ?? results.length})
                </span>
                {parsedParameters.state && (
                  <span className="text-[10px] bg-[#DBFCE7CC] text-[#2a8545] font-semibold px-2 py-0.5 rounded-full">
                    {parsedParameters.state}
                  </span>
                )}
                {parsedParameters.category && (
                  <span className="text-[10px] bg-[#DBFCE7CC] text-[#2a8545] font-semibold px-2 py-0.5 rounded-full">
                    {parsedParameters.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-10 text-stone-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#2a8545]" />
                <span className="text-sm font-medium">Scanning properties with AI...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-sm">
                No properties matched your search prompt. Try clarifying the location or budget.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {results.map((item) => (
                  <Link
                    key={item.uuid}
                    href={`/properties/${item.uuid}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EEF1EC] dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2a8545]/10 flex items-center justify-center text-[#2a8545] group-hover:bg-[#2a8545] group-hover:text-white transition-colors">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#262626] dark:text-stone-100 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e]">
                          <MapPin className="w-3 h-3 text-[#2a8545]" />
                          <span>
                            {item.location.lga}, {item.location.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#2a8545]">
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