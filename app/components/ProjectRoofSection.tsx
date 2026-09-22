'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Heart, Home, ArrowRight, ShieldCheck } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export default function ProjectRoofSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-white text-text-primary overflow-hidden border-t border-slate-100">
      {/* Background Soft Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ backgroundColor: 'var(--color-primary-green)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="p-8 sm:p-12 lg:p-16 rounded-[36px] bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800"
        >
          {/* Subtle Inner Decorative Elements */}
          <div 
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-2xl pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--color-primary-green)' }}
          />
          <div 
            className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-2xl pointer-events-none opacity-15"
            style={{ backgroundColor: 'var(--color-secondary-green)' }}
          />

          <div className="relative z-10 max-w-2xl space-y-6 text-left">
            
            {/* Pill Badge */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className=""
            >
              <span className="text-[11px] font-bold tracking-widest text-tertiary-green uppercase">
                PROJECT ROOF
              </span>
            </motion.div>

            {/* Impact Headline */}
            <motion.h2
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none space-x-2"
            >
              <span className="text-primary-green">10% of every naira</span>
              <span className="font-normal text-white">builds real homes.</span>
            </motion.h2>

            {/* Subheading / Description */}
            <motion.p
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              Every transaction on Conekta funds permanent housing for Lagosians sleeping on the streets.{' '}
              <span className="font-semibold text-white">
                This is not charity. It is who we are.
              </span>
            </motion.p>

            {/* Highlighted Impact Metrics Grid */}
            <motion.div
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-2"
            >
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-primary-green mb-1.5">
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Impact Pledge</span>
                </div>
                <p className="text-2xl font-black text-white">10% Allocated</p>
                <p className="text-xs text-slate-400 mt-0.5">Directly funds shelters</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-primary-green mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Transparency</span>
                </div>
                <p className="text-2xl font-black text-white">100% Tracked</p>
                <p className="text-xs text-slate-400 mt-0.5">Public impact audits</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              custom={5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className="pt-2"
            >
              <Link
                href="/blog/project-roof-building-homes-for-those-who-have-none"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary-green hover:bg-primary-green-hover text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 group"
              >
                <span>Learn about Project Roof</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}