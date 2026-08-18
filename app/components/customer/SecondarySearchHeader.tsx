'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuMic,
  LuMicOff,
  LuVolume2,
  LuVolumeX,
  LuSlidersHorizontal,
  LuBookmark,
  LuSearch,
  LuX,
  LuMapPin,
  LuBed,
  LuBath,
  LuLoader,
} from 'react-icons/lu';
import { useGetCustomerListingsQuery } from '@/shared/service/customer services/customerListing.services';
import PropertyFilter from '@/app/components/FilterComp';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface SecondarySearchHeaderProps {
  initialValue?: string;
  onSaveSearch?: () => void;
  className?: string;
}

export function SecondarySearchHeader({
  initialValue = '',
  onSaveSearch,
  className = '',
}: SecondarySearchHeaderProps) {
  const [query, setQuery] = useState(initialValue);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Speech Recognition & TTS States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Local Filter States
  const [filterValues, setFilterValues] = useState({
    state: '',
    lga: '',
    propertyType: 'All Types',
    minPrice: 0,
    maxPrice: 150,
    bedrooms: 'Any',
    amenities: [] as string[],
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filterValues });

  // Sync prop changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prepare RTK Query Params
  const queryParams = {
    page: 1,
    page_size: 6,
    ...(query.trim() && { search: query.trim() }),
    ...(appliedFilters.propertyType !== 'All Types' && {
      category: appliedFilters.propertyType,
    }),
    ...(appliedFilters.state && { state: appliedFilters.state }),
    ...(appliedFilters.lga && { lga: appliedFilters.lga }),
    ...(appliedFilters.minPrice > 0 && { min_price: appliedFilters.minPrice }),
    ...(appliedFilters.maxPrice < 150 && { max_price: appliedFilters.maxPrice }),
    ...(appliedFilters.bedrooms !== 'Any' && {
      bedrooms: parseInt(appliedFilters.bedrooms.replace('+', ''), 10),
    }),
    ...(appliedFilters.amenities.length > 0 && {
      amenities: appliedFilters.amenities.join(','),
    }),
  };

  // Fetch results live from API endpoint
  const { data, isLoading, isFetching } = useGetCustomerListingsQuery(queryParams, {
    skip:
      !query.trim() &&
      Object.values(appliedFilters).every(
        (val) =>
          !val ||
          val === 'All Types' ||
          val === 'Any' ||
          val === 0 ||
          val === 150 ||
          (Array.isArray(val) && val.length === 0)
      ),
  });

  const listings = data?.data.results || [];

  // Voice Search Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        setQuery(transcript);
        setShowResultsDropdown(true);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResultsDropdown(true);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);

      setQuery('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!query.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const utterance = new SpeechSynthesisUtterance(query);
    utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterValues });
    setShowFilterDrawer(false);
    setShowResultsDropdown(true);
  };

  const handleClearFilters = () => {
    const resetState = {
      state: '',
      lga: '',
      propertyType: 'All Types',
      minPrice: 0,
      maxPrice: 150,
      bedrooms: 'Any',
      amenities: [],
    };
    setFilterValues(resetState);
    setAppliedFilters(resetState);
  };

  return (
    <div ref={containerRef} className={`relative w-9/10 ${className}`}>
      {/* Search Header Container */}
      <div className="w-full bg-slate-100/80 backdrop-blur-md rounded-2xl p-2 md:p-3 border border-slate-200/60 shadow-xs flex items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3.5 py-2 border border-slate-200/80 shadow-2xs min-w-0">
          <LuSearch className="text-slate-400 text-base shrink-0" />

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResultsDropdown(true)}
            placeholder={
              isListening
                ? 'Listening... Speak now'
                : 'Search location, state, or property type...'
            }
            className="w-full bg-transparent text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium truncate"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowResultsDropdown(false);
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0 cursor-pointer"
            >
              <LuX className="text-sm" />
            </button>
          )}

          {/* Controls Right */}
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice search'}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isListening
                  ? 'text-red-500 animate-pulse'
                  : 'hover:text-slate-600'
              }`}
            >
              {isListening ? (
                <LuMicOff className="text-sm" />
              ) : (
                <LuMic className="text-sm" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleTextToSpeech}
              title={isSpeaking ? 'Stop reading' : 'Read search query aloud'}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isSpeaking
                  ? 'text-blue-600 animate-pulse'
                  : 'hover:text-slate-600'
              }`}
            >
              {isSpeaking ? (
                <LuVolumeX className="text-sm" />
              ) : (
                <LuVolume2 className="text-sm" />
              )}
            </button>

            {/* Toggle Filters Button */}
            <button
              type="button"
              onClick={() => setShowFilterDrawer((prev) => !prev)}
              title="Filter options"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                showFilterDrawer
                  ? 'text-primary-green bg-green-50'
                  : 'hover:text-slate-600'
              }`}
            >
              <LuSlidersHorizontal className="text-xs" />
            </button>
          </div>
        </div>

        {/* Save Search Button */}
        <button
          type="button"
          onClick={onSaveSearch}
          className="shrink-0 hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <LuBookmark className="text-slate-500 text-xs" />
          Save Search
        </button>
      </div>

      {/* FILTER DRAWER OVERLAY WITH ANIMATIONS */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Filter Search Results
              </h3>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                <LuX />
              </button>
            </div>
            <PropertyFilter
              values={filterValues}
              onChange={setFilterValues}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onClose={() => setShowFilterDrawer(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE SEARCH RESULTS DROPDOWN WITH ANIMATIONS */}
      <AnimatePresence>
        {showResultsDropdown && (query.trim().length > 0 || listings.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-40 bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden max-h-110 overflow-y-auto"
          >
            {isLoading || isFetching ? (
              <div className="p-8 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
                <LuLoader className="animate-spin text-lg text-primary-green" />
                Searching properties...
              </div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                No properties found matching &quot;{query}&quot;.
              </div>
            ) : (
              <div className="p-2 divide-y divide-slate-100">
                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Property Matches ({data?.data.count || listings.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Live Results
                  </span>
                </div>

                {listings.map((item) => (
                  <Link
                    key={item.uuid}
                    href={`/discover/${item.uuid}`}
                    onClick={() => setShowResultsDropdown(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
                  >
                    <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={
                          item.cover_image ||
                          '/images/placeholder.jpg'
                        }
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-800 truncate group-hover:text-primary-green transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <LuMapPin className="text-slate-400 shrink-0" />
                        {item.location.lga}, {item.location.state}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        {item.bedrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <LuBed className="text-slate-400" /> {item.bedrooms} Beds
                          </span>
                        )}
                        {item.bathrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <LuBath className="text-slate-400" /> {item.bathrooms} Baths
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs md:text-sm font-extrabold text-primary-green">
                        ₦{Number(item.base_price).toLocaleString()}
                      </p>
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