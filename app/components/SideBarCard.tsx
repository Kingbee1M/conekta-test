import { TenantProfileData } from '../(customer)/profile/page';
import { LuLayoutDashboard, LuReceipt, LuHeart, LuBell, LuCircleHelp, LuSettings } from 'react-icons/lu';

type SidebarTab = 'dashboard' | 'transactions' | 'saved' | 'notifications' | 'support' | 'settings';

interface SidebarCardProps {
  tenant: TenantProfileData;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export default function SidebarCard({ tenant, activeTab, setActiveTab }: SidebarCardProps) {
  const menus: { id: SidebarTab; name: string; icon: typeof LuLayoutDashboard }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LuLayoutDashboard },
    { id: 'transactions', name: 'Transactions', icon: LuReceipt },
    { id: 'saved', name: 'Saved Properties', icon: LuHeart },
    { id: 'notifications', name: 'Notifications', icon: LuBell },
    { id: 'support', name: 'Support', icon: LuCircleHelp },
    { id: 'settings', name: 'Settings', icon: LuSettings },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col items-center text-center">
      {/* Dynamic Initials Badge */}
      <div className="w-14 h-14 bg-emerald-50 text-[#00AC72] font-bold text-lg rounded-full flex items-center justify-center mb-3">
        {tenant.avatarInitials}
      </div>
      <h3 className="text-sm font-bold text-gray-800">{tenant.name}</h3>
      <p className="text-[11px] text-gray-400 mb-2 truncate max-w-full">{tenant.email}</p>
      {tenant.isVerified && (
        <span className="bg-gray-100 text-gray-500 font-medium tracking-tight text-[10px] px-2.5 py-0.5 rounded-full mb-6">
          Verified Tenant
        </span>
      )}

      {/* Nav Actions Links stack */}
      <nav className="w-full flex flex-col gap-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-emerald-50/60 text-[#00AC72]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`text-base ${isActive ? 'text-[#00AC72]' : 'text-gray-400'}`} />
              {menu.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}