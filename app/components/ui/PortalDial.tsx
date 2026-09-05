'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { User, Building2, Wrench } from 'lucide-react';

interface PortalDialProps {
  value: RoleEnum;
  onChange: (role: RoleEnum) => void;
}

const ROLES_CONFIG = [
  {
    role: RoleEnum.CUSTOMER,
    label: 'Customer',
    icon: User,
    color: '#00AC72',
  },
  {
    role: RoleEnum.LISTER,
    label: 'Lister',
    icon: Building2,
    color: '#2563EB',
  },
  {
    role: RoleEnum.ARTISAN,
    label: 'Artisan',
    icon: Wrench,
    color: '#D97706',
  },
];

export function PortalDial({ value, onChange }: PortalDialProps) {
  const selectedIndex = ROLES_CONFIG.findIndex((item) => item.role === value);

  // Each item occupies 120 deg (360 / 3).
  const rotationDegree = -(selectedIndex * 120);

  const activeConfig = ROLES_CONFIG[selectedIndex] || ROLES_CONFIG[0];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="flex flex-col items-center my-2 select-none">
      <label className="text-[11px] font-semibold mb-2 text-gray-700">
        Select Portal Mode
      </label>

      {/* Compact Dial Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Fixed Outer Indicator Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 pointer-events-none" />

        {/* Top Aperture Pointer / Notch dynamically colored to match active portal */}
        <div className="absolute -top-1 z-30 flex flex-col items-center">
          <div
            className="w-2.5 h-2.5 rotate-45 rounded-xs shadow-xs transition-colors duration-300"
            style={{ backgroundColor: activeConfig.color }}
          />
        </div>

        {/* Rotatable Inner Ring */}
        <motion.div
          className="w-26 h-26 rounded-full relative flex items-center justify-center bg-gray-50 border border-gray-200 shadow-inner"
          animate={{ rotate: rotationDegree }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        >
          {ROLES_CONFIG.map((config, idx) => {
            const Icon = config.icon;
            const angle = idx * 120;
            const radius = 38;
            const x = Math.sin((angle * Math.PI) / 180) * radius;
            const y = -Math.cos((angle * Math.PI) / 180) * radius;

            const isSelected = config.role === value;

            return (
              <button
                key={config.role}
                type="button"
                onClick={() => onChange(config.role)}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${-angle}deg)`,
                  borderColor: isSelected ? config.color : 'transparent',
                }}
                className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-xs border-2 scale-105'
                    : 'bg-gray-200/80 hover:bg-gray-300 text-gray-500 scale-90'
                }`}
              >
                <motion.div
                  animate={{ rotate: -rotationDegree }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <Icon
                    size={13}
                    style={{ color: isSelected ? config.color : undefined }}
                  />
                </motion.div>
              </button>
            );
          })}
        </motion.div>

        {/* Center Static Display */}
        <div className="absolute w-14 h-14 rounded-full bg-white shadow-xs border border-gray-100 flex flex-col items-center justify-center z-20 pointer-events-none">
          <ActiveIcon size={14} style={{ color: activeConfig.color }} />
          <span className="text-[9px] font-bold text-gray-800 capitalize mt-0.5">
            {activeConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}