'use client';

import { ReactNode, useState } from 'react';
import ListerSideBar from '@/app/components/ui/listerSideBar';

interface ListerLayoutProps {
  children: ReactNode;
}

export default function ListerLayout({ children }: ListerLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <div className="block md:grid md:grid-cols-[200px_1fr] min-h-screen w-full overflow-x-hidden">
      
      {/* =========================================================================
          DESKTOP SIDEBAR CONTAINER (Hidden on Mobile View)
          ========================================================================= */}
      <aside className="hidden md:block bg-primary-green w-full min-h-screen sticky top-0 h-screen overflow-y-auto">
        <ListerSideBar />
      </aside>

      {/* =========================================================================
          MOBILE SIDEBAR DRAWER SYSTEM
          ========================================================================= */}
      {/* A. Blur Overlay Backdrop (Only triggers when open) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* B. Slide-Out Panel Container */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[240px] bg-primary-green z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Optional: Add a close button inside the mobile drawer top */}
        <div className="p-4 flex justify-end">
          <button 
            onClick={closeSidebar} 
            className="text-white hover:opacity-80 p-1 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Reuse your exact component logic inside the slide-out panel */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <ListerSideBar />
        </div>
      </div>

      {/* =========================================================================
          MAIN CORE VIEW CONTENT PANEL AREA
          ========================================================================= */}
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        
        {/* Mobile-Only Header Bar containing our hamburger drawer button toggle action */}
        <header className="flex md:hidden items-center justify-between px-4 h-14 bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition focus:outline-none"
            aria-label="Open navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <span className="font-semibold text-sm text-gray-800">Lister Panel</span>
          <div className="w-6 h-6 rounded-full bg-gray-200" /> {/* Balanced Spacer */}
        </header>

        {/* Dynamic Inner Child Pages Render Zone */}
        <main className="flex-1 w-full p-4 md:p-5 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}