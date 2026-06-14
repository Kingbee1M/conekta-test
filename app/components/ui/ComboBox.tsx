'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoCloseOutline, IoChevronDownOutline } from 'react-icons/io5';

export interface ComboboxOption {
  label: string;
  value: string | number;
}

type ComboboxValue = string | number | (string | number)[];

interface ComboboxProps {
  label: string;
  name: string;
  options: ComboboxOption[];
  value: ComboboxValue | null | undefined;
  onChange: (name: string, value: ComboboxValue) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  multiSelect?: boolean;
  searchable?: boolean;
  creatable?: boolean; // 🟢 Add opt-in toggle for typing custom options
}

export default function Combobox({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = 'Select an option...',
  icon,
  multiSelect = false,
  searchable = true,
  creatable = false, // 🟢 Default to false so it changes nothing unless explicitly turned on
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedValues: (string | number)[] = React.useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) {
          const fakeFocusEvent = {
            target: { name }
          } as unknown as React.FocusEvent<HTMLInputElement>;
          onBlur(fakeFocusEvent);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur, name]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionSelect = (option: ComboboxOption) => {
    if (multiSelect) {
      if (selectedValues.includes(option.value)) {
        const updated = selectedValues.filter((v) => v !== option.value);
        onChange(name, updated);
      } else {
        onChange(name, [...selectedValues, option.value]);
      }
      setSearchQuery('');
      inputRef.current?.focus();
    } else {
      onChange(name, option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // 🟢 Precision Add: Handle key bindings ONLY if multiSelect and creatable are true
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!multiSelect || !creatable) return;

    const trimmedQuery = searchQuery.trim();
    
    if ((e.key === 'Enter' || e.key === ',') && trimmedQuery.length > 0) {
      e.preventDefault();
      const cleanTagValue = trimmedQuery.replace(/,$/, '').trim();
      
      if (cleanTagValue && !selectedValues.includes(cleanTagValue)) {
        onChange(name, [...selectedValues, cleanTagValue]);
      }
      setSearchQuery('');
    }

    if (e.key === 'Backspace' && searchQuery === '' && selectedValues.length > 0) {
      const updated = selectedValues.slice(0, -1);
      onChange(name, updated);
    }
  };

  const handleRemoveItem = (e: React.MouseEvent, optionValue: string | number) => {
    e.stopPropagation(); 
    const updated = selectedValues.filter((v) => v !== optionValue);
    onChange(name, updated);
  };

  return (
    <div ref={containerRef} className="outerDiv relative">
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`inputDiv cursor-pointer gap-1.5 min-h-10 flex-wrap ${
          touched && error ? 'border-red-500 border-2' : 'border-transparent'
        }`}
        style={{ backgroundColor: '#F3F3F5', borderRadius: '7px', borderWidth: '2px' }}
      >
        {icon && <div className=" flex items-center shrink-0 text-[18px]">{icon}</div>}

        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {multiSelect && selectedValues.length > 0 ? (
            selectedValues.map((val) => {
              const matchedOption = options.find((opt) => opt.value === val);
              const displayLabel = matchedOption ? matchedOption.label : String(val);

              return (
                <div
                  key={val}
                  className="flex items-center gap-1 bg-[#00AC72]/10 border border-[#00AC72]/20 text-[#00AC72] text-xs font-medium px-2 py-0.5 rounded-full select-none max-w-full"
                >
                  <span className="truncate max-w-30">{displayLabel}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveItem(e, val)}
                    className="hover:bg-[#00AC72]/20 rounded-full p-0.5 transition-colors shrink-0"
                  >
                    <IoCloseOutline className="text-sm stroke-[3px]" />
                  </button>
                </div>
              );
            })
          ) : !multiSelect && selectedValues.length > 0 && !isOpen ? (
            <span className="text-sm text-gray-900 truncate">
              {options.find((opt) => opt.value === selectedValues[0])?.label || String(selectedValues[0])}
            </span>
          ) : null}

          {(isOpen && searchable) || selectedValues.length === 0 ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} // 🟢 Keyboard attachment point
              placeholder={selectedValues.length === 0 ? placeholder : ''}
              className="bg-transparent outline-none text-sm p-0 border-none flex-1 min-w-15 text-gray-800"
              style={{ padding: 0 }}
            />
          ) : null}
        </div>

        <div className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <IoChevronDownOutline className="text-base" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden py-1">
          
          {/* 🟢 Precision Add: Conditional drop panel selection alternative link */}
          {creatable && searchQuery.trim() && !options.some(opt => opt.label.toLowerCase() === searchQuery.trim().toLowerCase()) && (
            <div
              onClick={() => {
                if (!selectedValues.includes(searchQuery.trim())) {
                  onChange(name, [...selectedValues, searchQuery.trim()]);
                }
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="px-4 py-2 text-sm text-[#00AC72] font-medium hover:bg-gray-100 cursor-pointer select-none transition-colors border-b border-gray-100"
            >
              Add custom option: <span className="font-bold">&quot;{searchQuery.trim()}&quot;</span>
            </div>
          )}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={`px-4 py-2 text-sm cursor-pointer select-none transition-colors flex items-center justify-between ${
                    isSelected 
                      ? 'bg-[#00AC72]/10 text-[#00AC72] font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {multiSelect && isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#00AC72]" />
                  )}
                </div>
              );
            })
          ) : !searchQuery.trim() ? (
            <div className="px-4 py-3 text-sm text-gray-400 italic text-center">
              No choices available
            </div>
          ) : null}
        </div>
      )}

      {touched && error && (
        <span className="text-[10px] text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
}