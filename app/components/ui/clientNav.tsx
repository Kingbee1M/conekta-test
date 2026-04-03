'use client'
import { usePathname } from 'next/navigation';
import Navbar from "./navbar";

const noNav = ['/log-in', '/sign-up'];

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // If the current route is in our list, return nothing
  if (noNav.includes(pathname)) return null;

  return <Navbar />;
}