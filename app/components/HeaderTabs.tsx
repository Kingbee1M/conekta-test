'use client';

import { LuHouse, LuMessageSquare, LuHammer } from "react-icons/lu";

type TabType = 'dashboard' | 'chat' | 'maintenance';

interface HeaderTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  address: string;
}

export default function HeaderTabs({ activeTab, setActiveTab, address }: HeaderTabsProps) {
  const tabs = [
    { key: 'dashboard', label: 'Overview', icon: <LuHouse /> },
    { key: 'chat', label: 'Message Board', icon: <LuMessageSquare /> },
    { key: 'maintenance', label: 'Artisan Logs', icon: <LuHammer /> }
  ] as const;

  return (
    <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Tenancy</span>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">My Housing Hub</h1>
        <p className="text-sm text-gray-500 mt-1">{address}</p>
      </div>

      <div className="flex bg-gray-100/80 p-1 rounded-2xl border border-gray-200/40 select-none w-full md:w-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}