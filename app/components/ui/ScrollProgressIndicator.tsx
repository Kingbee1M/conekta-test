'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SectionItem {
  id: string;
  label: string;
}

interface ScrollProgressIndicatorProps {
  sections: SectionItem[];
}

export default function ScrollProgressIndicator({ sections }: ScrollProgressIndicatorProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Show/Hide threshold: Hide while in Hero section, reveal when scrolled past Hero (e.g. 300px down)
      const heroThreshold = 700; 
      setIsVisible(currentScrollY > heroThreshold);

      // 2. Section tracking
      const scrollPosition = currentScrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3 pointer-events-auto"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className="group relative flex items-center justify-end py-1 px-1 cursor-pointer focus:outline-none"
                aria-label={`Scroll to ${section.label}`}
              >
                {/* Tooltip Label on Hover */}
                <span className="absolute right-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md whitespace-nowrap pointer-events-none -translate-x-1 group-hover:translate-x-0">
                  {section.label}
                </span>

                {/* Mintlify-style Indicator Bar */}
                <motion.div
                  animate={{
                    width: isActive ? 28 : 16,
                    backgroundColor: isActive ? '#0F172A' : '#CBD5E1', // Active dark slate vs inactive muted gray
                    height: isActive ? 4 : 3,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  whileHover={{ width: 24, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="rounded-full"
                />
              </button>
            );
          })}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}