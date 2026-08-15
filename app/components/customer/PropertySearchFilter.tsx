'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, MapPin, Building, X, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  useLazyGetCustomerListingsQuery,
  type FetchCustomerListingsQueryParams,
} from '@/shared/service/customer services/customerListing.services';

export const SEARCH_PROMPTS = [
  '3 bed apartment in Lekki under 50M...',
  'Self-contain in Yaba under 3M...',
  'Shortlet in Ikoyi for 150k/night...',
  'Duplex in Ikeja around 10M-30M...',
  'Cheap land in Epe under 5M...',
];

export default function PropertySearchFilter() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [extractedFilters, setExtractedFilters] = useState<{
    state?: string;
    category?: string;
    lga?: string;
  }>({});

  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerSearch, { data, isFetching }] = useLazyGetCustomerListingsQuery();

  const resetSearchState = () => {
    setIsOpen(false);
    setAiMessage('');
    setExtractedFilters({});
  };

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

  // 2. AI Reasoning Search Handler wrapped in useCallback
  // 2. AI Reasoning Search Handler wrapped in useCallback
  const handleAiSearch = useCallback(
    async (queryToSearch: string) => {
      if (!queryToSearch.trim()) return;

      setIsAiProcessing(true);
      setIsOpen(true);
      setAiMessage('');

      try {
        const res = await fetch('/api/ai-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: queryToSearch.trim() }),
        });

        const aiData = await res.json();
        
        // 🔍 LOG raw response from Next.js API route
        console.log('📦 Raw AI API Response:', aiData);

        if (!res.ok) {
          throw new Error(aiData.error || 'Failed to parse query');
        }

        if (aiData.replyMessage) {
          setAiMessage(aiData.replyMessage);
        }

        const activeFilters: FetchCustomerListingsQueryParams = {};

        if (aiData.filters) {
          Object.entries(aiData.filters).forEach(([key, val]) => {
            if (val !== null && val !== undefined && val !== '') {
              (activeFilters as Record<string, unknown>)[key] = val;
            }
          });
        }

        setExtractedFilters({
          state: activeFilters.state,
          category: activeFilters.category,
          lga: activeFilters.lga,
        });

        const queryPayload = {
          page: 1,
          page_size: 5,
          ...activeFilters,
        };

        console.log('🚀 [AI Search] Derived Parameters:', queryPayload);
        triggerSearch(queryPayload);
      } catch (err) {
        console.error('❌ Gemini search error, falling back:', err);
        setAiMessage('Searching properties based on keywords:');

        const fallbackPayload = {
          search: queryToSearch.trim(),
          page_size: 5,
        };

        console.log('⚠️ [AI Search Fallback]:', fallbackPayload);
        triggerSearch(fallbackPayload);
      } finally {
        setIsAiProcessing(false);
      }
    },
    [triggerSearch]
  );


  // 5. Close dropdown on click outside
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
  const isLoading = isAiProcessing || isFetching;

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
            handleAiSearch(searchQuery);
          }}
          className="relative bg-app-background dark:bg-stone-900 rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 w-full backdrop-blur-xl"
        >
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-[#4285F4]/15 via-[#EA4335]/15 to-[#34A853]/15 text-[#4285F4] shrink-0">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
            ) : (
              <Sparkles className="w-4 h-4 animate-pulse text-[#4285F4]" />
            )}
          </div>

          <div className="flex-1 min-w-0 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (!val.trim()) resetSearchState();
              }}
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
                  resetSearchState();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 border-l border-stone-300/70 dark:border-stone-700/70 pl-2">
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
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/80 dark:border-stone-800 p-3.5 z-50 max-h-96 overflow-y-auto scrollbar-none"
          >
            {/* AI CONVERSATIONAL RESPONSE BUBBLE */}
            {aiMessage && !isAiProcessing && (
              <div className="mb-3 p-2.5 rounded-xl bg-linear-to-r from-[#4285F4]/10 via-[#EA4335]/5 to-[#34A853]/10 border border-[#4285F4]/20 flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#4285F4] text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-200 font-medium leading-relaxed">
                  {aiMessage}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Results ({data?.data?.count ?? results.length})
                </span>
                {extractedFilters.state && (
                  <span className="text-[9px] bg-active-link text-primary-green font-semibold px-1.5 py-0.5 rounded-full">
                    {extractedFilters.state}
                  </span>
                )}
                {extractedFilters.lga && (
                  <span className="text-[9px] bg-active-link text-primary-green font-semibold px-1.5 py-0.5 rounded-full">
                    {extractedFilters.lga}
                  </span>
                )}
                {extractedFilters.category && (
                  <span className="text-[9px] bg-active-link text-primary-green font-semibold px-1.5 py-0.5 rounded-full">
                    {extractedFilters.category}
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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-stone-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                <span className="text-xs font-medium">
                  {isAiProcessing
                    ? 'Gemini is processing your request...'
                    : 'Fetching matching listings...'}
                </span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No properties matched your query. Try adjusting your budget or location.
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