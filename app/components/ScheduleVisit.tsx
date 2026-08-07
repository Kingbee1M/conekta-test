'use client';

import { useState, useEffect } from 'react';
import { createPortal as reactCreatePortal } from 'react-dom';
import { Calendar } from '@/components/ui/calendar';
import CustomSelect from './ui/CustomSelect';

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

const VISIT_TYPES = [
  'Physical Property Inspection',
  'Virtual Video Walkthrough',
  'In-Person Consultation',
];

export default function ScheduleVisitPortal({ onClose }: { onClose?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [visitType, setVisitType] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Ensure portal only renders on the client side to avoid SSR hydration mismatches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !visitType) return;

    const bookingPayload = {
      fullName,
      phone,
      visitType,
      date: selectedDate.toISOString(),
      time: selectedTime,
    };
    setIsSubmitted(true);
  };

  if (!mounted) return null;

  const content = (
    <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      {/* Outer Dismiss Click Wrapper */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Surface Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="w-full text-center flex flex-col items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00AC72] flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Visit Scheduled!</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                We&apos;ve reserved your slot for{' '}
                <span className="font-semibold text-gray-800">
                  {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>{' '}
                at <span className="font-semibold text-gray-800">{selectedTime}</span>. A confirmation has been logged.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                if (onClose) onClose();
              }}
              className="mt-2 px-6 py-2.5 bg-[#00AC72] hover:bg-[#009663] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-[#00AC72] uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AC72]" />
                Book Inspection
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Schedule a Visit</h2>
              <p className="text-xs text-gray-500 mt-1">
                Pick a date and preferred time slot to tour the property or meet with our team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Contact Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-[#00AC72] focus:ring-1 focus:ring-[#00AC72]/20 transition-all text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-[#00AC72] focus:ring-1 focus:ring-[#00AC72]/20 transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Visit Type Selector */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-gray-700">Visit Type</label>
                <CustomSelect
                  options={VISIT_TYPES}
                  selected={visitType}
                  onChange={(val) => setVisitType(val)}
                  defaultValue="Select Visit Purpose"
                  className="w-full text-xs"
                />
              </div>

              {/* Calendar & Time Slots Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2 border-t border-gray-100">
                {/* Calendar Picker */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 self-start">Select Date</span>
                  <div className="p-1 border border-gray-200 rounded-xl bg-gray-50/50">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Available Slots Grid */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-700">Available Time Slots</span>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#00AC72] text-white border-[#00AC72] shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 justify-end pt-4 border-t border-gray-100">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-xs font-bold rounded-xl transition-colors text-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!visitType || !selectedDate}
                  className="px-5 py-2.5 bg-[#00AC72] hover:bg-[#009663] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-emerald-700/10 cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // Climbs out to document.body
  return reactCreatePortal(content, document.body);
}