'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LuPlus, LuMic, LuMicOff, LuArrowUp, LuX, LuSparkles, LuBot, LuBuilding, LuMapPin } from 'react-icons/lu';
import { Loader } from 'lucide-react';
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

// Type declaration for browser Speech Recognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Type definitions for Web Speech API
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

export function AiSearchBox({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'Buy' | 'Rent'>('Buy');
  const [promptText, setPromptText] = useState('');

  // Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // AI Search & Filter States
  const [isOpen, setIsOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [extractedFilters, setExtractedFilters] = useState<{
    state?: string;
    category?: string;
    lga?: string;
  }>({});

  // Typewriter Animation States
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

  // 1. Initialize Speech Recognition
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

        setPromptText(transcript);
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

  // Toggle Voice Recording
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setPromptText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 2. Typewriter Animation Effect
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

  // 3. AI Search Handler
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
          body: JSON.stringify({ prompt: queryToSearch.trim(), tab: activeTab }),
        });

        const aiData = await res.json();

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

        triggerSearch(queryPayload);
      } catch (err) {
        console.error('❌ Gemini search error, falling back:', err);
        setAiMessage('Searching properties based on keywords:');

        const fallbackPayload = {
          search: queryToSearch.trim(),
          page_size: 5,
        };

        triggerSearch(fallbackPayload);
      } finally {
        setIsAiProcessing(false);
      }
    },
    [triggerSearch, activeTab]
  );

  // 4. Click outside to dismiss popup
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
    <div ref={containerRef} className={`relative w-full max-w-4xl mx-auto flex flex-col items-center ${className}`}>
      {/* Main Search Container */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-xl border border-slate-100 flex flex-col gap-3">
        
        {/* Top Tab Switcher & Powered By Google AI indicator */}
        <div className="flex items-center justify-between w-full px-1">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full w-fit text-xs font-semibold text-slate-600">
            {(['Buy', 'Rent'] as const).map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    isActive ? 'text-slate-900' : 'hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-white rounded-full shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/50">
            <LuSparkles className="text-amber-500 text-xs" />
            Powered by Google AI
          </span>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAiSearch(promptText);
          }}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5"
        >
          <button 
            type="button" 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <LuPlus className="text-xl" />
          </button>

          <input
            type="text"
            value={promptText}
            onChange={(e) => {
              const val = e.target.value;
              setPromptText(val);
              if (!val.trim()) resetSearchState();
            }}
            onFocus={() => {
              if (promptText.trim()) setIsOpen(true);
            }}
            placeholder={
              isListening
                ? 'Listening... Speak now'
                : placeholderText || 'House with great high school in Irvine, CA'
            }
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium truncate"
          />

          {promptText && (
            <button
              type="button"
              onClick={() => {
                setPromptText('');
                resetSearchState();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <LuX className="text-lg" />
            </button>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {/* Free Speech-To-Text Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice search'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isListening ? <LuMicOff className="text-lg" /> : <LuMic className="text-lg" />}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="text-sm animate-spin" />
              ) : (
                <LuArrowUp className="text-sm stroke-3" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pt-3 px-1">
        {SEARCH_PROMPTS.map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPromptText(text);
              handleAiSearch(text);
            }}
            className="shrink-0 px-4 py-1.5 bg-white/40 hover:bg-white/70 backdrop-blur-md text-xs font-medium text-slate-700 rounded-full border border-white/50 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LuSparkles className="text-slate-400 text-xs" />
            {text}
          </button>
        ))}
      </div>

      {/* Dynamic Overlay Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-3.5 z-50 max-h-96 overflow-y-auto no-scrollbar"
          >
            {aiMessage && !isAiProcessing && (
              <div className="mb-3 p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-slate-900 text-white shrink-0 mt-0.5">
                  <LuBot className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Google AI
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {aiMessage}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Results ({data?.data?.count ?? results.length})
                </span>
                {extractedFilters.state && (
                  <span className="text-[9px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-full">
                    {extractedFilters.state}
                  </span>
                )}
                {extractedFilters.lga && (
                  <span className="text-[9px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-full">
                    {extractedFilters.lga}
                  </span>
                )}
                {extractedFilters.category && (
                  <span className="text-[9px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-full">
                    {extractedFilters.category}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <LuX className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                <Loader className="w-5 h-5 animate-spin text-slate-800" />
                <span className="text-xs font-medium">
                  {isAiProcessing ? 'Google AI is processing your query...' : 'Fetching matching listings...'}
                </span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No properties matched your query. Try adjusting your budget or search terms.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {results.map((item) => (
                  <Link
                    key={item.uuid}
                    href={`/discover/${item.uuid}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <LuBuilding className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                          <LuMapPin className="w-3 h-3 text-slate-600 shrink-0" />
                          <span className="truncate">
                            {item.location.lga}, {item.location.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        ₦{item.base_price.toLocaleString()}
                      </span>
                      {item.payment_frequency && (
                        <span className="text-[9px] text-slate-400 block uppercase">
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