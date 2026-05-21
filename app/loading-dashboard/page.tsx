'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useStore } from 'react-redux';
import { RootState } from '@/shared/store/store';

export default function LoadingDashboard() {
  const router = useRouter();
  const store = useStore<RootState>();
  
  // 1. Removed isAuthenticated since it isn't being used here
  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // 2. EXPLICIT STORAGE ENGINE DIAGNOSTIC LOGS
    const currentReduxState = store.getState();
    console.log("🔍 RUNTIME REDUX STATE SNAPSHOT:", currentReduxState.auth);
    
    if (typeof window !== 'undefined') {
      const persistedRootData = localStorage.getItem('persist:conketa_root');
      console.log("💾 BROWSER STORAGE PERSIST RAW DATA:", persistedRootData);
    }

    // 3. Extract the name safely inside the hook to satisfy ESLint dependencies
    const currentName = user?.user?.profile?.full_name;

    if (currentName) {
      // 4. Using 'currentName' guarantees to TypeScript that this string is defined here
      const userSlug = encodeURIComponent(
        currentName.toLowerCase().trim().replace(/\s+/g, '-')
      );
      router.replace(`/lister/${userSlug}`);
      return;
    } 

    if (status === 'failed') {
      router.replace('/log-in');
      return;
    }

    const safetyTimer = setTimeout(() => {
      if (!user?.user?.profile?.full_name) {
        console.warn("🚨 Gateway timed out - Empty session data found.");
        router.replace('/log-in');
      }
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, [user, status, router, store]); // All dependencies are now perfectly balanced

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-green rounded-full animate-spin" />
        <div className="text-center font-semibold text-gray-800">Verifying storage state...</div>
      </div>
    </div>
  );
}