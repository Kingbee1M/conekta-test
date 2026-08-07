'use client';

import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  '10,000+ verified listings',
  'Lekki',
  '2,300+ trusted realtors',
  'Ikoyi',
  '1,800+ artisans on-platform',
  'Abuja',
  'Zero fake agents',
  'Port Harcourt',
  'Fast inspection bookings',
  'Ibadan',
  'Vetted property managers',
  'Enugu',
  'Direct owner contacts',
  'Lagos',
];

export default function MarqueeBanner() {
  return (
    <div className="w-full bg-[#00AC72] text-white py-3.5 overflow-hidden shadow-md border-y border-emerald-600 select-none">
      <div className="flex w-max">
        {/* Render 2 identical sets side-by-side to allow seamless infinite loop */}
        {[0, 1].map((setIndex) => (
          <motion.div
            key={setIndex}
            className="flex items-center whitespace-nowrap"
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 35, // Adjust speed (lower is faster)
            }}
          >
            {MARQUEE_ITEMS.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-4">
                  {item}
                </span>
                <span className="text-emerald-200 text-xs px-2 opacity-80">●</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}