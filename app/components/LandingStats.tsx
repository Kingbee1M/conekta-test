'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Counter from './ui/counterComp';

export default function LandingStats() {
  const sectionRef = useRef<HTMLElement>(null);

  // Raw mouse offsets relative to the center of the container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid floating response
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Generate varied layer depth translations (some move further, some invert direction)
  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [30, -30]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [30, -30]);

  const layer3X = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const layer3Y = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    
    // Calculate normalized cursor offset from center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const stats = [
    { number: 5000, suffix: '+', label: 'Properties Available' },
    { number: 20000, suffix: '+', label: 'Active Users' },
    { number: 500, suffix: '+', label: 'Verified Artisans' },
    { number: 2, suffix: 'B+', prefix: '₦', label: 'In Completed Transactions' },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-16 md:py-24 bg-white text-slate-900 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* ================= BACKGROUND PARALLAX OBJECTS ================= */}

      {/* Top Left: Concentric Wireframe Circle */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute -top-16 -left-16 pointer-events-none z-0 opacity-40"
      >
        <div className="w-64 h-64 rounded-full border border-primary-green/30 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full border border-primary-green/20" />
        </div>
      </motion.div>

      {/* Bottom Left: Solid Glow Circle */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute -bottom-20 -left-12 pointer-events-none z-0 opacity-20"
      >
        <div className="w-56 h-56 rounded-full bg-primary-green blur-xl" />
      </motion.div>

      {/* Top Right: Dot Matrix Grid */}
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        className="absolute top-8 right-12 pointer-events-none z-0 opacity-25 hidden sm:block"
      >
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary-green" />
          ))}
        </div>
      </motion.div>

      {/* Bottom Right: Concentric Wireframe Arch */}
      <motion.div
        style={{ x: layer1X, y: layer2Y }}
        className="absolute -bottom-24 -right-20 pointer-events-none z-0 opacity-30"
      >
        <div className="w-80 h-80 rounded-full border-2 border-primary-green/30 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-primary-green/20" />
        </div>
      </motion.div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet CONEKTA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A platform engineered to handle all your housing and real estate needs seamlessly while offering continuous, reliable support.
          </p>
        </div>

        {/* Statistics Grid with Dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-8 md:gap-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center px-4 md:px-6 ${
                index !== stats.length - 1
                  ? 'md:border-r md:border-slate-200'
                  : ''
              } ${index % 2 === 0 ? 'border-r border-slate-200 md:border-r-0' : ''}`}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
                <Counter
                  targetValue={stat.number}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-40 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}