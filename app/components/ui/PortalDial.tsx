'use client';

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Building2, User, Wrench } from 'lucide-react';

interface PortalDialProps {
  value: RoleEnum;
  onChange: (role: RoleEnum) => void;
}

const PORTALS = [
  { role: RoleEnum.CUSTOMER, label: 'Customer', icon: User, color: '#00AC72' },
  { role: RoleEnum.LISTER, label: 'Lister', icon: Building2, color: '#2563EB' },
  { role: RoleEnum.ARTISAN, label: 'Artisan', icon: Wrench, color: '#D97706' },
];

export function PortalDial({ value, onChange }: PortalDialProps) {
  return (
    <nav aria-label="Choose a portal" className="portal-switcher">
      {PORTALS.map(({ role, label, icon: Icon, color }) => {
        const selected = role === value;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            aria-pressed={selected}
            aria-label={`${label} portal`}
            className={`portal-switcher-button ${selected ? 'is-selected' : ''}`}
            style={{ '--portal-color': color } as CSSProperties}
          >
            {selected && <motion.span layoutId="active-portal-marker" className="portal-switcher-marker" />}
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
