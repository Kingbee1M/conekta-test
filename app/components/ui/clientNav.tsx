'use client'
import { usePathname } from 'next/navigation';
import Navbar from "./navbar";

const noNav = [
  '/log-in', 
  '/sign-up', 
  '/dashboard', 
  '/loading-dashboard', 
  '/lister', 
  '/customer'
];

export default function NavbarWrapper() {
  const pathname = usePathname();
  const shouldHideNav = noNav.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (shouldHideNav) return null;

  return <Navbar />;
}