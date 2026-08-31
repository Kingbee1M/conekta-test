'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Check, Flag, Upload } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'verified' | 'flagged' | 'submitted';
  title: string;
  boldText?: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'verified',
    boldText: 'Chika Eze',
    title: 'was verified as a lister',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'flagged',
    boldText: "Ifeoma Chukwu's",
    title: 'passport was flagged - blurry image',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'submitted',
    boldText: 'Emeka Nwosu',
    title: 'submitted verification for review',
    timestamp: '8 hours ago',
  },
];

// Added explicit Variants type annotations to satisfy TypeScript
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function RecentActivities({
  activities = MOCK_ACTIVITIES,
}: {
  activities?: ActivityItem[];
}) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'verified':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-700" />
          </div>
        );
      case 'flagged':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Flag className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'submitted':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4 text-blue-600" />
          </div>
        );
    }
  };

  return (
    <div className="bg-[#F3F4F6] rounded-2xl p-6 space-y-4 border border-stone-200/50 shadow-2xs">
      <div>
        <h3 className="text-base font-bold text-stone-900">Recent Verification Activities</h3>
        <p className="text-xs font-medium text-stone-500">Latest decisions across all roles</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-stone-200/70"
      >
        {activities.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="py-3 flex items-center gap-3 first:pt-0 last:pb-0 group"
          >
            {getIcon(item.type)}
            <div>
              <p className="text-xs text-stone-800">
                {item.boldText && <span className="font-bold">{item.boldText} </span>}
                <span className="font-medium">{item.title}</span>
              </p>
              <span className="text-[11px] font-medium text-stone-500">{item.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}