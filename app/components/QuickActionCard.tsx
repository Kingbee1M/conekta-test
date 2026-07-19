import { LuSearch, LuWrench, LuHistory, LuHandHelping } from 'react-icons/lu';

interface QuickActionsCardProps {
  onActionSelect: (actionKey: string) => void;
}

export default function QuickActionsCard({ onActionSelect }: QuickActionsCardProps) {
  const actions = [
    { key: 'find', name: 'Find New Property', icon: LuSearch },
    { key: 'artisan', name: 'Book Artisan', icon: LuWrench },
    { key: 'history', name: 'Payment History', icon: LuHistory },
    { key: 'support', name: 'Contact Support', icon: LuHandHelping },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col text-left">
      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Quick Actions</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={() => onActionSelect(action.key)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-500/40 hover:bg-emerald-50/10 text-xs font-bold text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer text-left"
            >
              <Icon className="text-base text-gray-400" />
              {action.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}