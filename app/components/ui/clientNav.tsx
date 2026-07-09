'use client'
import { usePathname } from 'next/navigation';
import Navbar from "./navbar";
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { FlatUserData } from '@/types';


export default function NavbarWrapper() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const typedUser = user as FlatUserData & { user?: FlatUserData } | null;
  const targetUserObj = typedUser?.user || typedUser;
  const firstName = targetUserObj?.profile?.first_name || '';
  const lastName = targetUserObj?.profile?.last_name || '';
  
  const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
  const userSlug = currentName
    ? encodeURIComponent(currentName.toLowerCase().replace(/\s+/g, '-'))
    : 'workspace';

  const noNav = [
  '/log-in', 
  '/sign-up', 
  '/dashboard', 
  '/loading-dashboard', 
  `/${userSlug}`, 
  '/properties', 
  '/customer',
  '/verify-email',
  '/myWallet',
  '/analytics',
  '/my-profile',
  '/support',
];
  const pathname = usePathname();
  const shouldHideNav = noNav.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (shouldHideNav) return null;

  return <Navbar />;
}