'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

// Basic fade in up for general elements
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

// Presenter-style mask animation for headlines
const headlineMask: Variants = {
  hidden: { y: '100%' },
  visible: (delay: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      delay: delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Content that "falls out" from under
const fallOut: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: 'easeOut',
    },
  }),
};

interface PainPoint {
  id: string;
  number: string;
  title: string;
  problem: string;
  solution: string;
}

const painPoints: PainPoint[] = [
  {
    id: '01',
    number: '01',
    title: 'Ghost listings everywhere',
    problem: 'You call 20 agents. Half the properties don’t exist. The other half are already taken.',
    solution: '100% verified listings. If you see it on Conekta, it is available and it is real.',
  },
  {
    id: '02',
    number: '02',
    title: 'Agent extortion',
    problem: 'Unregulated agents charge 10%+ on both sides with zero accountability.',
    solution: 'Standardized fees and digital processing. No hidden charges, no unreceipted cash.',
  },
  {
    id: '03',
    number: '03',
    title: '2 years upfront',
    problem: 'Landlords demand 24 months rent before you move in, but you earn monthly.',
    solution: 'Flexible payment options. Pay monthly or quarterly to match your income flow.',
  },
  {
    id: '04',
    number: '04',
    title: 'Fragmented journey',
    problem: 'Search here. Finance there. Sign paper. Pay cash. Every step is a separate nightmare.',
    solution: 'Single integrated ecosystem. Search, verify, pay, sign, and manage all in one app.',
  },
  {
    id: '05',
    number: '05',
    title: 'Zero trust infrastructure',
    problem: 'Money moves on faith. No escrow. No protection. If the agent runs, your money is gone.',
    solution: 'Secure Digital Escrow. Funds are only released when keys are successfully in your hand.',
  },
];

interface FlipCardProps {
  item: PainPoint;
  className?: string;
}

function FlipCard({ item, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsFlipped(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsFlipped(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`group relative h-80 rounded-3xl transform-3d transition-transform duration-700 ease-[0.4,0,0.2,1] cursor-pointer ${
        isFlipped ? 'transform-[rotateY(180deg)]' : ''
      } ${className}`}
    >
      {/* --- FRONT: OLD STATUS QUO --- */}
      <div className="absolute inset-0 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm backface-hidden flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-slate-100 blur-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-[6] transition-all duration-700 ease-out pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {item.title}
            </h3>
            <span className="text-xl font-bold text-slate-200">
              {item.number}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {item.problem}
          </p>
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="uppercase tracking-wider">Old Status Quo</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* --- BACK: NEW STATUS QUO --- */}
      <div className="absolute inset-0 p-8 rounded-3xl bg-primary-green text-white transform-[rotateY(180deg)] backface-hidden flex flex-col justify-between overflow-hidden border border-primary-green/20">
        <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-white blur-2xl opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-white">
              The Conekta Way
            </h3>
            <span className="text-xl font-bold text-white/40">
              {item.number}
            </span>
          </div>
          <p className="text-sm text-white/90 leading-relaxed font-normal">
            {item.solution}
          </p>
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 font-medium">
          <span className="uppercase tracking-wider">New Standard</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function BrokenRealitySection() {
  return (
    <section className="relative py-20 lg:py-28 lg:px-16 bg-slate-50/50 text-text-primary overflow-hidden border-t border-slate-100 selection:bg-tertiary-green selection:text-primary-green">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl pointer-events-none opacity-5"
        style={{ backgroundColor: 'var(--color-primary-green)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left max-w-4xl space-y-5 mb-16 sm:mb-24">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            <span className="text-[11px] font-bold tracking-widest text-secondary-green uppercase">
              THE BROKEN REALITY
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            <span className="block overflow-hidden relative">
              <motion.span
                className="block text-4xl"
                custom={0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headlineMask}
              >
                Finding a home in Lagos
              </motion.span>
            </span>
            <span className="block overflow-hidden relative">
              <motion.span
                className="block text-primary-green text-4xl"
                custom={0.5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headlineMask}
              >
                should not feel like war.
              </motion.span>
            </span>
          </h2>

          <div className="relative pt-4">
            <div className="relative w-full h-1 bg-transparent overflow-hidden rounded-full mb-6">
              <motion.div
                className="absolute top-0 bottom-0 bg-primary-green rounded-full"
                animate={{
                  left: ['-50%', '30%', '100%'],
                  width: ['5%', '45%', '10%'],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              />
            </div>

            <motion.p
              custom={1.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fallOut}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl"
            >
              But it does. Every single year, millions of Nigerians navigate a system built to exhaust them.
              <span className="font-semibold text-slate-900 block sm:inline sm:ml-1">
                Conekta was built because we lived it.
              </span>
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 perspective-[1500px]">
          {painPoints.map((item, index) => (
            <FlipCard
              key={item.id}
              item={item}
              className={`${
                index === 3 ? 'lg:col-span-1 lg:col-start-1' : ''
              } ${index === 4 ? 'lg:col-span-1 lg:col-start-2' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}