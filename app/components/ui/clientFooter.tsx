'use client'

import { usePathname } from 'next/navigation';
import Footer from './footer';


export default function FooterWrapper() {
  const pathname = usePathname();
  const showNavOn = ['/', '/get-started', '/home', '/find-property', '/my-housing', '/find-artisan', '/housing-hub'];

  const shouldShowNav = showNavOn.some(path => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  if (!shouldShowNav) return null;

  return <Footer />;
}