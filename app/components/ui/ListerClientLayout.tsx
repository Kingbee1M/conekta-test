'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/shared/store/store';
import ListerSideBar from '@/app/components/ui/listerSideBar';

interface ListerClientLayoutProps {
  children: ReactNode;
}

export default function ListerClientLayout({ children }: ListerClientLayoutProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Read from our newly separated "session" slice
  const { session, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  // 2. Compute authorization status on the fly
  const activeRole = session?.active_role?.toLowerCase();
  const isAuthorized = isAuthenticated && session && activeRole === 'lister';

  // 3. Handle redirects purely as a side effect
  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/log-in');
    } else if (activeRole !== 'lister') {
      router.replace('/unauthorized');
    }
  }, [session, isAuthenticated, activeRole, router]);

  // 4. Show the loading spinner while auth resolves
  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="block md:grid md:grid-cols-[200px_1fr] h-screen w-full overflow-x-hidden overflow-y-auto">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block bg-primary-green w-full h-full max-h-screen sticky top-0 overflow-y-auto">
        <ListerSideBar />
      </aside>

      {/* MOBILE BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* MOBILE SLIDE-OUT DRAWER */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-60 bg-primary-green z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
        
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <ListerSideBar />
        </div>
      </div>

      {/* MAIN VIEW CONTENT AREA */}
      <div className="flex flex-col h-auto w-full bg-gray-50">
        
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
          <div className="w-6 h-6 rounded-full bg-gray-200" />
        </header>

        <main className="flex-1 w-full p-4 md:p-5 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}