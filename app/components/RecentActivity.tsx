'use client';

import Link from 'next/link';
import { 
  FiHome, 
  FiUserCheck, 
  FiCheckCircle, 
  FiTrash2, 
  FiEdit, 
  FiCalendar, 
  FiTag, 
  FiActivity 
} from 'react-icons/fi';

export enum ActivityType {
  CREATE_LISTING = 'CREATE_LISTING',
  DELETE_LISTING = 'DELETE_LISTING',
  EDIT_LISTING = 'EDIT_LISTING',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  SOLD_LISTING = 'SOLD_LISTING',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED'
}

export interface RecentActivityItem {
  id: string | number;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

// Sample mock data aligned with your backend interface
const activities: RecentActivityItem[] = [
  {
    id: '1',
    type: ActivityType.CREATE_LISTING,
    title: 'John Doe',
    description: 'published a new listing - Fully Detached Duplex, Lekki',
    timestamp: '12 minutes ago',
  },
  {
    id: '2',
    type: ActivityType.APPOINTMENT_BOOKED,
    title: 'Tunde Matesun',
    description: 'submitted 3 Bedroom Apartment for review, Ajah',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    type: ActivityType.SOLD_LISTING,
    title: 'Chika Eze',
    description: 'closed a deal on Fully Detached Duplex, Bourdillon',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    type: ActivityType.DELETE_LISTING,
    title: 'Studio Apartment in Ikeja',
    description: 'was deactivated for incomplete documents',
    timestamp: '1 day ago',
  },
];

export default function RecentActivity() {
  const getActivityStyle = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CREATE_LISTING:
        return { icon: FiHome, bg: 'bg-emerald-100 text-emerald-600' };
      
      case ActivityType.SOLD_LISTING:
        return { icon: FiCheckCircle, bg: 'bg-emerald-100 text-emerald-600' };

      case ActivityType.VERIFICATION_APPROVED:
        return { icon: FiUserCheck, bg: 'bg-emerald-100 text-emerald-600' };

      case ActivityType.APPOINTMENT_BOOKED:
        return { icon: FiCalendar, bg: 'bg-amber-100 text-amber-600' };

      case ActivityType.OFFER_RECEIVED:
        return { icon: FiTag, bg: 'bg-blue-100 text-blue-600' };

      case ActivityType.EDIT_LISTING:
        return { icon: FiEdit, bg: 'bg-indigo-100 text-indigo-600' };

      case ActivityType.DELETE_LISTING:
        return { icon: FiTrash2, bg: 'bg-rose-100 text-rose-600' };

      default:
        return { icon: FiActivity, bg: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">Platform-wide events</p>
        </div>
        <Link 
          href="/activity" 
          className="text-xs font-semibold text-gray-700 hover:text-primary-green transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-2.5">
        {activities.map((item) => {
          const { icon: Icon, bg } = getActivityStyle(item.type);

          return (
            <div 
              key={item.id} 
              className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className="text-sm" />
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900">{item.title} </span>
                <span>{item.description}</span>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}