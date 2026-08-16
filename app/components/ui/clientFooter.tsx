'use client'

import { usePathname } from 'next/navigation';
import Footer from './footer';


export default function FooterWrapper() {
  const pathname = usePathname();
  const showNavOn = ['/', '/get-started', '/home', '/discover', '/my-housing', '/find-artisan', '/housing-hub', 'verify-account'];

  const shouldShowNav = showNavOn.some(path => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  if (!shouldShowNav) return null;

  return <Footer />;
}