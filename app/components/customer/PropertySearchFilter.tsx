'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Loader2, MapPin, Building, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { structureType } from '@/shared/enums/structure.enum';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { useLazyGetCustomerListingsQuery } from '@/shared/service/customer services/customerListing.services';

// Shortened prompts for crisp horizontal display
export const SEARCH_PROMPTS = [
  '3 bed apartment in Lekki under 50M...',
  'Self-contain in Yaba under 3M...',
  'Shortlet in Ikoyi for 150k/night...',
  'Duplex in Ikeja around 10M-30M...',
  'Cheap land in Epe under 5M...',
  'Penthouse in Banana Island with pool...',
  '5 bed duplex in Maitama, Abuja...',
  'Serviced flat with 24/7 power in Oniru...',
  'Commercial plot along Express Rd, Kano...',
  '4 bed duplex in GRA, Port Harcourt...',
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
    const typingSpeed = isDeleting ? 25 : 55;
    const pauseDuration = 2000;

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

  // 2. Client-side NLP Extractor
  const parsedParameters = useMemo(() => {
    const queryLower = searchQuery.toLowerCase();
    if (!queryLower.trim()) return {};

    let detectedState: string | undefined = undefined;
    for (const st of Object.values(NigeriaStateEnum)) {
      if (queryLower.includes(st.toLowerCase())) {
        detectedState = st;
        break;
      }
    }

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

    let detectedCategory: string | undefined = undefined;
    for (const type of Object.values(structureType)) {
      if (queryLower.includes(type.toLowerCase())) {
        detectedCategory = type;
        break;
      }
    }

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
    if (!searchQuery.trim()) return;

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
    <div ref={containerRef} className="relative w-full z-30">
      {/* GOOGLE COLOR-GRADIENT BORDER CONTAINER */}
      <div className="relative p-0.5 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div
          className="absolute -inset-full animate-[spin_5s_linear_infinite]"
          style={{
            background:
              'conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4)',
          }}
        />

        {/* PILL INNER FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) setIsOpen(true);
          }}
          className="relative bg-app-background dark:bg-stone-900 rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 w-full backdrop-blur-xl"
        >
          {/* AI Sparkles Icon with Google AI Gradient */}
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-[#4285F4]/15 via-[#EA4335]/15 to-[#34A853]/15 text-[#4285F4] shrink-0">
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
            ) : (
              <Sparkles className="w-4 h-4 animate-pulse text-[#4285F4]" />
            )}
          </div>

          {/* INPUT FIELD WITH TRUNCATED ANIMATED PLACEHOLDER */}
          <div className="flex-1 min-w-0 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setIsOpen(true);
              }}
              placeholder={placeholderText}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-text-primary dark:text-stone-100 placeholder-[#737373] focus:outline-none truncate pr-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* RIGHT SIDE: COLORFUL GOOGLE BRANDING & BUTTON */}
          <div className="flex items-center gap-2 shrink-0 border-l border-stone-300/70 dark:border-stone-700/70 pl-2">
            {/* Explicit "Powered by Google AI" Label */}
            <div className="hidden sm:flex items-center gap-1 pointer-events-none select-none text-[10px] font-medium text-stone-500 dark:text-stone-400">
              <span className="text-[9px]">Powered by</span>
              <span className="font-bold tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="font-semibold text-[#4285F4] text-[9px]">AI</span>
            </div>

            <button
              type="submit"
              className="p-2 sm:px-3.5 sm:py-1.5 bg-primary-green hover:bg-primary-green-hover text-white font-bold text-xs rounded-full shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* POP-UP OVERLAY FOR SEARCH RESULTS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/80 dark:border-stone-800 p-3 z-50 max-h-80 overflow-y-auto scrollbar-none"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Results ({data?.data?.count ?? results.length})
                </span>
                {parsedParameters.state && (
                  <span className="text-[9px] bg-active-link text-primary-green font-semibold px-1.5 py-0.5 rounded-full">
                    {parsedParameters.state}
                  </span>
                )}
                {parsedParameters.category && (
                  <span className="text-[9px] bg-active-link text-primary-green font-semibold px-1.5 py-0.5 rounded-full">
                    {parsedParameters.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-6 text-stone-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
                <span className="text-xs font-medium">Scanning properties...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No properties matched your query. Try a different location or price.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {results.map((item) => (
                  <Link
                    key={item.uuid}
                    href={`/properties/${item.uuid}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-full bg-[#2a8545]/10 flex items-center justify-center text-[#2a8545] shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-primary dark:text-stone-100 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-[#5f5e5e] truncate">
                          <MapPin className="w-3 h-3 text-[#2a8545] shrink-0" />
                          <span className="truncate">
                            {item.location.lga}, {item.location.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#2a8545]">
                        ₦{item.base_price.toLocaleString()}
                      </span>
                      {item.payment_frequency && (
                        <span className="text-[9px] text-stone-400 block uppercase">
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