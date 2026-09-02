'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface CustomSelectProps {
  options: (string | SelectOption)[];
  selected: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
  variant?: 'boxed' | 'flat';
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  selected,
  onChange,
  defaultValue = 'Select option',
  className = '',
  variant = 'flat',
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (disabled) return;
    onChange(value);
    setIsOpen(false);
  };

  // Helper to extract option value and label safely
  const getOptionData = (option: string | SelectOption) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  };

  // Find label corresponding to the current selected value
  const selectedOption = options.find((opt) => {
    const { value } = getOptionData(opt);
    return value === selected;
  });

  const selectedDisplay = selectedOption
    ? getOptionData(selectedOption).label
    : defaultValue;

  const triggerStyles =
    variant === 'boxed'
      ? `w-full flex items-center justify-between px-4 py-3.5 border rounded-xl transition duration-150 ease-in-out text-left focus:outline-none ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
            : 'bg-[#f3f4f6] hover:bg-[#eaeaea] border-gray-200/80 text-gray-800 cursor-pointer'
        }`
      : `w-full flex items-center justify-between bg-transparent py-1 text-left focus:outline-none group ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={triggerStyles}
      >
        <span
          className={`text-sm truncate pr-2 flex items-center ${
            disabled
              ? 'text-gray-400 font-medium'
              : selected
              ? 'text-gray-900 font-bold'
              : 'text-gray-400 font-medium'
          }`}
        >
          {selectedDisplay}
        </span>

        {/* Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* DROPDOWN OPTIONS PANEL */}
      {!disabled && isOpen && (
        <ul className="absolute left-0 w-56 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-y-auto max-h-60 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.length === 0 ? (
            <li className="px-4 py-3 text-xs text-gray-400 text-center">No options available</li>
          ) : (
            options.map((option, index) => {
              const { value, label } = getOptionData(option);
              const isSelected = selected === value;

              return (
                <li key={typeof option === 'string' ? option : `${value}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(value)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm transition duration-150 flex items-center ${
                      isSelected
                        ? 'bg-emerald-50 text-[#00AC72] font-bold'
                        : 'text-gray-700 hover:bg-stone-100 font-medium'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}