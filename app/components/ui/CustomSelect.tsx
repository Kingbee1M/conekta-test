'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  defaultValue?: string; // Optional placeholder (e.g., "LGA")
  className?: string;     // Override styles if necessary
}

export default function CustomSelect({
  options,
  selected,
  onChange,
  defaultValue = 'Select option',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* TRIGGER BUTTON (Matches the design screenshot) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-[#f3f4f6] hover:bg-[#eaeaea] border border-gray-200/80 rounded-xl text-gray-800 transition duration-150 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className={`${!selected ? 'text-gray-500' : 'text-gray-800'} font-medium text-sm`}>
          {selected || defaultValue}
        </span>
        
        {/* Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* DROPDOWN OPTIONS PANEL */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-y-auto max-h-60 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-400 text-center">No options available</li>
          ) : (
            options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition duration-150 ${
                    selected === option
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}