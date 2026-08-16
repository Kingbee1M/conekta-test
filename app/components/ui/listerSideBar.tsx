'use client'
import logo from '@/public/svg/logo-outline-white.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/store/store';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { useState } from 'react';
import Loading from '@/app/loading'; 
import { FlatUserData } from '@/types';

import link1 from '@/public/svg/Template.svg'
import link2 from '@/public/svg/CreditCardOutline.svg'
import link3 from '@/public/svg/FilterOutline.svg'
import link4 from '@/public/svg/Icon.svg'
import link5 from '@/public/svg/iconamoon_profile.svg'
import link6 from '@/public/svg/ph_building-apartment.svg'

import help from '@/public/svg/help.svg'
import logout from '@/public/svg/logout.svg'

interface ListerSideBarProps {
  onItemClick?: () => void; 
}

export default function ListerSideBar({ onItemClick }: ListerSideBarProps) {
    const { listerProfile } = useSelector((state: RootState) => state.auth);
    
    const unreadInboxCount = 5;
    const pathname = usePathname();

    const dispatch = useDispatch<AppDispatch>();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true); 
            await dispatch(logoutUser());
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false); 
        }
    };

    const links = [
        { title: 'Dashboard', link: `/lister-dashboard`, icon: link1, isInbox: false, exact: true },
        { title: 'Properties', link: `/properties`, icon: link6, isInbox: false },
        { title: 'Analytics', link: `/analytics`, icon: link3, isInbox: false },
        { title: 'Rented Listings', link: `/rented-listings`, icon: link2, isInbox: false },
        { title: 'Inbox', link: `/inbox`, icon: link4, isInbox: true },
        { title: 'My Profile', link: `/my-profile`, icon: link5, isInbox: false },
    ];

    const links2 = [
        { title: 'Help & Support', link: `/support`, icon: help, isInbox: false },
        { title: 'Log Out', link: '#', icon: logout, isInbox: false },
    ];

    if (!listerProfile) {
        return (
            <div className="py-5 px-3 flex flex-col h-full text-white animate-pulse">
                <div className="mb-8 flex items-center px-5">
                    <div className="w-10 h-10 bg-white/20 rounded-lg" />
                </div>
                <div className="space-y-3 px-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-white/10 rounded-xl w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoggingOut && <Loading />}

            <div className="py-5 px-3 flex flex-col justify-between h-full text-white">
                <div className='flex flex-col'>
                    <div className="mb-8 flex items-center px-5">
                        <Image src={logo} alt="logo" width={40} height={40} className="w-10 h-auto" />
                    </div>

                    <nav className="flex flex-col space-y-2">
                        {links.map((link) => {
                            const normalizedPath = pathname.replace(/\/$/, '');
                            const normalizedLink = link.link.replace(/\/$/, '');

                            const isActive = link.exact 
                                ? normalizedPath === normalizedLink
                                : normalizedPath.startsWith(normalizedLink);

                            return (
                                <Link 
                                    key={link.title} 
                                    href={link.link} 
                                    onClick={onItemClick} 
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-[0.98] group ${
                                        isActive ? 'bg-green-300/40 hover:bg-active-link font-semibold' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-3.5">
                                        <Image 
                                            src={link.icon} 
                                            alt={link.title} 
                                            width={20} 
                                            height={20} 
                                            className={`w-5 h-5 transition ${
                                                isActive ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100'
                                            }`} 
                                        />
                                        <span className="text-sm font-medium tracking-wide group-hover:text-white text-white/95">
                                            {link.title}
                                        </span>
                                    </div>

                                    {link.isInbox && unreadInboxCount > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-sm animate-pulse">
                                            {unreadInboxCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <nav className="flex flex-col space-y-2">
                        {links2.map((link, index) => {
                            const normalizedPath = pathname.replace(/\/$/, '');
                            const normalizedLink = link.link.replace(/\/$/, '');
                            const isActive = normalizedPath === normalizedLink;
                            const isLogoutButton = index === 1;

                            return isLogoutButton ? (
                                <button
                                    key={link.title}
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-600 disabled:opacity-50 active:scale-[0.98] group cursor-pointer text-left"
                                >
                                    <div className="flex items-center space-x-3.5">
                                        <Image
                                            src={link.icon}
                                            alt={link.title}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 opacity-80 group-hover:opacity-100"
                                        />
                                        <span className="text-sm font-medium tracking-wide group-hover:text-white text-white/95">
                                            {isLoggingOut ? 'Logging out...' : link.title}
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    key={link.title}
                                    href={link.link}
                                    onClick={onItemClick}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-[0.98] group ${
                                        isActive ? 'bg-green-300/40 hover:bg-active-link font-semibold' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-3.5">
                                        <Image
                                            src={link.icon}
                                            alt={link.title}
                                            width={20}
                                            height={20}
                                            className={`w-5 h-5 transition ${
                                                isActive ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100'
                                            }`}
                                        />
                                        <span className="text-sm font-medium tracking-wide group-hover:text-white text-white/95">
                                            {link.title}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}