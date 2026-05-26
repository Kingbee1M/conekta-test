'use client';

import React from 'react';
import { ActivityType, RecentActivityItem } from '@/shared/enums/activity';
import { 
  FaHouseMedical, 
  FaRegTrashCan, 
  FaPenToSquare, 
  FaCalendarCheck, 
  FaHandshake 
} from "react-icons/fa6";
import { MdLocalOffer, MdVerifiedUser } from "react-icons/md";

interface RecentActivityCompProps {
  activities: RecentActivityItem[];
}

// Map each Enum value cleanly to its icon graphic and specific style class rules
const activityConfigMap: Record<ActivityType, { icon: React.ReactNode; bg: string; text: string }> = {
  [ActivityType.CREATE_LISTING]: { icon: <FaHouseMedical />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  [ActivityType.DELETE_LISTING]: { icon: <FaRegTrashCan />, bg: 'bg-rose-50', text: 'text-rose-600' },
  [ActivityType.EDIT_LISTING]: { icon: <FaPenToSquare />, bg: 'bg-amber-50', text: 'text-amber-600' },
  [ActivityType.APPOINTMENT_BOOKED]: { icon: <FaCalendarCheck />, bg: 'bg-blue-50', text: 'text-blue-600' },
  [ActivityType.SOLD_LISTING]: { icon: <FaHandshake />, bg: 'bg-purple-50', text: 'text-purple-600' },
  [ActivityType.OFFER_RECEIVED]: { icon: <MdLocalOffer />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  [ActivityType.VERIFICATION_APPROVED]: { icon: <MdVerifiedUser />, bg: 'bg-teal-50', text: 'text-teal-600' },
};

export default function RecentActivityComp({ activities = [] }: RecentActivityCompProps) {
  
  // Enforce a strict fallback limit to keep the view to the 5 most recent events
  const displayActivities = activities.slice(0, 5);

  // Helper utility to turn ISO timestamps into compact, scannable relative times
  const formatTimeAgo = (isoString: string) => {
    try {
      const parsedDate = new Date(isoString);
      if (isNaN(parsedDate.getTime())) return 'Now';
      
      const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      return parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between box-border overflow-hidden">
      
      {/* Dynamic Activity Card Header Row */}
      <div className="w-full flex justify-between items-center mb-2 shrink-0">
        <h3 className="font-bold text-gray-800 text-xs tracking-wide">Recent Activity</h3>
        <span className="text-[9px] bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase tracking-wider">
          Log Stream
        </span>
      </div>

      {/* Feed Layout Stream Frame */}
      <div className="w-full flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-none custom-scrollbar">
        {displayActivities.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-center py-6">
            <span className="text-[11px] text-gray-400 font-medium">No recent activities logged</span>
          </div>
        ) : (
          displayActivities.map((activity) => {
            const config = activityConfigMap[activity.type] || activityConfigMap[ActivityType.EDIT_LISTING];
            
            return (
              <div 
                key={activity.id} 
                className="w-full flex items-center justify-between p-2 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100/50"
              >
                {/* Meta Details Grouping */}
                <div className="flex flex-col min-w-0 flex-1 pr-2">
                  <span className="text-[11px] font-bold text-gray-800 truncate leading-tight">
                    {activity.title}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 truncate mt-0.5">
                    {activity.description}
                  </span>
                </div>

                {/* Right Aligned Context Badge and Timestamp Cluster */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[9px] text-gray-400 font-bold text-right whitespace-nowrap">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  <div className={`w-7 h-7 rounded-lg ${config.bg} ${config.text} flex items-center justify-center text-sm shadow-sm`}>
                    {config.icon}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}