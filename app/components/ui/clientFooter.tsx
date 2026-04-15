'use client'
import { usePathname } from 'next/navigation';
import Footer from './footer';
const noNav = ['/log-in', '/sign-up'];

export default function FooterWrapper() {
  const pathname = usePathname();
  
  if (noNav.includes(pathname)) return null;

  return <Footer />;
}