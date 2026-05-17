"use client";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/shared/store/store';

export default function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Set a client-side cookie that the server can see
      // No HttpOnly here, because we NEED the frontend to write it
      document.cookie = "isLoggedIn=true; path=/; max-age=86400; SameSite=Lax";
    } else {
      // Clear it if they log out
      document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}