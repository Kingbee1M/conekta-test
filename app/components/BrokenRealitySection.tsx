'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Ghost, 
  ShieldAlert, 
  CalendarX, 
  Layers, 
  Lock 
} from 'lucide-react';

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

interface PainPoint {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const painPoints: PainPoint[] = [
  {
    id: '01',
    number: '01',
    title: 'Ghost listings everywhere',
    description:
      'You call 20 agents. Half the properties don’t exist. The other half are already taken. Nobody tells you the truth.',
    icon: Ghost,
  },
  {
    id: '02',
    number: '02',
    title: 'Agent extortion',
    description:
      'Unregulated agents charge 10%+ on both sides with zero accountability. No receipts. No recourse. No justice.',
    icon: ShieldAlert,
  },
  {
    id: '03',
    number: '03',
    title: '2 years upfront',
    description:
      'Landlords demand 24 months rent before you move in. Most Nigerians earn monthly. The math has never worked.',
    icon: CalendarX,
  },
  {
    id: '04',
    number: '04',
    title: 'Fragmented journey',
    description:
      'Search here. Finance there. Sign a paper lease. Pay cash to a stranger. Every step is a separate nightmare.',
    icon: Layers,
  },
  {
    id: '05',
    number: '05',
    title: 'Zero trust infrastructure',
    description:
      'Money moves on faith in Nigerian real estate. That faith is routinely broken. There is no escrow. No protection. No system.',
    icon: Lock,
  },
];

export default function BrokenRealitySection() {
  return (
    <section className="relative py-20 lg:py-28 bg-slate-50/50 text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Background Decorator Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
              THE BROKEN REALITY
            </span>
          </motion.div>

          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900"
          >
            Finding a home in Lagos <br className="hidden sm:inline" />
            should <span className="text-emerald-600 font-serif italic font-normal">not</span> feel like war.
          </motion.h2>

          <motion.p
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal"
          >
            But it does. Every single year, millions of Nigerians navigate a system built to exhaust them.
            <span className="font-semibold text-slate-800 block sm:inline sm:ml-1">
              Conekta was built because we lived it.
            </span>
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {painPoints.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                custom={index + 3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between ${
                  index === 3 ? 'lg:col-span-1 lg:col-start-1' : ''
                } ${
                  index === 4 ? 'lg:col-span-1 lg:col-start-2' : ''
                }`}
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-slate-300 group-hover:text-emerald-500 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Border Accent line on hover */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Current Status Quo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}