'use client'
import { usePathname } from 'next/navigation';
import Footer from './footer';
const noNav = ['/log-in', '/sign-up', '/verify-email', '/lister'];

export default function FooterWrapper() {
  const pathname = usePathname();
    const shouldHideNav = noNav.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    if (shouldHideNav) return null;

  return <Footer />;
}