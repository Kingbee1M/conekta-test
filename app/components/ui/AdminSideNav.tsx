'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { RootState } from '@/shared/store/store';
import { RoleEnum } from '@/shared/enums/roles.enum'; // Adjust import path if needed
import { 
  IoGridOutline, 
  IoSettingsOutline, 
  IoHelpCircleOutline, 
  IoLogOutOutline,
  IoMailOutline
} from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { BiBuildings } from "react-icons/bi";
import { BsPeople, BsPersonBadge } from "react-icons/bs";
import { TbCurrencyNaira, TbUserCheck } from "react-icons/tb";
import { FaCheckDouble } from "react-icons/fa6";

import logo from '@/public/svg/logo-outline-white.svg';

// --- Loading Component Overlay ---
function LogoutLoadingOverlay() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Spinner Container */}
        <div className="relative flex items-center justify-center w-32 h-32">
          <div className="absolute inset-0 border-6 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-7xl font-bold text-primary-green select-none">C</h1>
        </div>

        {/* Text with animated dots */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-primary-green font-semibold text-lg min-w-[280px] text-center">
            Logging you out safely{dots}
          </p>
          
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1 w-12 bg-primary-green rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// --- Navigation Item Interface ---
interface NavItem {
  title: string;
  link: string;
  icon: React.ElementType;
  superAdminOnly?: boolean; // Requires SUPER_ADMIN role
  badge?: number;
}

export default function AdminSideNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Pull Redux auth state
  const { session, listerProfile } = useAppSelector((state: RootState) => state.auth);

  // Check if current user is Super Admin
  const isSuperAdmin =
    session?.active_role === RoleEnum.SUPER_ADMIN ||
    session?.user?.other_roles.includes(RoleEnum.SUPER_ADMIN);

  const mainNav: NavItem[] = [
    { title: 'Dashboard', link: '/admin/overview', icon: IoGridOutline },
    { title: 'Employees', link: '/admin/admin-users', icon: RiAdminLine, superAdminOnly: true },
    { title: 'Properties', link: '/admin/listings', icon: BiBuildings, superAdminOnly: true },
    { title: 'Customers', link: '/admin/customer-users', icon: BsPeople },
    { title: 'Listers', link: '/admin/lister-users', icon: BsPersonBadge },
    { title: 'Artisans', link: '/admin/artisan-users', icon: TbUserCheck, superAdminOnly: true },
    { title: 'Transactions', link: '/admin/transactions', icon: TbCurrencyNaira, superAdminOnly: true },
    { title: 'Inbox', link: '/admin/inbox', icon: IoMailOutline, superAdminOnly: true, badge: 2 },
    { title: 'Verification', link: '/admin/verification', icon: FaCheckDouble },
  ];

  const bottomNav: NavItem[] = [
    { title: 'Settings', link: '/settings', icon: IoSettingsOutline, superAdminOnly: true },
    { title: 'Help & Support', link: '/support', icon: IoHelpCircleOutline, superAdminOnly: true },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Failed to log out:', error);
      setIsLoggingOut(false);
    }
  };

  const renderNavLink = (nav: NavItem) => {
    // 🛑 Hide Super Admin routes if user isn't Super Admin
    if (nav.superAdminOnly && !isSuperAdmin) {
      return null;
    }

    const isActive = pathname === nav.link;
    const Icon = nav.icon;

    return (
      <Link
        key={nav.title}
        href={nav.link}
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all group active:scale-[0.98] ${
          isActive
            ? 'bg-secondary-green text-[#0A5C36] font-bold shadow-xs'
            : 'text-white hover:bg-secondary-green'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="text-base text-white shrink-0" />
          <span className='text-white'>{nav.title}</span>
        </div>

        {nav.badge !== undefined && (
          <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
            isActive ? 'bg-[#0A5C36] text-white' : 'bg-[#00AC72] text-white'
          }`}>
            {nav.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Full-screen Loading Overlay on Logout */}
      {isLoggingOut && <LogoutLoadingOverlay />}

      <aside className="bg-primary-green w-full h-screen flex flex-col justify-between overflow-hidden select-none">
        {/* Scrollable Container with Inset Scrollbar & Internal Padding */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col justify-between">
          
          {/* Main Content */}
          <div className="flex flex-col gap-8">
            {/* Logo Container */}
            <div className="px-2">
              <Image src={logo} alt="Conekta Logo" width={120} height={40} className="w-10 h-auto" priority />
            </div>

            {/* Main Navigation Stack */}
            <nav className="flex flex-col gap-1">
              {mainNav.map(renderNavLink)}
            </nav>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex flex-col gap-1 pt-6 border-t border-white/10 mt-6">
            {bottomNav.map(renderNavLink)}

            {/* Red Hover Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-white hover:bg-red-400 hover:text-red-300 transition-colors cursor-pointer w-full text-left active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoLogOutOutline className="text-base shrink-0" />
              <span className='text-white'>Log Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}