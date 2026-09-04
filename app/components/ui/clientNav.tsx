'use client'
import { usePathname } from 'next/navigation';
import Navbar from "./navbar";


export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavOn = ['/', '/get-started', '/home', '/discover', '/find-artisan', '/profile', '/housing-hub', 'verify-account', 'how-it-works', 'about-us'];

  const shouldShowNav = showNavOn.some(path => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  if (!shouldShowNav) return null;

  return <Navbar />;
}