'use client'
import logo from '@/public/svg/logo-outline-white.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { usePathname } from 'next/navigation';

import link1 from '@/public/svg/Template.svg'
import link2 from '@/public/svg/CreditCardOutline.svg'
import link3 from '@/public/svg/FilterOutline.svg'
import link4 from '@/public/svg/Icon.svg'
import link5 from '@/public/svg/iconamoon_profile.svg'
import link6 from '@/public/svg/ph_building-apartment.svg'

export default function ListerSideBar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const currentName = user?.user?.profile?.full_name || '';
    const unreadInboxCount = 5;
    const pathname = usePathname();
    
    // Clean string slug matching standard router segment paths
    const userSlug = currentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const links = [
        { title: 'Dashboard', link: `/lister/${userSlug}`, icon: link1, isInbox: false, exact: true },
        { title: 'Properties', link: `/lister/${userSlug}/properties`, icon: link6, isInbox: false },
        { title: 'Analytics', link: `/lister/${userSlug}/analytics`, icon: link3, isInbox: false },
        { title: 'My Wallet', link: `/lister/${userSlug}/myWallet`, icon: link2, isInbox: false },
        { title: 'Inbox', link: `/lister/${userSlug}/inbox`, icon: link4, isInbox: true },
        { title: 'My Profile', link: `/lister/${userSlug}/my-profile`, icon: link5, isInbox: false },
    ];

    if (!currentName) {
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
        <div className="py-5 px-3 flex flex-col h-full text-white">
            <div className="mb-8 flex items-center px-5">
                <Image src={logo} alt="logo" width={40} height={40} className="w-10 h-auto" />
            </div>

            <nav className="flex flex-col space-y-2">
                {links.map((link) => {
                    // Normalize both strings to prevent minor trailing slash mismatches
                    const normalizedPath = pathname.replace(/\/$/, '');
                    const normalizedLink = link.link.replace(/\/$/, '');

                    const isActive = link.exact 
                        ? normalizedPath === normalizedLink
                        : normalizedPath.startsWith(normalizedLink);

                    // Debug tracker: Check what values are trying to compare in your browser console
                    console.log(`Comparing Active UI -> Pathname: "${normalizedPath}" | Link: "${normalizedLink}" -> Match: ${isActive}`);

                    return (
                        <Link 
                            key={link.title} 
                            href={link.link} 
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

                            {/* FLOATING BADGE */}
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
    );
}